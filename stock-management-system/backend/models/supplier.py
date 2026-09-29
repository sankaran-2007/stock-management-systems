from utils.helpers import execute, query


def list_all():
    return query("SELECT * FROM suppliers ORDER BY id")


def get(sid):
    return query("SELECT * FROM suppliers WHERE id=%s", (sid,), one=True)


def create(d):
    return execute(
        "INSERT INTO suppliers (name, phone, email, address) VALUES (%s,%s,%s,%s)",
        (d["name"], d["phone"], d["email"], d["address"]),
    )[0]


def update(sid, d):
    execute(
        "UPDATE suppliers SET name=%s, phone=%s, email=%s, address=%s WHERE id=%s",
        (d["name"], d["phone"], d["email"], d["address"], sid),
    )


def delete(sid):
    execute("DELETE FROM suppliers WHERE id=%s", (sid,))
