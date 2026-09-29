import datetime
import decimal
import functools
from contextlib import contextmanager

import mysql.connector
from flask import Blueprint, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from config import Config


class ApiError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.message = message
        self.status = status


def get_conn():
    return mysql.connector.connect(
        host=Config.DB_HOST, port=Config.DB_PORT, user=Config.DB_USER,
        password=Config.DB_PASSWORD, database=Config.DB_NAME,
    )


def _clean(row):
    for k, v in row.items():
        if isinstance(v, decimal.Decimal):
            row[k] = float(v)
        elif isinstance(v, datetime.datetime):
            row[k] = v.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(v, datetime.date):
            row[k] = v.isoformat()
    return row


def query(sql, params=(), one=False):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params)
        rows = [_clean(r) for r in cur.fetchall()]
        if one:
            return rows[0] if rows else None
        return rows
    finally:
        conn.close()


def execute(sql, params=()):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        return cur.lastrowid, cur.rowcount
    finally:
        conn.close()


@contextmanager
def transaction():
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _serializer():
    return URLSafeTimedSerializer(Config.SECRET_KEY)


def make_token(user_id):
    return _serializer().dumps({"uid": user_id})


def token_required(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            raise ApiError("Authentication required", 401)
        try:
            _serializer().loads(header[7:], max_age=60 * 60 * 12)
        except (BadSignature, SignatureExpired):
            raise ApiError("Session expired. Please log in again.", 401)
        return f(*args, **kwargs)
    return wrapper


def clean_fields(data, spec):
    """spec = {field: (type, required)}; types: str, int, id, float, email, date"""
    out = {}
    for key, (typ, required) in spec.items():
        v = data.get(key)
        label = key.replace("_", " ").title()
        if v is None or (isinstance(v, str) and not v.strip()):
            if required:
                raise ApiError(f"{label} is required")
            out[key] = None
            continue
        try:
            if typ == "int":
                v = int(v); ok = v >= 0
            elif typ == "id":
                v = int(v); ok = v > 0
            elif typ == "float":
                v = round(float(v), 2); ok = v >= 0
            elif typ == "email":
                v = str(v).strip(); ok = "@" in v and "." in v.split("@")[-1]
            elif typ == "date":
                v = str(v)[:10]; datetime.date.fromisoformat(v); ok = True
            else:
                v = str(v).strip(); ok = True
        except (ValueError, TypeError):
            ok = False
        if not ok:
            raise ApiError(f"Invalid value for {label}")
        out[key] = v
    return out


def crud_blueprint(name, path, model, spec):
    bp = Blueprint(name, __name__)
    base = f"/api/{path}"

    @bp.get(base)
    @token_required
    def list_items():
        return jsonify(model.list_all())

    @bp.get(base + "/<int:item_id>")
    @token_required
    def get_item(item_id):
        row = model.get(item_id)
        if not row:
            raise ApiError("Record not found", 404)
        return jsonify(row)

    @bp.post(base)
    @token_required
    def create_item():
        data = clean_fields(request.get_json(silent=True) or {}, spec)
        return jsonify(model.get(model.create(data))), 201

    @bp.put(base + "/<int:item_id>")
    @token_required
    def update_item(item_id):
        if not model.get(item_id):
            raise ApiError("Record not found", 404)
        data = clean_fields(request.get_json(silent=True) or {}, spec)
        model.update(item_id, data)
        return jsonify(model.get(item_id))

    @bp.delete(base + "/<int:item_id>")
    @token_required
    def delete_item(item_id):
        if not model.get(item_id):
            raise ApiError("Record not found", 404)
        model.delete(item_id)
        return jsonify({"message": "Deleted successfully"})

    return bp
