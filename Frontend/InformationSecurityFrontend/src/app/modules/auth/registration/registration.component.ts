import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../../models/User";
import {UserService} from "../../services/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";

declare var grecaptcha: any;


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registerForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(13)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatedPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    activationMethod: new FormControl("Email")// početna vrednost Email
  });
  hasError : boolean = false;
  verification: boolean = false;
  verificationCode: any;

  constructor(private router: Router, private userService : UserService){

  }
  get password() {return this.registerForm.get('password');}
  get repeatedPassword() {return this.registerForm.get('repeatedPassword');}


  register() : void {

    if (!this.registerForm.valid) {
      alert("Please fill the form")
      return

    }

    if (this.password?.value !== this.repeatedPassword?.value) {
      this.hasError = true;
      alert("Passwords don't match")
      return;
    }

    if (this.registerForm.valid) {
      const response = grecaptcha.getResponse();
      console.log(response);
        if (response.length === 0) {
          this.hasError = true;
          alert("Recaptcha not verified")
          return;
        }
      this.hasError = false;
      alert("Successfully registered")
      const user : User =  {
        name : this.registerForm.value.name || "",
        surname : this.registerForm.value.surname || "",
        telephoneNumber: this.registerForm.value.phoneNumber || "",
        email:this.registerForm.value.email || "",
        password: this.registerForm.value.password || "",
        activationMethod: this.registerForm.value.activationMethod?.toUpperCase() || "EMAIL",
        recaptchaResponse : response
      }
      // posalji zahtev za registraciju
      this.userService.registerStandardUser(user).subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (error) => {
          if(error instanceof HttpErrorResponse){
            this.hasError = true;
            console.log(error)
          }
        }
      })
      this.hasError = false;
      this.verification = true;

    }

  }

  submitForm() {

    this.userService.activateAccount(this.verificationCode).subscribe({
      next: (result) => {
        console.log(result)
        alert("Successfully activated!")
        this.verification = false;

      },
      error: (error) => {
        if(error instanceof HttpErrorResponse){
          this.hasError = true;
          console.log(error)
        }
      }
    })
  }
}
