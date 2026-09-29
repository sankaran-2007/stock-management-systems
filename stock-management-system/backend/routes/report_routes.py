from flask import Blueprint, jsonify

from models import product, purchase, sale
from utils.helpers import token_required

bp = Blueprint("reports", __name__)


@bp.get("/api/reports/stock")
@token_required
def stock_report():
    return jsonify(product.list_all())


@bp.get("/api/reports/sales")
@token_required
def sales_report():
    return jsonify(sale.list_all())


@bp.get("/api/reports/purchases")
@token_required
def purchases_report():
    return jsonify(purchase.list_all())


@bp.get("/api/reports/low-stock")
@token_required
def low_stock_report():
    return jsonify(product.list_all(low_only=True))
