# Inventory Tracker (SQL)

A simple, responsive Inventory Management System developed using HTML, CSS, JavaScript, Node.js, Express.js, and SQLite. This project helps users manage product information, track stock levels, identify low-stock items, and calculate inventory value using a SQL database.

## Project Overview

The Inventory Tracker provides a centralized dashboard for managing inventory records. Users can add new products, view available stock, update product details, delete records, and search for products by name, SKU, or category.

The application uses SQLite to store product information and Express.js to connect the frontend with the database.

## Features

- Add new products to the inventory.
- View all stored product records.
- Update existing product details and quantities.
- Delete products from the database.
- Search products by name, SKU, or category.
- Monitor total products and total stock units.
- Calculate the total inventory value.
- Identify products with low stock.
- Store inventory records in an SQLite database.
- Validate product information and prevent duplicate SKUs.
- Responsive dashboard design.

## Technologies Used

- **HTML5** – Webpage structure.
- **CSS3** – Dashboard styling and responsive layout.
- **JavaScript** – Frontend functionality and API communication.
- **Node.js** – Backend runtime environment.
- **Express.js** – Backend server and API development.
- **SQLite** – Relational database.
- **SQL** – Database queries and CRUD operations.
- **Visual Studio Code** – Development environment.

## Project Structure

```text
Inventory-Tracker-SQL/
│
├── index.html
├── style.css
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── inventory.db
└── README.md
```

**Note:** `inventory.db` is created automatically when the backend runs. It does not need to be included in the GitHub repository.

## Installation and Setup

### 1. Install Node.js

Download and install Node.js from:

https://nodejs.org/

### 2. Open the Project

Open the `Inventory-Tracker-SQL` folder in Visual Studio Code.

### 3. Install Dependencies

Open the VS Code terminal and run:

```bash
npm install express better-sqlite3
```

### 4. Start the Application

Run the backend server:

```bash
node server.js
```

### 5. Open the Dashboard

Open your browser and visit:

```text
http://localhost:3000
```

The application will automatically create the SQLite database and the required products table if they do not already exist.

## Database Design

The application uses a `products` table with the following fields:

| Column | Description |
|---|---|
| `id` | Unique product ID |
| `name` | Product name |
| `sku` | Unique product code |
| `category` | Product category |
| `price` | Price per unit |
| `quantity` | Available stock quantity |
| `min_stock` | Minimum stock threshold |

## SQL Operations

The project implements the four fundamental database operations:

- **CREATE:** Insert new products into the database.
- **READ:** Retrieve and search product records.
- **UPDATE:** Modify product information and quantities.
- **DELETE:** Remove product records.

Example SQL query:

```sql
SELECT *
FROM products
WHERE quantity <= min_stock;
```

This query identifies products that have reached or fallen below their minimum stock threshold.

## Application Workflow

1. The user enters product information in the dashboard.
2. JavaScript sends the request to the Express.js backend.
3. The backend validates the submitted information.
4. SQL queries store or retrieve the product records.
5. The dashboard refreshes the inventory table and summary statistics.
6. Low-stock products are identified using their configured thresholds.

## Testing

The following test cases can be used to verify the application:

1. Add a new product and confirm that it appears in the inventory table.
2. Attempt to add a product with a duplicate SKU.
3. Edit the price or quantity of an existing product.
4. Search for a product by name or category.
5. Reduce the quantity below the minimum stock threshold.
6. Delete a product and verify that the inventory statistics update.
7. Restart the application and verify that saved records remain in the database.

## Learning Outcomes

This project demonstrates practical knowledge of:

- SQL database management.
- CRUD operations.
- REST API development.
- Frontend and backend integration.
- Form validation.
- Inventory calculations.
- Low-stock monitoring.
- Full-stack application development.

## Future Enhancements

- User login and registration.
- Role-based access control.
- Stock-in and stock-out history.
- Supplier management.
- Automated low-stock notifications.
- Inventory reports and charts.
- CSV and Excel exports.
- Cloud database integration and deployment.

## Limitations

- The database is stored locally.
- User authentication is not included.
- Multi-user access is not implemented.
- Automated email and SMS alerts are not included.

## Author

**Your Name**

Electronics and Communication Engineering Student

Interests: SQL, Web Development, Digital Design, and VLSI.

## License

This project is intended for educational and portfolio purposes.
