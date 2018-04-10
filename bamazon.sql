CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE product (
	item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price INTEGER(10) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL
);

ALTER TABLE product
MODIFY COLUMN price DECIMAL(10, 2) NOT NULL;



INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Fluorescent Desk Lamp", "Office Equipment", 29.99, 24); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Beach Umbrella", "Sports & Outdoors", 48.99, 32); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Instant Pot", "Kitchen", 99.99, 48); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Cutlery Set", "Kitchen", 199.99, 18); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Beach Volleyball", "Sports & Outdoors", 12.99, 28); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Paper Shredder", "Office Equipment", 29.99, 42); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Bathroom Scale", "Bathroom", 34.99, 26); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Heated Towel Warmer & Drying Rack", "Bathroom", 59.99, 16); 

INSERT INTO product (product_name, department_name, price, stock_quantity)
VALUES("Patio Dining Set", "Lawn & Garden", 389.99, 39); 

SELECT * FROM product;

USE bamazon;

CREATE TABLE departments (
	department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs INTEGER(10) NOT NULL
);

ALTER TABLE product
ADD product_sales DECIMAL(10, 2);

UPDATE product
SET product_sales = 0;

INSERT INTO departments (department_name, over_head_costs)
VALUES("Office Equipment", 15000); 

INSERT INTO departments (department_name, over_head_costs)
VALUES("Sports & Outdoors", 15000); 

INSERT INTO departments (department_name, over_head_costs)
VALUES("Kitchen", 20000); 

INSERT INTO departments (department_name, over_head_costs)
VALUES("Bathroom", 18000); 

INSERT INTO departments (department_name, over_head_costs)
VALUES("Lawn & Garden", 25000); 

INSERT INTO departments (department_name, over_head_costs)
VALUES("Home Appliances", 25000); 

INSERT INTO departments (department_name, over_head_costs)
VALUES("Office Furniture", 22000); 

SELECT * FROM departments;
