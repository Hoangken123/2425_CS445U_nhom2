require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
app.use(cors());
const webRouter = require('./routers/api');
const hostname = process.env.HOST_NAME;
const port = process.env.PORT;
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
// Configure body parsing middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
// Configure view engine and layouts
app.set('view engine', 'ejs');
app.use(expressLayouts); 
app.set('views', path.join(__dirname, 'view'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));

// Configure session middleware before the routes that use it
app.use(session({
    secret: process.env.SESSION_SECRET,  // Ensure your .env file has SESSION_SECRET set
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        path: '/', // If set, this needs to be specified when clearing the cookie
        httpOnly: true  // Helps protect against client-side scripting attacks
    }
}));

// Route handling
app.use('/', webRouter);

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/login`);
});
