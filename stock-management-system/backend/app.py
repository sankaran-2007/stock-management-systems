import mysql.connector
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import user
from routes.auth_routes import bp as auth_bp
from routes.category_routes import bp as category_bp
from routes.dashboard_routes import bp as dashboard_bp
from routes.product_routes import bp as product_bp
from routes.purchase_routes import bp as purchase_bp
from routes.report_routes import bp as report_bp
from routes.sale_routes import bp as sale_bp
from routes.supplier_routes import bp as supplier_bp
from utils.helpers import ApiError

app = Flask(__name__)
app.config["SECRET_KEY"] = Config.SECRET_KEY
CORS(app)

for blueprint in (auth_bp, category_bp, supplier_bp, product_bp, purchase_bp,
                  sale_bp, dashboard_bp, report_bp):
    app.register_blueprint(blueprint)


@app.errorhandler(ApiError)
def handle_api_error(e):
    return jsonify(error=e.message), e.status


@app.errorhandler(mysql.connector.IntegrityError)
def handle_integrity(e):
    if e.errno == 1451:
        return jsonify(error="Cannot delete: this record is used by other records."), 409
    if e.errno == 1062:
        return jsonify(error="Duplicate value: that name or email already exists."), 409
    return jsonify(error="Invalid reference: selected category/supplier/product does not exist."), 400


@app.errorhandler(mysql.connector.Error)
def handle_db_error(e):
    return jsonify(error=f"Database error: {e}"), 500


@app.get("/api/health")
def health():
    return jsonify(status="ok")


try:
    user.ensure_admin()
except mysql.connector.Error as err:
    print(f"\n[!] Could not connect to MySQL: {err}\n    Check backend/.env and that database/stock_management.sql was imported.\n")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
