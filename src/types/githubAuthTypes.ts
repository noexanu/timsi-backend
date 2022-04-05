export interface GithubAccessTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}

export interface GithubUserEmailResponce {
  email: string,
  primary: boolean,
  verified: boolean,
  visibility: string | null,
}
