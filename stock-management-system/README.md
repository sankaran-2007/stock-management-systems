# Stock Management System

A full-stack Stock Management System built for a college project.

- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Python Flask REST API + Flask-CORS
- **Database:** MySQL

Manage products, categories, suppliers, purchases and sales, with stock levels
that update automatically and a dashboard that shows the current state of
your inventory.

---

## 1. Default login credentials

```
Username: admin
Password: admin123
```

The admin account is created automatically (with a securely **hashed**
password) the first time you start the Flask server, so you don't need to
insert it into the database yourself.

---

## 2. Software required

Install these before you start (Windows instructions):

1. **Python 3.10+** — https://www.python.org/downloads/
   During install, tick **"Add Python to PATH"**.
2. **Node.js 18+ (LTS)** — https://nodejs.org/
   This also installs `npm`.
3. **MySQL Server 8.x** — https://dev.mysql.com/downloads/installer/
   During install, set a root password and remember it.
4. (Optional but recommended) **VS Code** — https://code.visualstudio.com/
   with the "Python" and "ES7+ React" extensions.

Verify installs by opening Command Prompt and running:

```
python --version
node --version
npm --version
mysql --version
```

---

## 3. Set up the MySQL database

1. Open **MySQL Command Line Client** (or MySQL Workbench, or Command Prompt).
2. Log in:
   ```
   mysql -u root -p
   ```
3. Import the provided SQL file, which creates the `stock_management`
   database, all tables, and sample data. From Command Prompt (not inside
   the `mysql>` shell), run this from the project's root folder:
   ```
   mysql -u root -p < database\stock_management.sql
   ```
   (When asked, enter your MySQL root password.)

This creates:
- Database: `stock_management`
- Tables: `users`, `categories`, `suppliers`, `products`, `purchases`, `sales`
- Sample categories, suppliers, products, purchases and sales so the app has
  useful data immediately.

> The `users` table is created empty — the default admin account is inserted
> automatically by Flask on first run (see section 5).

---

## 4. Configure environment variables

Inside the `backend` folder, copy `.env.example` to `.env`:

```
cd backend
copy .env.example .env
```

