from models import supplier
from utils.helpers import crud_blueprint

bp = crud_blueprint("suppliers", "suppliers", supplier, {
    "name": ("str", True),
    "phone": ("str", True),
    "email": ("email", True),
    "address": ("str", True),
})
