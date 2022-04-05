import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import {
  GoogleUserEmailResponce,
  GoogleAccessTokenResponse,
} from 'types/googleAuthTypes';
import User from 'entities/user';
import UserORM from 'repositories/orm-user';

const config = dotenv.config().parsed!;

export default class GoogleAuthService {
  private static getAccessToken = async (queryCode: string) => {
    const accessTokenRequestURL = config.GOOGLE_GET_ACCESS_TOKEN_URL!;
    const accessTokenRequestURLParams = new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID!,
      client_secret: config.GOOGLE_CLIENT_SECRET!,
      code: queryCode,
      grant_type: 'authorization_code',
      redirect_uri: config.GOOGLE_RESPONSE_REDIRECT_URL!,
    }).toString();
    const accessTokenRequestOptions = {
      method: 'post',
      headers: { accept: 'application/json' },
    };
    const accessTokenResponse = await fetch(
      `${accessTokenRequestURL}?${accessTokenRequestURLParams}`,
      accessTokenRequestOptions,
    );
    const parsedAccessToken = (await accessTokenResponse.json()) as GoogleAccessTokenResponse;
    return parsedAccessToken;
  };

  private static getUserEmail = async (accessToken: string) => {
    const userEmailRequestURL = config.GOOGLE_GET_USER_EMAIL_URL!;
    const userEmailRequestURLParams = new URLSearchParams({
      access_token: accessToken,
    }).toString();
    const userEmailResponse = await fetch(
      `${userEmailRequestURL}?${userEmailRequestURLParams}`,
    );
    const parsedUserEmailArray = (await userEmailResponse.json()) as GoogleUserEmailResponce;
    return parsedUserEmailArray;
  };

  // Public

  public static getRedirectURL = () => {
    const redirectURL = config.GOOGLE_REDIRECT_URL!;
    const redirectURLParams = new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID!,
      scope: config.GOOGLE_REDIRECT_URL_SCOPE!,
      response_type: 'code',
      redirect_uri: config.GOOGLE_RESPONSE_REDIRECT_URL!,
    }).toString();
    return `${redirectURL}?${redirectURLParams}`;
  };

  public static authenticate = async (code: string) => {
    const accessTokenResponce = await this.getAccessToken(code);
    const userEmailResponce = await this.getUserEmail(
      accessTokenResponce.access_token,
    );
    const userToFind = new User(userEmailResponce.email);
    const user = await UserORM.findOrCreate(userToFind);
    return user;
  };
}
