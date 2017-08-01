'use-strict'

// ===============================================================
// DECLARING VARIABLES TO USE FOR NODE PACKAGES
// ===============================================================

const mysql = require('mysql');
const inquirer = require('inquirer');
const env = require('dotenv').config();
const Table = require('cli-table');

// ===============================================================
// CONNECTING TO SQL DB
// ===============================================================

const connection = mysql.createConnection({
    host: process.env.DB_HOST, // update with host
    port: 3306, // update with port
    user: process.env.DB_USER, // update with user id
    password: process.env.DB_PASS, // update with user password
    database: 'BAMAZON' // update with created database
});

// connecting to db, and displaying connection id
connection.connect(function(err) {

    // error catcher
    if (err) throw err;

    console.log("\nConnected to database BAMAZON on thread " + connection.threadId);

    // call display cars function 
    promptManager();

    // terminate sql connection
    // terminateConnection();
});

// ===============================================================
// FUNCTIONS TO QUERY SQL DATABASE
// ===============================================================

// function to display all cars that are currently for sale
var veiwProducts = function() {

    // ===============================================================
    // SETTING UP OR NODE CLI TABLE
    // ===============================================================

    let table = new Table({
        head: ['INVENTORY ID', 'CAR', 'PRICE'],
        chars: {
            'top': '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            'bottom': '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            'left': '║',
            'left-mid': '╟',
            'mid': '─',
            'mid-mid': '┼',
            'right': '║',
            'right-mid': '╢',
            'middle': '│'
        }
    });

    // var to hold our SQL query
    let sqlQuery = "SELECT ITEM_ID, PRODUCT_NAME, PRICE FROM PRODUCTS";

    // query to render available products from database
    connection.query(sqlQuery, function(err, res) {

        // error catcher
        if (err) throw err;

        // for loop to run through our data array
        for (let i = 0; i < res.length; i++) {

            // pushing our results to our table array
            table.push(
                [res[i].ITEM_ID, res[i].PRODUCT_NAME, res[i].PRICE]
            );
        }

        // sending our data to the console
        console.log(table.toString());

        // prompt user about purchases
        promptManager();
    })
}

var lowInventory = function() {

    // ===============================================================
    // SETTING UP OR NODE CLI TABLE
    // ===============================================================

    let table = new Table({
        head: ['INVENTORY ID', 'CAR', 'STOCK QUANTITY'],
        chars: {
            'top': '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            'bottom': '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            'left': '║',
            'left-mid': '╟',
            'mid': '─',
            'mid-mid': '┼',
            'right': '║',
            'right-mid': '╢',
            'middle': '│'
        }
    });

    // var to hold our sql query
    let sqlQuery = "SELECT ITEM_ID, PRODUCT_NAME, STOCK_QUANITY FROM PRODUCTS WHERE STOCK_QUANITY < 5";

    connection.query(sqlQuery, function(err, res) {

        // err catcher
        if (err) throw err;

        // checking if null
        if (res === null) {

            // table.push('\nEverything is sufficiently stocked.');
            console.log("\nEverything is sufficiently stocked.");
        } else {
            // table.push('\nWe are running low on these specific vehicles, an order for a new shipment should be placed.')
            console.log("\n\nWe are running low on these specific vehicles, an order for a new shipment should be placed.\n");

            // for loop to run through low inventory
            for (let i = 0; i < res.length; i++) {

                // sending our data to our table array
                table.push(
                    [res[i].ITEM_ID, res[i].PRODUCT_NAME, res[i].STOCK_QUANITY]
                )
            }

            // logging data to cli
            console.log(table.toString());

        }
        // prompt manager on what to do next
        promptManager();
    })
}

// function to update inventory
var updateInventory = function() {

    // prompt to ask manager what to update
    inquirer.prompt([{
        name: "updateID",
        message: "For which ITEM_ID would you like to update inventory for? 1-20",
        type: "input",
    }, {
        name: "updateQuantity",
        message: "How much inventory would you like to add for the ITEM_ID.",
        type: "input"

    }]).then(function(updateItemId) {

        // var to hold our sql query
        let sqlQuery = "UPDATE PRODUCTS SET STOCK_QUANITY = STOCK_QUANITY + ? WHERE ITEM_ID = ?";

        // query our sql database
        connection.query(sqlQuery, [updateItemId.updateQuantity, updateItemId.updateID], function(err, res) {

            // err catcher
            if (err) throw err;

            // update verification
            console.log("\nItem ID: ", updateItemId.updateID, " has successfuly been updated by ", updateItemId.updateQuantity, ".");
        })

        // prompt manager on what to do next
        promptManager();
    })
}

// function to add new products 
var addProduct = function() {

    // ===============================================================
    // SETTING UP OR NODE CLI TABLE
    // ===============================================================

    var table = new Table({
        head: ['INVENTORY ID', 'PRODUCT NAME', 'DEPARTMENT', 'PRICE', 'STOCK QUANTITY'],
        chars: {
            'top': '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            'bottom': '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            'left': '║',
            'left-mid': '╟',
            'mid': '─',
            'mid-mid': '┼',
            'right': '║',
            'right-mid': '╢',
            'middle': '│'
        }
    });

    // prompt to ask manager what product to add
    inquirer.prompt([{
        name: "addItemId",
        message: "Please enter an ITEM_ID, PRODUCT_NAME, DEPARTMENT_NAME, PRICE, and STOCK_QUANTITY for the product that you would like to add.\n  ITEM_ID: ",
        type: "input",
    }, {
        name: "addProductName",
        message: "PRODUCT_NAME: ",
        type: "input",
    }, {
        name: "addDepartmentName",
        message: "DEPARTMENT_NAME: ",
        type: "input",
    }, {
        name: "addPrice",
        message: "PRICE: ",
        type: "input",
    }, {
        name: "addStockQuantity",
        message: "STOCK_QUANTITY: ",
        type: "input"

    }]).then(function(addedProduct) { // promise function

        // pushing data to table array
        table.push([addedProduct.addItemId,
            addedProduct.addProductName,
            addedProduct.addDepartmentName,
            addedProduct.addPrice,
            addedProduct.addStockQuantity
        ]);

        // sending our data to the cli
        console.log(table.toString());

        // prompt to confirm data
        inquirer.prompt([{
            name: "dataConfirm",
            message: "Are you sure you want to add this data?",
            type: "confirm"

        }]).then(function(confirmation) {

            // if else to either re-enter data or quick application
            if (confirmation.dataConfirm) {

                // run sql query
                connection.query('INSERT INTO PRODUCTS SET ?', {
                        ITEM_ID: addedProduct.addItemId,
                        PRODUCT_NAME: addedProduct.addProductName,
                        DEPARTMENT_NAME: addedProduct.addDepartmentName,
                        PRICE: addedProduct.addPrice,
                        STOCK_QUANITY: addedProduct.addStockQuantity
                    },
                    function(err, results) {

                        // err catcher
                        if (err) throw err;

                        // success message
                        console.log("\nYour data input has successfuly been updated in our database for ITEM_ID", addedProduct.addItemId);
                    })

                // prompt manager for what to do next
                promptManager();

            } else {

                // prompt to re-add product info
                addProduct();
            }
        })
    })
}

// ===============================================================
// FUNCTION TO RUN APP
// ===============================================================

// function to prompt manager 
var promptManager = function() {

    // Run function to prompt for what user wants to do
    inquirer.prompt([{
        name: "managerMenu",
        message: "\nWhat would you like to do?\n",
        choices: ["View Products for Sale.", "View Low Inventory.", "Add to Inventory.", "Add New Product.", "Quit Application."],
        type: "list"
    }]).then(function(managerChoice) {

        // switch case to run functions to retrieve data based on user selection/input
        switch (managerChoice.managerMenu) {
            case 'View Products for Sale.':
                veiwProducts();
                break;
            case 'View Low Inventory.':
                lowInventory();
                break;
            case 'Add to Inventory.':
                updateInventory();
                break;
            case 'Add New Product.':
                addProduct();
                break;
            case 'Quit Application.':
                terminateConnection();
                break;
        }
    })
}

// function to terminate the application
var terminateConnection = function() {

    // terminating connection
    connection.end(function(err) {

        // error catcher
        if (err) throw err;

        // The connection is terminated now 
        console.log("\nYour SQL connection has been terminated.\n");
    })
}