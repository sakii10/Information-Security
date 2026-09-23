import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../../models/User";
import {Observable} from "rxjs";
import {environment} from "../../../environment/environment";
import {PasswordResetDTO, PasswordResetRequest} from "../../../models/PasswordResetRequest";
import {RequestInfoDTO} from "../../../models/Request";
import {OAuthUser} from "../../../models/OAuthUser";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  registerStandardUser(user : User) : Observable<any> {
    return this.http.post<any>(environment.apiHost + 'api/user/register', user, {
      headers:this.headers,
    });
  }


  activateAccount(verificationCode: string) : Observable<any>{
    return this.http.get<any>(environment.apiHost + 'api/user/activate/' + verificationCode,{
      headers:this.headers,
    });
  }

  requestPasswordReset(contact : any, method:string) : Observable<any> {
    const reset : PasswordResetRequest ={
      passwordResetMethod : method,
      contact : contact
    }
    return this.http.post<any>(environment.apiHost + 'api/user/password/reset/request', reset, {
      headers:this.headers
    })
  }

  resetPassword(resetCode : any, passwordReset : PasswordResetDTO) : Observable<any> {
    return this.http.post<any>(environment.apiHost + 'api/user/password/reset/' + resetCode, passwordReset, {
      headers:this.headers
    })
  }

  getAllRequestsForAdmin() : Observable<RequestInfoDTO[]> {
    return this.http.get<RequestInfoDTO[]>(environment.apiHost + 'api/certificate/requests', {
      headers: this.headers
    })
  }

  oauthSignIn(user: OAuthUser) : Observable<any> {
    return this.http.post<any>(environment.apiHost + "api/user/oauth", user, {
      headers: this.headers
    })
  }

}
