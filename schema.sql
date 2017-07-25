DROP DATABASE IF EXISTS BAMAZON;
CREATE DATABASE BAMAZON;

USE BAMAZON;

CREATE TABLE PRODUCTS (
  ITEM_ID INT NOT NULL,
  PRODUCT_NAME VARCHAR(100) NULL,
  DEPARTMENT_NAME VARCHAR(100) NULL,
  PRICE DECIMAL(10,2) NULL,
  STOCK_QUANITY DECIMAL(10,2) NULL,
  PRIMARY KEY (ITEM_ID)
);

CREATE TABLE DEPARTMENTS (
	DEPARTMENT_ID INT NOT NULL,
    DEPARTMENT_NAME VARCHAR(100) NOT NULL,
    OVER_HEAD_COST INT NOT NULL,
    PRIMARY KEY (DEPARTMENT_NAME)
);