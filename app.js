require('dotenv').config()
const express = require("express")
const morgan = require('morgan');
const app = express()
const PORT = 3001
const routes = require("./routes")
const errorHandler = require("./middlewares/errorHandler")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger'); 

app.use(morgan('dev'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(routes)
app.use(errorHandler); // paling terkahir

app.listen(PORT, () => {
    console.log("LISTENING ON PORT " + PORT);
})