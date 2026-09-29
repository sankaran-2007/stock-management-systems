from models import product
from utils.helpers import crud_blueprint

bp = crud_blueprint("products", "products", product, {
    "name": ("str", True),
    "category_id": ("id", True),
    "supplier_id": ("id", True),
    "quantity": ("int", True),
    "purchase_price": ("float", True),
    "selling_price": ("float", True),
    "min_stock_level": ("int", True),
    "description": ("str", False),
})