Open `backend\.env` in a text editor and set your real MySQL password:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stock_management
SECRET_KEY=change_this_secret_key
```

Do the same for the frontend (optional — the default already points to the
backend on `localhost:5000`):

```
cd frontend
copy .env.example .env
```

---

## 5. Install backend dependencies and start Flask

From the project root, in Command Prompt:

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

You should see Flask start on **http://localhost:5000**, and on first run:
```
Default admin created: admin / admin123
```

Leave this terminal window running.

---

## 6. Install frontend dependencies and start React

Open a **new** Command Prompt window:

```
cd frontend
npm install
npm start
```

This project uses Vite, so `npm start` runs `vite` and serves the app at:

**http://localhost:5173**

---

## 7. Open the website

Go to **http://localhost:5173** in your browser and log in with:

```
Username: admin
Password: admin123
```

---

## 8. What you can do

- **Dashboard** – totals for products, categories, suppliers, stock, low
  stock items, sales and purchases, plus simple bar charts.
- **Products** – full CRUD, search, filter by category/supplier/stock
  status, low-stock badge.
- **Categories / Suppliers** – full CRUD.
- **Purchases** – record a purchase; stock quantity **increases**
  automatically.
- **Sales** – record a sale; stock quantity **decreases** automatically, and
  the sale is rejected if quantity exceeds available stock.
- **Stock** – read-only current stock view with stock value.
- **Reports** – current stock, sales, purchases, and low-stock reports, each
  exportable to **CSV** and printable.
- **Profile/Settings** – view the logged-in admin's details and log out.

The UI is responsive (sidebar collapses into a menu on small screens) and
works on desktop and mobile browsers.

---

## 9. Project structure

```
stock-management-system/
│
├── frontend/                 React + Vite app
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/       Sidebar, Navbar, Loading, ProtectedRoute, Crud (shared table/modal)
│       ├── pages/             Login, Dashboard, Products, Categories, Suppliers,
│       │                      Purchases, Sales, Stock, Reports, Profile
│       ├── services/api.js   Axios instance (adds JWT-style token, handles errors)
│       ├── styles/main.css
│       └── context/AuthContext.jsx
│
├── backend/                  Flask REST API
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── routes/                auth, product, category, supplier, purchase, sale, dashboard, report
│   ├── models/                user, product, category, supplier, purchase, sale
│   └── utils/helpers.py       DB connection, generic CRUD blueprint, validation, auth token
│
├── database/
│   └── stock_management.sql  Full schema + sample data
│
├── README.md
└── .gitignore
```

---

## 10. API reference

All endpoints below (except `/api/login`) require this header:
`Authorization: Bearer <token>` (the token is returned by `/api/login` and
stored/added automatically by the frontend).

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Log in, returns `{ token, user }` |
| GET/POST | `/api/products`, `/api/categories`, `/api/suppliers` | List / create |
| GET/PUT/DELETE | `.../<id>` | Read / update / delete one record |
| GET/POST | `/api/purchases` | List / record a purchase (increases stock) |
| GET | `/api/purchases/<id>` | One purchase |
| GET/POST | `/api/sales` | List / record a sale (decreases stock, blocks overselling) |
| GET | `/api/sales/<id>` | One sale |
| GET | `/api/dashboard` | Dashboard totals, low-stock list, stock-by-category |
| GET | `/api/reports/stock` | Current stock report |
| GET | `/api/reports/sales` | Sales report |
| GET | `/api/reports/purchases` | Purchases report |
| GET | `/api/reports/low-stock` | Low-stock report |
| GET | `/api/health` | Health check (no auth) |

Passwords are stored using Werkzeug's salted password hashing
(`generate_password_hash` / `check_password_hash`) — never in plain text.

---

## 11. Common errors and solutions

**`Cannot reach the server. Is Flask running on port 5000?`**
The React app can't reach Flask. Make sure `python app.py` is running in its
own terminal and didn't crash (check that terminal for errors).

**`[!] Could not connect to MySQL` in the Flask terminal**
Check `backend\.env`: is `DB_PASSWORD` correct? Is MySQL running? On Windows,
check the "MySQL80" service in `services.msc` and start it if stopped.

**`1049 (42000): Unknown database 'stock_management'`**
You haven't imported the SQL file yet — repeat step 3.

**`Access denied for user 'root'@'localhost'`**
Your `DB_PASSWORD` in `backend\.env` doesn't match your real MySQL root
password.

**`Port 5000 is already in use` / `Port 5173 is already in use`**
Close any other program using that port, or stop a previous `python app.py`
/ `npm start` that's still running in another terminal.

**`'python' is not recognized...` or `'npm' is not recognized...`**
Python or Node wasn't added to PATH during installation. Reinstall and tick
the "Add to PATH" option, then reopen Command Prompt.

**Login says "Invalid username or password"**
Use exactly `admin` / `admin123`. If you've changed the database, make sure
the `users` table has a row — restart `python app.py` once, since it creates
the admin account automatically if missing.

**CORS error in the browser console**
Make sure you're running the backend from the `backend` folder with
`python app.py` (Flask-CORS is enabled in `app.py`) and that the frontend's
`VITE_API_URL` points to `http://localhost:5000/api`.

**Blank page / `Failed to fetch dynamically imported module`**
Stop the dev server, delete `frontend\node_modules`, and run `npm install`
again, then `npm start`.

---

## 12. Notes for VS Code

Open the **root** `stock-management-system` folder in VS Code (not just
`frontend` or `backend`) so you can work on both sides at once. Use two
integrated terminals side by side: one running `python app.py` inside
`backend` (with the venv activated), and one running `npm start` inside
`frontend`.
