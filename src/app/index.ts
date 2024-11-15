// interfaces.ts

export interface Login {
    email: string;
    password: string;
  }
  
  export interface User {
    username: string;
    email: string;
  }
  
  export interface LoginError {
    status: number;
    errorMessage: string; 
  }
  
  export interface LoginSuccess {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface LoginResponse {
    data: LoginSuccess  ;
    errorMessage: string | null;
    isSuccess: boolean;
    isFail: boolean;
    status: number;
    urlCreated: string | null;
  }
  