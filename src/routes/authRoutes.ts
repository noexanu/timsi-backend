import { Router } from 'express';
import AuthController from 'controllers/authController';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);

router.get('/github', AuthController.githubRedirect);
router.get('/github/callback', AuthController.githubCallback);

router.get('/google', AuthController.googleRedirect);
router.get('/google/callback', AuthController.googleCallback);

export default router;
