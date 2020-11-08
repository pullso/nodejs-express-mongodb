const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const helmet = require('helmet')
const compression = require('compression')
const MongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/cart')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')
const fileMiddleware = require('./middleware/file')

require('dotenv').config()

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: require('./utils/hbs.helpers'),
})

const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.MONGODB_URI,
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET || 'some secret',
  resave: false,
  saveUninitialized: false,
  store,
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

async function start () {
  try {
    const url = process.env.MONGODB_URI
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${ PORT }`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()

