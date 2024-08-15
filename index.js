const express = require('express')
const path = require('path')
require("dotenv").config();
const database = require('./config/database')
const systemConfig = require('./config/system')
const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const moment = require("moment");
require('events').EventEmitter.defaultMaxListeners = Infinity;
const http = require('http');
const { Server } = require("socket.io");

database.connect()

const app = express()
const port = process.env.PORT

app.set("views", `${__dirname}/views`);
app.set('view engine', 'pug')

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End SocketIO

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Flash
app.use(cookieParser('HKAHLALASGAD'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Method override
app.use(methodOverride('_method'))

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

app.use(express.static(`${__dirname}/public`));

// Routes
routeClient(app)
routeAdmin(app)

app.get('*', (req, res) => {
    res.render('client/pages/errors/404', {
        pageTitle: '404 Not Found'
    })
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})