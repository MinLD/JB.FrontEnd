export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: number;
};
export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};
