from werkzeug.security import generate_password_hash

from utils.helpers import execute, query


def get_by_login(login):
    return query("SELECT * FROM users WHERE username=%s OR email=%s", (login, login), one=True)


def ensure_admin():
    """Create the default admin (admin / admin123) with a hashed password if missing."""
    if not query("SELECT id FROM users WHERE username='admin'", one=True):
        execute(
            "INSERT INTO users (username, email, password_hash, full_name) VALUES (%s,%s,%s,%s)",
            ("admin", "admin@stock.com", generate_password_hash("admin123"), "System Administrator"),
        )
        print("Default admin created: admin / admin123")
