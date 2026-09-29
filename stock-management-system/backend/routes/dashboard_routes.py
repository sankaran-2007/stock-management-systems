from flask import Blueprint, jsonify

from models import product
from utils.helpers import query, token_required

bp = Blueprint("dashboard", __name__)


@bp.get("/api/dashboard")
@token_required
def dashboard():
    totals = query("""
        SELECT (SELECT COUNT(*) FROM products) AS total_products,
               (SELECT COUNT(*) FROM categories) AS total_categories,
               (SELECT COUNT(*) FROM suppliers) AS total_suppliers,
               (SELECT COALESCE(SUM(quantity),0) FROM products) AS current_stock,
               (SELECT COUNT(*) FROM products WHERE quantity <= min_stock_level) AS low_stock_count,
               (SELECT COALESCE(SUM(total_amount),0) FROM sales) AS total_sales,
               (SELECT COALESCE(SUM(total_amount),0) FROM purchases) AS total_purchases
    """, one=True)
    totals["low_stock"] = product.list_all(low_only=True)
    totals["stock_by_category"] = query("""
        SELECT c.name, COALESCE(SUM(p.quantity),0) AS quantity
        FROM categories c LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id, c.name ORDER BY c.name
    """)
    return jsonify(totals)
