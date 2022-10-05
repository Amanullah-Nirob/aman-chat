export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

  export interface LoginRequest {
    email: string;
    password: string;
  }
  

  export interface AuthResponse {
    _id: string,
    name: string,
    email: string,
    notifications: [],
    cloudinary_id: string,
    profilePic: string,
    token: string,
    expiryTime: number
}

  export interface loginResponse {
    _id: string,
    name: string,
    email: string,
    notifications: [],
    cloudinary_id: string,
    profilePic: string,
    all:{
      "_id": string,
      "name": string,
      "email": string,
      "password": string,
      "notifications": [],
      "cloudinary_id": string,
      "profilePic": string,
      "createdAt": string,
      "updatedAt":string,
      "__v": number
    },
    token: string,
    expiryTime: number,
}
  





