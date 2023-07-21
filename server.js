const express = require( "express" );
const cors = require( "cors" );
const mongoose = require( "mongoose" );
const app = express();
const path = require("path");
require( "dotenv" ).config();

// Configure Express to parse JSON bodies
app.use( express.json() );
app.use( cors() );
app.use( express.static( path.join( __dirname, "build" ) ) );

const PORT = process.env.PORT || 4000;

// Connection to the MongoDB database named restaurant
mongoose.connect( process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} ).then( () => {
    console.log( "Connection to MongoDB successful" );
} ).catch( ( error ) => {
    console.log( "Failed to connect to MongoDB:", error );
} );

// Define the schema for the menu item
const menuItemSchema = new mongoose.Schema( {
    id: Number,
    name: String,
    image: String,
    category: String,
    label: String,
    price: String,
    description: String,
} );

// Create the model for the menu item
const MenuItem = mongoose.model( "menuitems", menuItemSchema );

app.get( "/", function ( req, res ) {
    res.sendFile( path.join( __dirname, "build", "index.html" ) );
} );

// API endpoint to fetch all menu items
app.get( "/api/menu", async ( req, res ) => {
    try {
        const menuItems = await MenuItem.find();
        res.json( menuItems );
    } catch ( error ) {
        res.status( 500 ).json( { error: "Internal server error" } );
    }
} );

// API endpoint to fetch Price of a item with ID
app.get( "/api/menu/:id", async ( req, res ) => {
    try {
        const id = req.params.id;
        const menuItem = await MenuItem.findOne( { id: Number( id ) } );
        if ( menuItem ) {
            res.json( { price: menuItem.price } );
        } else {
            res.status( 404 ).json( { error: "Menu item not found" } );
        }
    } catch ( error ) {
        res.status( 500 ).json( { error: "Internal server error" } );
    }
} );

// API endpoint to update a menu item's price
app.put( "/api/menu/:id", async ( req, res ) => {
    const { id } = req.params;
    const { price } = req.body;

    try {
        await MenuItem.findOneAndUpdate( { id: Number( id ) }, { price } );
        res.sendStatus( 200 );
    } catch ( error ) {
        res.status( 500 ).json( { error: "Internal server error" } );
    }
} );

// Start the server
app.listen( PORT, () => {
    console.log( "Server is running on port", PORT );
} );
