productscategoriesCREATE DATABASE IF NOT EXISTS stock_management CHARACTER SET utf8mb4;
USE stock_management;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS sales, purchases, products, suppliers, categories, users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category_id INT NOT NULL,
  supplier_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  purchase_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  min_stock_level INT NOT NULL DEFAULT 5,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  supplier_id INT NOT NULL,
  quantity INT NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  purchase_date DATE NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  sale_date DATE NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- The admin user (admin / admin123) is created with a hashed password
-- automatically the first time the Flask backend starts.

INSERT INTO categories (name, description) VALUES
('Electronics', 'Laptops, phones and other electronic devices'),
('Stationery', 'Notebooks, pens and office stationery'),
('Grocery', 'Daily grocery and food items'),
('Computer Accessories', 'Keyboards, mice and storage devices');

INSERT INTO suppliers (name, phone, email, address) VALUES
('ABC Technologies', '9876543210', 'sales@abctech.com', '12 Tech Park, Chennai'),
('Sri Lakshmi Traders', '9123456780', 'info@srilakshmitraders.com', '45 Market Road, Coimbatore'),
('Global Supplies', '9988776655', 'contact@globalsupplies.com', '7 Industrial Area, Bengaluru');

INSERT INTO products (name, category_id, supplier_id, quantity, purchase_price, selling_price, min_stock_level, description) VALUES
('Laptop', 1, 1, 12, 45000.00, 52000.00, 5, '15.6 inch, 8GB RAM, 512GB SSD'),
('Keyboard', 4, 1, 3, 500.00, 800.00, 10, 'USB wired keyboard'),
('Mouse', 4, 1, 40, 250.00, 400.00, 10, 'Wireless optical mouse'),
('Notebook', 2, 2, 120, 25.00, 40.00, 30, '200 pages ruled notebook'),
('Pen', 2, 2, 15, 5.00, 10.00, 50, 'Blue ball point pen'),
('USB Drive', 4, 3, 30, 350.00, 550.00, 10, '64GB USB 3.0 pen drive');

INSERT INTO purchases (product_id, supplier_id, quantity, purchase_price, total_amount, purchase_date) VALUES
(1, 1, 15, 45000.00, 675000.00, '2026-09-01'),
(2, 1, 20, 500.00, 10000.00, '2026-09-02'),
(3, 1, 50, 250.00, 12500.00, '2026-09-02'),
(4, 2, 150, 25.00, 3750.00, '2026-09-03'),
(5, 2, 100, 5.00, 500.00, '2026-09-03'),
(6, 3, 40, 350.00, 14000.00, '2026-09-04');

INSERT INTO sales (product_id, quantity, selling_price, total_amount, customer_name, sale_date) VALUES
(1, 3, 52000.00, 156000.00, 'Rahul Sharma', '2026-09-10'),
(2, 17, 800.00, 13600.00, 'City College Lab', '2026-09-11'),
(3, 10, 400.00, 4000.00, 'Priya Nair', '2026-09-12'),
(4, 30, 40.00, 1200.00, 'Green Valley School', '2026-09-13'),
(5, 85, 10.00, 850.00, 'Green Valley School', '2026-09-13'),
(6, 10, 550.00, 5500.00, 'Arun Kumar', '2026-09-15');
