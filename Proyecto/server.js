const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

//modules
const bodyparser = require("body-parser")
const path = require('path');

//controller
const { createUser, validateUser,validateQuestion, validateEmail,updateUserRecovery, inactiveAccount, createItems, getItemsByCategory, getItemById, createOrder, serviceOrder,
    createAccountToken, validateCreationToken, sendLocal, DeleteToken, createLog, getDollarValue, findIdDocument,validateIdDocument,completePurchase} = require("../Proyecto/server/controller/controller");

const connectDB = require('./server/database/connection');
const app = express();

dotenv.config( {path:'config.env'} )
const PORT = process.env.PORT || 8080


//might delete later
app.use(express.static(path.join(__dirname, '.')));
//log requests
app.use(morgan('tiny'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//mongodb conexion
connectDB();

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

//Rutas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/aboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'aboutUs.html'));
});

app.get('/contactUs', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contactUs.html'));
});
//instruments
app.get('/bass', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bass.html'));
});

app.get('/drums', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'drums.html'));
});

app.get('/keyboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'keyboard.html'));
});

app.get('/guitar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'guitar.html'));
});
//the others
app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'product.html'));
});

app.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'));
});

app.get('/RecoverAccount', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'RecoverAccount.html'));
});

app.get('/Registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Registro.html'));
});

app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, '.', 'manifest.json'));
});



//API Users
app.post("/create-user", createUser);
app.post("/validate-email", validateEmail);
app.post("/validate-id-document", validateIdDocument);
app.post("/validate-user", validateUser);
app.post("/send-local", sendLocal);
app.post('/recover-account', updateUserRecovery);
app.post('/inactive-account', inactiveAccount);
app.post('/validate-question', validateQuestion);
//API Items
app.post("/create-item", createItems);
app.get('/get-item/:category', getItemsByCategory);
app.get('/get-item-by-id/:id', getItemById);
//API Orders
app.post('/create-order', createOrder);
app.post('/service-order', serviceOrder);
app.post('/complete-purchase', completePurchase);
//API Tokens
app.post('/create-account-token', createAccountToken);
app.post('/validate-creation-token', validateCreationToken);
app.post('/delete-token', DeleteToken);
//API logs
app.post("/create-log", createLog);
//API cors
app.use(cors());
//API valor usd
app.post("/getDollarValue", getDollarValue);
//API cedula
app.post("/findIdDocument", findIdDocument);



//listening
app.listen(PORT, () => {
    console.log(`The server is working at port: http://localhost:${PORT}`);
});/* port env*/

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${PORT}`);
    next();
});