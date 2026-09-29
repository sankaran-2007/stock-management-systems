import datetime

from utils.helpers import ApiError, query, transaction

BASE = """
SELECT pu.*, p.name AS product_name, s.name AS supplier_name
FROM purchases pu
JOIN products p ON p.id = pu.product_id
JOIN suppliers s ON s.id = pu.supplier_id
"""


def list_all():
    return query(BASE + " ORDER BY pu.purchase_date DESC, pu.id DESC")


def get(pid):
    return query(BASE + " WHERE pu.id=%s", (pid,), one=True)


def create(d):
    with transaction() as cur:
        cur.execute("SELECT purchase_price FROM products WHERE id=%s FOR UPDATE", (d["product_id"],))
        prod = cur.fetchone()
        if not prod:
            raise ApiError("Product not found", 404)
        cur.execute("SELECT id FROM suppliers WHERE id=%s", (d["supplier_id"],))
        if not cur.fetchone():
            raise ApiError("Supplier not found", 404)
        price = d["purchase_price"] if d["purchase_price"] is not None else float(prod["purchase_price"])
        total = round(price * d["quantity"], 2)
        date = d["purchase_date"] or datetime.date.today().isoformat()
        cur.execute(
            "INSERT INTO purchases (product_id, supplier_id, quantity, purchase_price, total_amount, purchase_date) "
            "VALUES (%s,%s,%s,%s,%s,%s)", (d["product_id"], d["supplier_id"], d["quantity"], price, total, date))
        new_id = cur.lastrowid
        cur.execute("UPDATE products SET quantity = quantity + %s WHERE id=%s", (d["quantity"], d["product_id"]))
    return new_id
