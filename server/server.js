const express = require( "express" );
const cors = require( "cors" );
const mongoose = require( "mongoose" );
const app = express();
require( "dotenv" ).config();

// Configure Express to parse JSON bodies
app.use( express.json() );
app.use( cors() );

const PORT = process.env.PORT || 3001;

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
const MenuItem = mongoose.model("menuitems", menuItemSchema);

// API endpoint to fetch all menu items
app.get( "https://mern-finvestfx-server.vercel.app/menu", async ( req, res ) => {
    try {
        const menuItems = await MenuItem.find();
        res.json( menuItems );
    } catch ( error ) {
        res.status( 500 ).json( { error: "Internal server error" } );
    }
} );

// API endpoint to update a menu item's price
app.put( "/menu/:id", async ( req, res ) => {
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
