

const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/board')
  }
)


router.get('/logout', (req, res, next) => {
  req.logout((error) => {
      if (error) {return next(error)}
      res.redirect('/')
  })
})

module.exports = router