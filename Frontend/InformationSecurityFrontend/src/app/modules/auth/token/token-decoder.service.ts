import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class TokenDecoderService {

  getDecodedAccessToken():any{
    try{
      return jwt_decode(<string>localStorage.getItem('user'));
    }catch(Error){
      return null;
    }
  }
}
