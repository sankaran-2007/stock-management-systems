from models import category
from utils.helpers import crud_blueprint

bp = crud_blueprint("categories", "categories", category, {
    "name": ("str", True),
    "description": ("str", False),
})
