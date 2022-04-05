import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import TokenService from 'services/tokenService';
import { TokenData, TokenPayload } from 'types/tokenTypes';

const config = dotenv.config().parsed!;

test('Properly create access token', () => {
  const accessTokenSecret = config.JWT_ACCESS_TOKEN_SECRET!;
  const expiresIn = config.JWT_ACCESS_TOKEN_EXPIRES_IN!;
  const accessTokenProperties = { expiresIn };
  const accessTokenData: TokenData = {
    id: '12345',
  };

  expect(TokenService.createAccessToken(accessTokenData)).toBe(
    jwt.sign(accessTokenData, accessTokenSecret, accessTokenProperties),
  );
});

test('Properly create refresh token', () => {
  const refreshTokenSecret = config.JWT_REFRESH_TOKEN_SECRET!;
  const expiresIn = config.JWT_REFRESH_TOKEN_EXPIRES_IN!;
  const refreshTokenProperties = { expiresIn };
  const refreshTokenData: TokenData = {
    id: '12345',
  };

  expect(TokenService.createRefreshToken(refreshTokenData)).toBe(
    jwt.sign(refreshTokenData, refreshTokenSecret, refreshTokenProperties),
  );
});

test('Create tokens successfully', () => {
  const tokenData: TokenData = {
    id: '12345',
  };
  const tokens = TokenService.createTokens(tokenData);

  expect(Object.keys(tokens)).toMatchObject(['accessToken', 'refreshToken']);
  expect(typeof tokens.accessToken).toBe('string');
  expect(typeof tokens.refreshToken).toBe('string');
});

test('Properly verify access token', () => {
  const fakeToken = (
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );
  const tokenData: TokenData = {
    id: '12345',
  };
  const accessToken = TokenService.createAccessToken(tokenData);
  const verificationResult = TokenService.verifyAccessToken(
    accessToken,
  ) as TokenPayload;

  expect(TokenService.verifyAccessToken('')).toBeNull();
  expect(TokenService.verifyAccessToken(fakeToken)).toBeNull();
  expect(Object.keys(verificationResult)).toMatchObject(['id', 'iat', 'exp']);
  expect(verificationResult.id).toBe(tokenData.id);
});

test('Properly verify refresh token', () => {
  const fakeToken = (
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );
  const tokenData: TokenData = {
    id: '12345',
  };
  const refreshToken = TokenService.createRefreshToken(tokenData);
  const verificationResult = TokenService.verifyRefreshToken(
    refreshToken,
  ) as TokenPayload;

  expect(TokenService.verifyRefreshToken('')).toBeNull();
  expect(TokenService.verifyRefreshToken(fakeToken)).toBeNull();
  expect(Object.keys(verificationResult)).toMatchObject(['id', 'iat', 'exp']);
  expect(verificationResult.id).toBe(tokenData.id);
});

test('Properly refresh tokens', async () => {
  const fakeToken = (
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );
  const tokenData: TokenData = {
    id: '12345',
  };
  const refreshToken = TokenService.createRefreshToken(tokenData);
  // iat changing once per second
  await new Promise((resolve) => { setTimeout(resolve, 1000); });
  const refreshResult = TokenService.refreshTokens(refreshToken);

  expect(TokenService.refreshTokens('')).toBeNull();
  expect(TokenService.refreshTokens(fakeToken)).toBeNull();
  expect(Object.keys(refreshResult!)).toMatchObject(['accessToken', 'refreshToken']);
  expect(typeof refreshResult?.accessToken).toBe('string');
  expect(typeof refreshResult?.refreshToken).toBe('string');
  expect(refreshResult?.refreshToken).not.toBe(refreshToken);
});
