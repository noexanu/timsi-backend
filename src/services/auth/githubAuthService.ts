import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import {
  GithubUserEmailResponce,
  GithubAccessTokenResponse,
} from 'types/githubAuthTypes';
import User from 'entities/user';
import UserORM from 'repositories/orm-user';

const config = dotenv.config().parsed!;

export default class GithubAuthService {
  private static getAccessToken = async (queryCode: string) => {
    const accessTokenRequestURL = config.GITHUB_GET_ACCESS_TOKEN_URL!;
    const accessTokenRequestURLParams = new URLSearchParams({
      client_id: config.GITHUB_CLIENT_ID!,
      client_secret: config.GITHUB_CLIENT_SECRET!,
      code: queryCode,
      redirect_uri: config.GITHUB_RESPONSE_REDIRECT_URL!,
    }).toString();
    const accessTokenRequestOptions = {
      method: 'post',
      headers: { accept: 'application/json' },
    };
    const accessTokenResponse = await fetch(
      `${accessTokenRequestURL}?${accessTokenRequestURLParams}`,
      accessTokenRequestOptions,
    );
    const parsedAccessToken = (await accessTokenResponse.json()) as GithubAccessTokenResponse;
    return parsedAccessToken;
  };

  private static getUserEmail = async (accessToken: string) => {
    const userEmailRequestURL = config.GITHUB_GET_USER_EMAIL_URL!;
    const userEmailRequestOptions = {
      headers: { authorization: `token ${accessToken}` },
    };
    const userEmailResponse = await fetch(
      userEmailRequestURL,
      userEmailRequestOptions,
    );
    const parsedUserEmailArray = (await userEmailResponse.json()) as GithubUserEmailResponce[];
    return parsedUserEmailArray.find(({ primary }) => primary)!;
  };

  // Public

  public static getRedirectURL = () => {
    const redirectURL = config.GITHUB_REDIRECT_URL!;
    const redirectURLParams = new URLSearchParams({
      client_id: config.GITHUB_CLIENT_ID!,
      scope: config.GITHUB_REDIRECT_URL_SCOPE!,
      redirect_uri: config.GITHUB_RESPONSE_REDIRECT_URL!,
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
