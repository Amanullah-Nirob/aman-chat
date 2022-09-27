export interface RegisterRequest {
    image?:any;
    username: string;
    email: string;
    password: string;
}

  export interface LoginRequest {
    email: string;
    password: string;
  }
  

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
