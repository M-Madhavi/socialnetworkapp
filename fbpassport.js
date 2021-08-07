const FacebookStrategy = require('passport-facebook').Strategy
const User = require('./models/user')
const passport = require('passport')

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:9000/api/facebook/callback',
        profileFields:['id','displayName','dp','email' ]
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('passport callback function fired:');
        console.log(profile);
       const user= await new User({
            facebookId: profile.id,
            name: profile.displayName,
            dp:profile.photos[0].value,
            //email:profile.email

        }).save().then((newUser) => {
            console.log('new user created: ', newUser);
        });
    })
);
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })

