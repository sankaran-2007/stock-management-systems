from utils.helpers import execute, query


def list_all():
    return query("SELECT * FROM categories ORDER BY id")


def get(cid):
    return query("SELECT * FROM categories WHERE id=%s", (cid,), one=True)


def create(d):
    return execute("INSERT INTO categories (name, description) VALUES (%s,%s)", (d["name"], d["description"]))[0]


def update(cid, d):
    execute("UPDATE categories SET name=%s, description=%s WHERE id=%s", (d["name"], d["description"], cid))


def delete(cid):
    execute("DELETE FROM categories WHERE id=%s", (cid,))
