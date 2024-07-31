const express = require('express')
require('dotenv').config()
const database = require('./config/database')
const systemConfig = require('./config/system')
const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")

database.connect()

const app = express()
const port = process.env.PORT

app.set('views', './views')
app.set('view engine', 'pug')

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static('public'))

// Routes
routeClient(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})