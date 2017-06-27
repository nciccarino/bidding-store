var mysql = require("mysql"); 
var inquirer = require("inquirer");

//connection info for sql database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	//your username 
	user: "root", 

	//your password 
	password: "",
	database: "bamazon"
}); 

connection.connect(function(err) {
	if (err) throw err; 
	console.log("\n Bamazon Manager Page"); 
	console.log(""); 
	passwordEntry(); //wehre everything begins
}); 

var attempts = 4;

//password entry
function passwordEntry() {
	inquirer.prompt([
		{
    type: "input",
    name: "name",
    message: "Please enter your User Name"
  	},
		{
			type: "password",
			name: "myPassword", 
			message: "Please enter your Password"
		}
	]).then(function(user) {
		if (user.myPassword === "myPassword") {
			startManager(); //starts program
		}
		else { 
			if (attempts > 0) {
				console.log("\n I'm sorry, your password was incorrect.");
				console.log(""); 
				attempts--; 
				passwordEntry(); //goes back to password entry if incorrect
			}
			else if (attempts === 0){
				console.log("\n Sorry, you are out of attempts, please try again later.");
				console.log(""); 
				process.exit(0); //exits program after certain amount wrong
			}
		}
	})
}; 

//starts program 
function startManager() {
	console.log(""); 
	inquirer.prompt([

		{
			type: "list", 
			name: "start", 
			message: "Choose an Option to Begin", 
			choices: ["View Products for Sale", "Find a Product by Department", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Bamazon"]
		}

	]).then(function(user) {
		switch(user.start) {
			case "View Products for Sale": 
			queryProducts(); 
			break;
			case "Find a Product by Department":
			queryDepts();
			break; 
			case "View Low Inventory":
			lowInventory(); 
			break; 
			case "Add to Inventory":
			addInventory(); 
			break; 
			case "Add New Product": 
			addNewItem();
			break; 
			case "Exit Bamazon":
			exit(); 
			break; 
		}
	}); 
}; 

//queries current product list
function queryProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
  	if (err) throw err;
  	console.log("\n ID | Product | Department | Price | Quantity in Stock |"); 
  	console.log("");
    for (var i = 0; i < res.length; i++) {
      console.log("\n " + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
    }
    console.log("\n-----------------------------------");
    startManager(); //goes back to start
  });
}; 

//find products by Department
function queryDepts() {
	console.log("\n Departments");
	inquirer.prompt([

		{
	      name: "department",
	      type: "list",
	      message: "Which Department would you like to place this item in?", 
	      choices: ["Appliances", "Electronics", "Fitness", "Furniture", "Patio,_Lawn_&_Garden", "Sports_&_Outdoor"]
	    },

	]).then(function(user) {
		connection.connect(function(err){
            connection.query("SELECT * FROM products WHERE department_name = ?", [user.department], function(err, res){
                if (err) throw err;
                console.log("\n" + user.department);
                for (var i = 0; i < res.length; i++) {
      			console.log("\n " + res[i].id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
    			}
    			console.log("\n-----------------------------------");
    			start(); //back to start
            });
        });
	});
}; 

//low inventory 
function lowInventory() {
	connection.connect(function(err){
	    connection.query("SELECT * FROM products WHERE stock_quantity = 5", function(err, res){
	     	if (err) throw err;
	        for (var i = 0; i < res.length; i++) {
	      	console.log("\n " + res[i].id + " | " + res[i].department_name + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
	    		}
	    	console.log("\n-----------------------------------");
	    	startManager(); //goes back to start
	    });
  	});
}; 

//add inventory
function addInventory() {
	console.log(""); 
	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "Which item ID would you like to select?"
		}
	]).then(function(user) {
		connection.connect(function(err) {
			connection.query("SELECT * FROM products WHERE id = ?", [user.item], function(err, res) {
				if (err) throw err;
				var chosenItem;
				for (var i = 0; i < res.length; i++) {
				console.log("\n ID | Product | Department | Price | Quantity in Stock |");
      			console.log("\n " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | "); 
    			console.log(""); 
    			chosenItem = res[i]; 
	    		inquirer.prompt([
						{
							name: "quantity",
							type: "input",
							message: "How many " + chosenItem.product_name + "(s) would you like to add?" 
						},
						{
							type: "confirm", 
							message: "Is this correct? By selecting Yes, you will be adding to your inventory.", 
							name: "yes"
						}
					]).then(function(answer) {
						var x = chosenItem.stock_quantity; 
						var y = Number(answer.quantity); //changing the string to a number
						var z = x + y; 
						if (answer.yes) {
							connection.query(
								"UPDATE products SET ? WHERE ?",
								[
									{
										stock_quantity: z 
									},
									{
										id: chosenItem.id 
									}
								],
								function(err) {
									//if (err) throw err;
									console.log("\n Inventory Added successfully!"); 
									console.log("\n Total Inventory for " + chosenItem.product_name + " is: " + z); 
									startManager(); // back to start
								}
							);
						} //answer yes
						else {
							startManager(); //back to start
						}
					}); //second then function 
    			} //for statement
			}); //connection query
		}); //connection connect
	}); // then function 

}; //end addInventory

// function to handle posting new items up for sale
function addNewItem() {
  	inquirer.prompt([
	    {
	      name: "item",
	      type: "input",
	      message: "What is the Product Name of the new item you would like to submit?"
	    },
	    {
	      name: "department",
	      type: "rawlist",
	      message: "Which Department would you like to place this item in?", 
	      choices: ["Appliances", "Electronics", "Fitness", "Furniture", "Patio,_Lawn_&_Garden", "Sports_&_Outdoor"]
	    },
	    {
	      name: "price",
	      type: "input",
	      message: "What Price would you like your new item to be?"
	    }, 
	    {
	      name: "quantity",
	      type: "input", 
	      message: "What is the new item's current Stock Quantity?"
	    },
	    {
		  type: "confirm", 
		  message: "Is this correct? By selecting Yes, you will create a new Item.", 
		  name: "yes"
		}
    ]).then(function(answer) { 
    	var newPrice = Number(answer.price);
    	var newQuantity = Number(answer.quantity); 
      	if (answer.yes) {
      		connection.query("INSERT INTO products SET ?",
        		{
          			product_name: answer.item,
          			department_name: answer.department,
          			price: newPrice,
          			stock_quantity: newQuantity
        		}, function(err) {
          			if (err) throw err;
          			console.log("Your item was created successfully!");
          			startManager(); //back to start
        		}
      		); //end connection function
      	}
      	else {
      		startManager(); //back to start
      	}
    }); //end then function
}; //end addNewItem

//exit
function exit() {
	inquirer.prompt([
		{
			type: "confirm",
			name: "yes",
			message: "\n Would you like to leave the Bamazon Manager Page?" + "\n By clicking Yes you will Exit the page." + "\n By clicking No you can continue working."
		}
	]).then(function(user) {
		if (user.yes) {
			console.log("\n Come Back Soon!");
			process.exit(0); 
		}
		else {
			console.log("\n Glad to have you back!"); 
			startManager(); 
		}
	});
}; // end exit 