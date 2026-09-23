
export interface User{
  name:string;
  surname:string;
  telephoneNumber:string;
  email:string;
  password?:string;
  activationMethod?: string;
  userType?: string;
  id?:number;
  recaptchaResponse: string;
}


export interface LoginCredentials {
  email : string;
  password: string;
  recaptchaResponse: string;
}
