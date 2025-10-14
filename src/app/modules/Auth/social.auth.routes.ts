// routes/social.auth.routes.ts
import express from 'express';
import passport from './auth.passport.config';
import { AuthController } from './auth.controller';

const router = express.Router();

// Social authentication routes (NO validation middleware)
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false 
}));

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/v1/auth/failure',
    session: false 
  }),
  AuthController.socialLoginSuccess
);

router.get('/facebook', passport.authenticate('facebook', { 
  scope: ['email'],
  session: false 
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/api/v1/auth/failure',
    session: false 
  }),
  AuthController.socialLoginSuccess
);

router.get('/apple', passport.authenticate('apple', {
  session: false
}));

router.post('/apple/callback',
  passport.authenticate('apple', { 
    failureRedirect: '/api/v1/auth/failure',
    session: false 
  }),
  AuthController.socialLoginSuccess
);

// Social auth failure route
router.get('/failure', AuthController.socialLoginFailure);

export const SocialAuthRoutes = router;