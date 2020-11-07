const { Router } = require('express')
const User = require('../models/user')

const router = new Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  const user = await User.findById('5f8c39c13c6ae83f45c27e43')
  req.session.user = user
  req.session.isAuthenticated = true
  req.session.save((error) => {
    if (error) throw error
    res.redirect('/')
  })
})

module.exports = router
