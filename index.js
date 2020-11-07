const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/cart')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
require('dotenv').config()

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET || 'some secret',
  resave: false,
  saveUninitialized: false,
}))
app.use(varMiddleware)

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById('5f8c39c13c6ae83f45c27e43')
//     req.user = user
//     next()
//   } catch (e) {
//     console.log(e)
//   }
// })

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start () {
  try {
    const url = process.env.MONGODB_URL
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // const candidate = await User.findOne()
    // if (!candidate) {
    //   const user = new User({
    //     email: 'pavelprobm@gmail.com',
    //     name: 'Pavel',
    //     cart: { items: [] },
    //   })
    //   await user.save()
    // }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${ PORT }`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()

