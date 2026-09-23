import {AfterViewInit, Component} from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {UserService} from "../../services/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginCredentials} from "../../../models/User";
import {OAuthUser} from "../../../models/OAuthUser";
declare var google: any;
declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{
  loginForm = new FormGroup(
    {
      //TODO: VRATITI KAKO JE BILO
      // email: new FormControl('', [Validators.required, Validators.minLength(4), Validators.email]),
      // password: new FormControl('', [Validators.required, Validators.minLength(5)])
      email: new FormControl(''),
      password: new FormControl('')
    }
  );
  hasError = false;
  verification = false;
  verificationCode: any;
  errMsg : string = ""
  type:String = "EMAIL"
  sitekey:string = "6LemegUmAAAAAHGfsB3xSgM7okBwXo1jnoB0TF19"; // TODO: IZMENA
  user: OAuthUser = {
    name:"",
    email:"",
    surname:""
  }

  constructor(private router:Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: "991006796356-vkj5qicge880ehd0aj6vudgstflrddnl.apps.googleusercontent.com", // IZMENJENO NA MENE
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", type: "icon", shape: "pill" }  // customization attributes
    );
  }

  handleGoogleSignIn(response: any) {


    // This next is for decoding the idToken to an object if you want to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));


    this.user.email = JSON.parse(jsonPayload).email;
    this.user.name = JSON.parse(jsonPayload).given_name;
    this.user.surname = JSON.parse(jsonPayload).family_name;

    this.userService.oauthSignIn(this.user).subscribe({
      next: (result) => {
        const keys = Object.keys(result);
        if (keys.length === 2){
          localStorage.setItem('user', JSON.stringify(result["accessToken"]));
          this.authenticationService.setUser();
          this.router.navigate(['/allCertificates']);
        }
        else{
          this.userService.oauthSignIn(this.user).subscribe({
            next: (result) => {
              const keys = Object.keys(result);
              if (keys.length === 1){
                localStorage.setItem('user', JSON.stringify(result["accessToken"]));
                this.authenticationService.setUser();
                this.router.navigate(['/allCertificates']);
              }}});
        }

      },


    })
  }

  login() {
    if(!this.loginForm.valid) {this.hasError = true; return;}
    else this.hasError = false;
    const response = grecaptcha.getResponse();
    console.log(response);
        if (response.length === 0) {
          this.hasError = true;
          this.errMsg = "Recaptcha not verified. Please try again!"
          return;
        }

    const loginInfo : LoginCredentials = {
      email: this.loginForm.value.email || "",
      password:this.loginForm.value.password || "",
      recaptchaResponse : response
    }
    this.authenticationService.login(loginInfo).subscribe({

      next: (result) => {
        console.log(result)
        this.verification = true;
      },
      error : (error) =>{
        if(error instanceof HttpErrorResponse){
          this.hasError = true;
          if (error.error.message === "Credentials expired, reset your password to continue")
            this.errMsg = "Credentials expired, reset your password to continue"
          else
          this.errMsg = "Username or password are incorrect. Both fields must be at least 4 characters long!"
          console.log(error)
        }
      }

    });
  }

  submitForm() {
    this.authenticationService.confirmLogin(this.verificationCode).subscribe({
      next: (result) => {
        console.log(result)
        localStorage.setItem('user', JSON.stringify(result["accessToken"]));
        localStorage.setItem('refreshToken', JSON.stringify(result["refreshToken"]));
        this.authenticationService.setUser();
        this.router.navigate(['/allCertificates']);

      },
      error: (error) => {
        if(error instanceof HttpErrorResponse){
          this.hasError = true;
          this.errMsg = "Username or password are incorrect. Both fields must be at least 4 characters long!"
          console.log(error)
        }
      }
    })

  }

  sendEmailReset() {
    this.router.navigate(['/resetPassword']);
  }


}
