export interface ReturnUser {
  _id: string;
  email: string;
  password: string;
  // other fields...
}

export interface JwtPayload {
  sub: string;
  email: string;
}
