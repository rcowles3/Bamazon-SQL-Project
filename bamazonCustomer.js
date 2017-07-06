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
    password: 'Fdd4e!i$f$', // update with user password
    database: 'BAMAZON' // update with created database
});

// connecting to db, and displaying connection id
connection.connect(function(err) {

    // error catcher
    if (err) throw err;

    console.log("\nConnected to database BAMAZON on thread " + connection.threadId);

    // call display cars function 
    displayProducts();

    // terminate sql connection
    terminateConnection();
});

// FUNCTIONS TO QUERY SQL DATABASE
// ===============================================================

// function to display all cars that are currently for sale
var displayProducts = function() {

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
        for (var i = 0; i < res.length; i++) {

            // render data to log
            console.log("ID:", res[i].ITEM_ID, "\nCAR:", res[i].PRODUCT_NAME, "\nPRICE: $", res[i].PRICE);
            console.log("\n------------------------------\n");
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
