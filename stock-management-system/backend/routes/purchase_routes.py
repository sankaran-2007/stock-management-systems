from flask import Blueprint, jsonify, request

from models import purchase
from utils.helpers import ApiError, clean_fields, token_required

bp = Blueprint("purchases", __name__)
SPEC = {
    "product_id": ("id", True),
    "supplier_id": ("id", True),
    "quantity": ("int", True),
    "purchase_price": ("float", False),
    "purchase_date": ("date", False),
}


@bp.get("/api/purchases")
@token_required
def list_purchases():
    return jsonify(purchase.list_all())


@bp.get("/api/purchases/<int:pid>")
@token_required
def get_purchase(pid):
    row = purchase.get(pid)
    if not row:
        raise ApiError("Purchase not found", 404)
    return jsonify(row)


@bp.post("/api/purchases")
@token_required
def add_purchase():
    data = clean_fields(request.get_json(silent=True) or {}, SPEC)
    if data["quantity"] <= 0:
        raise ApiError("Quantity must be greater than 0")
    return jsonify(purchase.get(purchase.create(data))), 201
