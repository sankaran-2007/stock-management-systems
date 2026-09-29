import datetime

from utils.helpers import ApiError, query, transaction

BASE = """
SELECT sa.*, p.name AS product_name
FROM sales sa
JOIN products p ON p.id = sa.product_id
"""


def list_all():
    return query(BASE + " ORDER BY sa.sale_date DESC, sa.id DESC")


def get(sid):
    return query(BASE + " WHERE sa.id=%s", (sid,), one=True)


def create(d):
    with transaction() as cur:
        cur.execute("SELECT quantity, selling_price FROM products WHERE id=%s FOR UPDATE", (d["product_id"],))
        prod = cur.fetchone()
        if not prod:
            raise ApiError("Product not found", 404)
        if d["quantity"] > prod["quantity"]:
            raise ApiError(f"Insufficient stock. Only {prod['quantity']} unit(s) available.")
        price = d["selling_price"] if d["selling_price"] is not None else float(prod["selling_price"])
        total = round(price * d["quantity"], 2)
        date = d["sale_date"] or datetime.date.today().isoformat()
        customer = d["customer_name"] or "Walk-in Customer"
        cur.execute(
            "INSERT INTO sales (product_id, quantity, selling_price, total_amount, customer_name, sale_date) "
            "VALUES (%s,%s,%s,%s,%s,%s)", (d["product_id"], d["quantity"], price, total, customer, date))
        new_id = cur.lastrowid
        cur.execute("UPDATE products SET quantity = quantity - %s WHERE id=%s", (d["quantity"], d["product_id"]))
    return new_id
