const express = require('express')
const passport = require('passport')
const router = express.Router()

//common Routes
router.get('/',(req,res) => res.send('home page'))
router.get('/failed',(req,res) => res.send('failed to login'))
router.get('/dashboard',(req,res) => res.send(`welcome  ${req.user.displayName}`))

//google routes
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/dashboard');
  });
//google logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

//fb routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['profile'] }))

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect:'/dashboard',
    failureRedirect: '/failed' })
  );



module.exports = router
