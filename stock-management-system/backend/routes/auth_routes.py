from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash

from models import user
from utils.helpers import ApiError, make_token

bp = Blueprint("auth", __name__)


@bp.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    login_id = (data.get("username") or "").strip()
    password = data.get("password") or ""
    if not login_id or not password:
        raise ApiError("Username/email and password are required")
    u = user.get_by_login(login_id)
    if not u or not check_password_hash(u["password_hash"], password):
        raise ApiError("Invalid username or password", 401)
    return jsonify(
        token=make_token(u["id"]),
        user={k: u[k] for k in ("id", "username", "email", "full_name")},
    )
