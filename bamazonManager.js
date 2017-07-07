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
        for (var i = 0; i < res.length; i++) {

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
        	for(var i = 0; i < res.length; i++){

            console.log("\nItem ID: ", res[i].ITEM_ID, "\nVehicle Name: ", res[i].PRODUCT_NAME, "\nIn Stock: ", res[i].STOCK_QUANITY, "\n------------------------------");
        	}
        }
    })

    // quit application
    terminateConnection();

}

// FUNCTION TO RUN APP
// ===============================================================

// function to prompt manager 
var promptManager = function() {

    // \Run function to prompt for what user wants to do
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
                // case 'Find top songs within a specific range position, 1-5000.':
                //     searchRange();
                //     break;
                // case 'Search for a specific song.':
                //     searchSong();
                //     break;
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
