const express = require('express')
const dotenv = require("dotenv");
const database = require('./config/database')
const systemConfig = require('./config/system')
const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
dotenv.config();

database.connect()

const app = express()
const port = process.env.PORT

app.set('views', './views')
app.set('view engine', 'pug')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Flash
app.use(cookieParser('HKAHLALASGAD'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// Method override
app.use(methodOverride('_method'))

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static('public'))

// Routes
routeClient(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})