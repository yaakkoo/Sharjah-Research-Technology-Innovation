
export interface IRegister {
  name: string,
  phone: string,
  email: string,
  password: string,
  repeatedPassword: string,
}

export interface IRestaurantOTP {
  otpCode: string,
  otpCodeValidUntil: string
}


export interface IResponse {
  id: number;
  email: string;
  verified: boolean;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ILogin {
  email: string,
  password: string
}

export interface IRefreshTokenBody {
  token: string;
}

export const UserResponse = (user: any) => {
  const { id, email, verified, accessToken, refreshToken, role } = user;

  const response: IResponse = {
    id,
    email,
    verified,
    accessToken,
    refreshToken,
    role,
  };

  return response;
};
