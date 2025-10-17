import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { User } from '../user/user.model';
import { Types } from 'mongoose';

// Define User interface to match your User model
interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  socialId?: string;
  authType?: string;
  profileImage?: string;
  Designation?: string;
  password?: string;
  ConfirmPassword?: string;
  isEmailVerified: boolean;
}

// Extend Express User interface
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// Serialize user
passport.serializeUser((user: Express.User, done) => {
  done(null, user._id.toString());
});

// Fix deserializeUser with type assertion
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user as any); // Type assertion to bypass the error
  } catch (error) {
    done(error, null);
  }
});

// Your strategies remain the same...
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  scope: ['profile', 'email']
}, async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
  try {
    const email = profile.emails?.[0]?.value;
    
    if (!email) {
      return done(new Error('Google login requires email access'), undefined);
    }

    let user = await User.findOne({ 
      $or: [
        { email },
        { socialId: profile.id, authType: 'google' }
      ]
    });

    if (user) {
      user.socialId = profile.id;
      user.authType = 'google';
      user.profileImage = profile.photos?.[0]?.value;
      user.isEmailVerified = true;
      if (!user.lastName) user.lastName = profile.name?.familyName || '';
      await user.save();
      return done(null, user as any);
    } else {
      user = await User.create({
        firstName: profile.name?.givenName || 'Google',
        lastName: profile.name?.familyName || 'User',
        email: email,
        socialId: profile.id,
        authType: 'google',
        profileImage: profile.photos?.[0]?.value,
        Designation: 'Social User',
        password: 'social-auth-no-password',
        ConfirmPassword: 'social-auth-no-password',
        isEmailVerified: true
      });
      return done(null, user as any);
    }
  } catch (error) {
    return done(error, undefined);
  }
}));

// Facebook Strategy (similar fix)
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
  profileFields: ['id', 'emails', 'name', 'photos']
}, async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
  try {
    const email = profile.emails?.[0]?.value;
    
    if (!email) {
      return done(new Error('Facebook login requires email access'), undefined);
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
      return done(null, user as any);
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
      return done(null, user as any);
    }
  } catch (error) {
    return done(error, undefined);
  }
}));

// Apple Strategy (similar fix)
passport.use(new (AppleStrategy as any)({
  clientID: process.env.APPLE_CLIENT_ID!,
  teamID: process.env.APPLE_TEAM_ID!,
  keyID: process.env.APPLE_KEY_ID!,
  key: process.env.APPLE_PRIVATE_KEY!,
  callbackURL: process.env.APPLE_CALLBACK_URL!,
  scope: ['name', 'email'],
  passReqToCallback: false
}, async (
  accessToken: string, 
  refreshToken: string, 
  idToken: any, 
  profile: any, 
  done: (error: any, user?: any) => void
) => {
  try {
    let email: string | undefined;
    let sub: string | undefined;

    try {
      const decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      email = decodedToken.email;
      sub = decodedToken.sub;
    } catch (parseError) {
      console.error('Error parsing Apple idToken:', parseError);
      return done(new Error('Invalid Apple token'), undefined);
    }
    
    if (!email || !sub) {
      return done(new Error('Apple login requires email access'), undefined);
    }

    let user = await User.findOne({
      $or: [
        { email },
        { socialId: sub, authType: 'apple' }
      ]
    });

    if (user) {
      user.socialId = sub;
      user.authType = 'apple';
      user.isEmailVerified = true;
      await user.save();
      return done(null, user as any);
    } else {
      const firstName = profile?.name?.firstName || 'Apple';
      const lastName = profile?.name?.lastName || 'User';

      user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        socialId: sub,
        authType: 'apple',
        Designation: 'Social User',
        password: 'social-auth-no-password',
        ConfirmPassword: 'social-auth-no-password',
        isEmailVerified: true
      });
      return done(null, user as any);
    }
  } catch (error) {
    console.error('Apple Strategy Error:', error);
    return done(error, undefined);
  }
}));

export default passport;