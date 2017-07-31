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

var connection = mysql.createConnection({
    host: process.env.DB_HOST, // update with host
    port: 3306, // update with port
    user: process.env.DB_USER, // update with user id
    password: process.env.DB_PASS, // update with user password
    database: 'BAMAZON' // update with created database
});

// connecting to db, and displaying connection id
connection.connect(function(err, res) {

    // error catcher
    if (err) throw err;

    // console.log(res);

    console.log("\nConnected to database BAMAZON on thread " + connection.threadId, '\n');

    // call display cars function 
    displayProducts();

    // terminate sql connection
    // terminateConnection();
});

// ===============================================================
// SETTING UP OR NODE CLI TABLE
// ===============================================================

var table = new Table({
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

// ===============================================================
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
        promptCustomer();
    })
}

// function to update sql database in the product sales column
// var updateProductsSales = function() {

//     // SQL Query
//     let sqlQuery = 
// }

// ===============================================================
// FUNCTION TO RUN APP
// ===============================================================

// function to prompt user what they would like to buy
var promptCustomer = function() {

    // prompt user what they would like to purchase
    inquirer.prompt([{
        name: "buyingID",
        message: "\nWhat is the ID of the vehicle that you would like to purchase?",
        type: "input",
    }, {
        name: "buyingQuanity",
        message: "\nHow many vehicles would you like to purchase?",
        type: "input"
    }]).then(function(customerResponse) {

        // SQL query
        let sqlQuery = "SELECT * FROM PRODUCTS WHERE ITEM_ID = ?";

        // selecting data from our database
        connection.query(sqlQuery, [customerResponse.buyingID], function(err, res) {

            // err catcher
            if (err) throw err;

            // var to hold buying price
            let buyingPriceTotal = res[0].PRICE;

            // if else to check if stock available
            if (customerResponse.buyingQuanity < res[0].STOCK_QUANITY) { // fulfill order

                // var to hold sql query
                let sqlQuery = "UPDATE PRODUCTS SET STOCK_QUANITY = STOCK_QUANITY - ? WHERE ITEM_ID = ?";

                // query to update our database
                connection.query(sqlQuery, [customerResponse.buyingQuanity, customerResponse.buyingID], function(err, res) {

                    // err catcher
                    if (err) throw err;

                    // provide customer with order details
                    console.log("\nThank you, your order has been submitted successfuly. \n\nYour total that will be billed is: $", buyingPriceTotal * customerResponse.buyingQuanity);

                    // run function to update product sales in products table
                    // updateProductsSales();
                })

                // terminate the sql connection
                terminateConnection();
            } else {

                // cancel order
                console.log("Sorry, there is an insufficient quantity of that vehicle in stock right now, please try again at a later time, or select another vehicle to purchase.");

                // ask customer to choose another vehicle, or quit application.
                promptCustomer();
            }
        })
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