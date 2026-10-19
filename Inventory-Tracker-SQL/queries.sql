
-- 1. Display all products
SELECT * FROM products;

-- 2. Find products with low stock
SELECT name, sku, quantity, min_stock
FROM products
WHERE quantity <= min_stock;

-- 3. Calculate the total inventory value
SELECT SUM(price * quantity) AS total_inventory_value
FROM products;

-- 4. Search for electronics
SELECT * FROM products
WHERE category = 'Electronics';

-- 5. Update the mouse quantity
UPDATE products
SET quantity = 15
WHERE sku = 'MS001';

-- 6. Check the updated mouse quantity
SELECT name, quantity
FROM products
WHERE sku = 'MS001';
