'use-strict'

// DECLARING VARIABLES TO USE FOR NODE PACKAGES
// ===============================================================

var mysql = require('mysql');
var inquirer = require('inquirer');

// CONNECTING TO SQL DB
// ===============================================================

var connection = mysql.createConnection({
    host: 'localhost', // update with host
    port: 3306, // update with port
    user: 'root', // update with user id
    password: '', // update with user password
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

// FUNCTIONS TO QUERY SQL DATABASE
// ===============================================================

// function to display all cars that are currently for sale
var veiwProducts = function() {

    // var to hold our SQL query
    let sqlQuery = "SELECT ITEM_ID, PRODUCT_NAME, PRICE FROM PRODUCTS";

    // query to render available products from database
    connection.query(sqlQuery, function(err, res) {

        // error catcher
        if (err) throw err;

        console.log("\n-------------------------------------------------------------------------");
        console.log("| Here is a list of all of the cars available at our Bamazon storefront.|");
        console.log("-------------------------------------------------------------------------\n");

        // for loop to run through our data array
        for (let i = 0; i < res.length; i++) {

            // render data to log
            console.log("ID:", res[i].ITEM_ID, "\nCAR:", res[i].PRODUCT_NAME, "\nPRICE: $", res[i].PRICE);
            console.log("\n------------------------------\n");
        }
    })

    // terminate sql connection
    terminateConnection();
}

var lowInventory = function() {

    // var to hold our sql query
    let sqlQuery = "SELECT ITEM_ID, PRODUCT_NAME, STOCK_QUANITY FROM PRODUCTS WHERE STOCK_QUANITY < 5";

    connection.query(sqlQuery, function(err, res) {

        // err catcher
        if (err) throw err;

        // checking if null
        if (res === null) {

            console.log("\nEverything is sufficiently stocked.");
        } else {

            console.log("\nWe are running low on these specific vehicles, an order for a new shipment should be placed.");

            // for loop to run through low inventory
            for (let i = 0; i < res.length; i++) {

                console.log("\nItem ID: ", res[i].ITEM_ID, "\nVehicle Name: ", res[i].PRODUCT_NAME, "\nIn Stock: ", res[i].STOCK_QUANITY, "\n------------------------------");
            }
        }
    })

    // quit application
    terminateConnection();
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

        // quit application
        terminateConnection();
    })
}

// function to add new products 
var addProduct = function() {

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

    }]).then(function(addedProduct) {

        console.log("\nHere is the product data you wish to add: \nITEM_ID: ",
            addedProduct.addItemId,
            "\nPRODUCT_NAME: ",
            addedProduct.addProductName,
            "\nDEPARTMENT_NAME: ",
            addedProduct.addDepartmentName,
            "\nPRICE: $",
            addedProduct.addPrice,
            "\nSTOCK_QUANTITY: ",
            addedProduct.addStockQuantity, "\n");

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

                // quit application
                terminateConnection();

            } else {

                // prompt to re-add product info
                addProduct();
            }
        })
    })
}

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
