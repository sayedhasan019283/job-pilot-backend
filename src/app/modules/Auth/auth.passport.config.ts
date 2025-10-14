import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { User } from '../user/user.model';
import { Types } from 'mongoose';

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    
    if (!email) {
      return done(new Error('Google login requires email access'), null);
    }

    let user = await User.findOne({ 
      $or: [
        { email },
        { socialId: profile.id, authType: 'google' }
      ]
    });

    if (user) {
      // Update existing user
      user.socialId = profile.id;
      user.authType = 'google';
      user.profileImage = profile.photos?.[0]?.value;
      user.isEmailVerified = true;
      if (!user.lastName) user.lastName = profile.name?.familyName || '';
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firstName: profile.name?.givenName || 'Google',
        lastName: profile.name?.familyName || 'User',
        email: email,
        socialId: profile.id,
        authType: 'google',
        profileImage: profile.photos?.[0]?.value,
        Designation: 'Social User',
        password: 'social-auth-no-password', // Dummy password
        ConfirmPassword: 'social-auth-no-password',
        isEmailVerified: true
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
  profileFields: ['id', 'emails', 'name', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    
    if (!email) {
      return done(new Error('Facebook login requires email access'), null);
    }

    let user = await User.findOne({
      $or: [
        { email },
        { socialId: profile.id, authType: 'facebook' }
      ]
    });

    if (user) {
      user.socialId = profile.id;
      user.authType = 'facebook';
      user.profileImage = profile.photos?.[0]?.value;
      user.isEmailVerified = true;
      if (!user.lastName) user.lastName = profile.name?.familyName || '';
      await user.save();
    } else {
      user = await User.create({
        firstName: profile.name?.givenName || 'Facebook',
        lastName: profile.name?.familyName || 'User',
        email: email,
        socialId: profile.id,
        authType: 'facebook',
        profileImage: profile.photos?.[0]?.value,
        Designation: 'Social User',
        password: 'social-auth-no-password',
        ConfirmPassword: 'social-auth-no-password',
        isEmailVerified: true
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Apple Strategy
passport.use(new AppleStrategy({
  clientID: process.env.APPLE_CLIENT_ID!,
  teamID: process.env.APPLE_TEAM_ID!,
  keyID: process.env.APPLE_KEY_ID!,
  key: process.env.APPLE_PRIVATE_KEY!,
  callbackURL: process.env.APPLE_CALLBACK_URL!,
  scope: ['name', 'email']
}, async (accessToken, refreshToken, idToken: any, profile, done) => {
  try {
    const email = idToken.email || profile.email;
    
    if (!email) {
      return done(new Error('Apple login requires email access'), null);
    }

    let user = await User.findOne({
      $or: [
        { email },
        { socialId: idToken.sub, authType: 'apple' }
      ]
    });

    if (user) {
      user.socialId = idToken.sub;
      user.authType = 'apple';
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        firstName: profile.name?.firstName || 'Apple',
        lastName: profile.name?.lastName || 'User',
        email: email,
        socialId: idToken.sub,
        authType: 'apple',
        Designation: 'Social User',
        password: 'social-auth-no-password',
        ConfirmPassword: 'social-auth-no-password',
        isEmailVerified: true
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

export default passport;