from flask import Blueprint, jsonify, request

from models import sale
from utils.helpers import ApiError, clean_fields, token_required

bp = Blueprint("sales", __name__)
SPEC = {
    "product_id": ("id", True),
    "quantity": ("int", True),
    "selling_price": ("float", False),
    "customer_name": ("str", False),
    "sale_date": ("date", False),
}


@bp.get("/api/sales")
@token_required
def list_sales():
    return jsonify(sale.list_all())


@bp.get("/api/sales/<int:sid>")
@token_required
def get_sale(sid):
    row = sale.get(sid)
    if not row:
        raise ApiError("Sale not found", 404)
    return jsonify(row)


@bp.post("/api/sales")
@token_required
def add_sale():
    data = clean_fields(request.get_json(silent=True) or {}, SPEC)
    if data["quantity"] <= 0:
        raise ApiError("Quantity must be greater than 0")
    return jsonify(sale.get(sale.create(data))), 201
