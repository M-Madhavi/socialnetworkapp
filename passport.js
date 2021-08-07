const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./models/user')
const passport = require('passport')


  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:9000/api/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('passport callback function fired:');
        console.log(profile);
        //store user into DB if login with google account
       const user= await new User({
            googleId: profile.id,
            name: profile.displayName,
            dp:profile.photos[0].value,//grabbing dp from google account
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

