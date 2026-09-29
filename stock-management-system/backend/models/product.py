from utils.helpers import execute, query

BASE = """
SELECT p.*, c.name AS category_name, s.name AS supplier_name,
       IF(p.quantity <= p.min_stock_level, 'Low Stock', 'In Stock') AS status,
       ROUND(p.quantity * p.purchase_price, 2) AS stock_value
FROM products p
JOIN categories c ON c.id = p.category_id
JOIN suppliers s ON s.id = p.supplier_id
"""


def list_all(low_only=False):
    where = " WHERE p.quantity <= p.min_stock_level" if low_only else ""
    return query(BASE + where + " ORDER BY p.id")


def get(pid):
    return query(BASE + " WHERE p.id=%s", (pid,), one=True)


def _vals(d):
    return (d["name"], d["category_id"], d["supplier_id"], d["quantity"], d["purchase_price"],
            d["selling_price"], d["min_stock_level"], d["description"])


def create(d):
    return execute(
        "INSERT INTO products (name, category_id, supplier_id, quantity, purchase_price, "
        "selling_price, min_stock_level, description) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)", _vals(d))[0]


def update(pid, d):
    execute(
        "UPDATE products SET name=%s, category_id=%s, supplier_id=%s, quantity=%s, purchase_price=%s, "
        "selling_price=%s, min_stock_level=%s, description=%s WHERE id=%s", _vals(d) + (pid,))


def delete(pid):
    execute("DELETE FROM products WHERE id=%s", (pid,))
