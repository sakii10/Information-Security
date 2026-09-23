import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import {Token} from "./token/token";
import {JwtHelperService} from '@auth0/angular-jwt'
import {LoginCredentials} from "../../models/User";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  user$ = new BehaviorSubject(null);
  userState$ = this.user$.asObservable();

  constructor(private http:HttpClient) {
    this.user$.next(this.getRole());
  }

  login(auth:any):Observable<any>{
    console.log(auth);
    return this.http.post<any>(environment.apiHost + 'api/user/login', auth, {
      headers:this.headers,
    });
  }

  confirmLogin(verification: string) : Observable<any> {
    return this.http.post<any>(environment.apiHost + 'api/user/login/confirm/' + verification, {
      headers:this.headers,
    });
  }

  logout(): Observable<string> {
    return this.http.get(environment.apiHost + 'api/user/logout',{
      responseType:'text',
    });
  }

  isLoggedIn(): boolean{
    return localStorage.getItem('user') != null;
  }

  getRole():any{
    if(this.isLoggedIn()){
      const accessToken: string = <string>localStorage.getItem('user');
      const helper = new JwtHelperService();
      const role = helper.decodeToken(accessToken).role.name;
      return role;
    }
    return null;
  }

  setUser(): void{
    this.user$.next(this.getRole());
  }

}
