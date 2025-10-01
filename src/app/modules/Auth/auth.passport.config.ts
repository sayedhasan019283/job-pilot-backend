import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { User } from '../user/user.model';
import { Document, Types } from 'mongoose';
import { TUser } from '../user/user.interface';

// Setup the Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'https://debut-tue-republican-grants.trycloudflare.com/api/v1/auth/google/callback', // Replace with your callback URL
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOne({ email: profile?.emails![0].value });
  if (user) {
    return done(null, user);
  } else {
    const newUser = new User({
      email: profile?.emails![0].value,
      firstName: profile?.name?.givenName,
      lastName: profile?.name?.familyName,
      profileImage: profile?.photos![0].value,
    });
    await newUser.save();
    return done(null, newUser);
  }
}));

// Setup the Facebook OAuth strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID!,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  callbackURL: 'https://debut-tue-republican-grants.trycloudflare.com/api/v1/auth/facebook/callback', // Replace with your callback URL
  profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOne({ email: profile.emails![0].value });
  if (user) {
    return done(null, user);
  } else {
    const newUser = new User({
      email: profile.emails![0].value,
      firstName: profile?.name?.givenName,
      lastName: profile?.name?.familyName,
      profileImage: profile.photos ? profile.photos[0].value : null,
    });
    await newUser.save();
    return done(null, newUser);
  }
}));



passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await User.findById(id);
  done(null, user);
});
