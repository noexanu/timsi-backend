import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { CookieOptions } from 'express-serve-static-core';
import User from 'entities/user';
import UserService from 'services/userService';
import AuthService from 'services/auth/authService';
import GithubAuthService from 'services/auth/githubAuthService';
import GoogleAuthService from 'services/auth/googleAuthService';

const config = dotenv.config().parsed!;

const DEFAULT_COOKIES_PARAMS: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
};

export default class AuthController {
  public static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = new User(email, password);
    const newTokens = await AuthService.login(user);
    if (newTokens) {
      res
        .cookie('accessToken', newTokens.accessToken, DEFAULT_COOKIES_PARAMS)
        .cookie('refreshToken', newTokens.refreshToken, DEFAULT_COOKIES_PARAMS)
        .status(200)
        .end();
    } else {
      res
        .status(401)
        .end();
    }
  };

  public static register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = new User(email, password);
    const newTokens = await AuthService.register(user);
    if (newTokens) {
      res
        .cookie('accessToken', newTokens.accessToken, DEFAULT_COOKIES_PARAMS)
        .cookie('refreshToken', newTokens.refreshToken, DEFAULT_COOKIES_PARAMS)
        .status(200)
        .end();
    } else {
      res
        .status(409)
        .end();
    }
  };

  public static logout = async (req: Request, res: Response) => {
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .status(200)
      .end();
  };

  public static githubRedirect = async (req: Request, res: Response) => {
    const redirectURL = GithubAuthService.getRedirectURL();
    res.redirect(redirectURL);
  };

  public static githubCallback = async (req: Request, res: Response) => {
    const code = req.query.code!.toString();
    const user = await GithubAuthService.authenticate(code);
    const { accessToken, refreshToken } = UserService.createTokens(user);
    res
      .cookie('accessToken', accessToken, DEFAULT_COOKIES_PARAMS)
      .cookie('refreshToken', refreshToken, DEFAULT_COOKIES_PARAMS)
      .redirect(config.SUCCESS_AUTH_REDIRECT_URL!);
  };

  public static googleRedirect = async (req: Request, res: Response) => {
    const redirectURL = GoogleAuthService.getRedirectURL();
    res.redirect(redirectURL);
  };

  public static googleCallback = async (req: Request, res: Response) => {
    const code = req.query.code!.toString();
    const user = await GoogleAuthService.authenticate(code);
    const { accessToken, refreshToken } = UserService.createTokens(user);
    res
      .cookie('accessToken', accessToken, DEFAULT_COOKIES_PARAMS)
      .cookie('refreshToken', refreshToken, DEFAULT_COOKIES_PARAMS)
      .redirect(config.SUCCESS_AUTH_REDIRECT_URL!);
  };
}
