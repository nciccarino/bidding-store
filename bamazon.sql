DROP DATABASE if exists bamazon; 
create database bamazon; 

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL, 
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone 7", "Electronics", 649.00, 50),
("Smart Refrigerator", "Appliances", 2508.10, 5), 
("Tempurpedic mattress", "Furniture", 1299.98, 20), 
("Nike Football", "Sports_&_Outdoor", 25.50, 100), 
("Elliptical Machine", "Fitness", 899.99, 5), 
("Gas Grill", "Patio,_Lawn_&_Garden", 599.99, 15), 
("55-inch 4K Ultra HD Smart TV", "Electronics", 449.99, 25), 
("Keurig Coffee Maker", "Appliances", 93.28, 30), 
("L-Shaped Desk with Bookshelves", "Furniture", 82.87, 10), 
("Two Person Tent", "Sports_&_Outdoor", 54.99, 30), 
("Treadmill", "Fitness", 784.99, 10), 
("Lawn Mower", "Patio,_Lawn_&_Garden", 142.99, 15);  

SELECT * FROM products; 