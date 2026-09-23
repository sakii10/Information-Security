import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from "../../services/user/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {PasswordResetDTO} from "../../../models/PasswordResetRequest";
import {Router} from "@angular/router";

@Component({
  selector: 'app-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit{

  showPasswordInputs: boolean = false;
  showEmailInput: boolean = false;
  showPhoneInput: boolean = false;

  constructor(private router:Router, private userService : UserService) { }


  passwordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required])
  })

  sendMethodForm = new FormGroup({
    selectedMethod : new FormControl('', [Validators.required])
  });

  emailForm = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.email])
  });

  phoneForm = new FormGroup({
    phone : new FormControl('', [Validators.required, Validators.min(9)])
  })

  verificationForm = new FormGroup({
    verificationCode : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
    confirmPassword : new FormControl('', [Validators.required])
  })
  showVerificationInput: boolean = false;

  sendEmail() {
    const contact = this.emailForm.get('email')?.value;
    this.userService.requestPasswordReset(contact, 'EMAIL').subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          return;
        }
      }
    })
  }


  private sendPhone() {
    const contact = this.phoneForm.get('phone')?.value;
    this.userService.requestPasswordReset(contact, 'PHONE').subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          return;
        }
      }
    })
  }


  send(selectedMethod: any) {
    if (selectedMethod === 'email') {
      if (!this.emailForm.valid) {
        alert("Enter valid email!")
        return;
      }
      this.sendEmail();
    } else if (selectedMethod === 'phone') {
      if (!this.phoneForm.valid) {
        alert("Enter valid phone!")
        return;
      }
      this.sendPhone();
    }
    this.showVerificationInput = true;
  }

  sendVerificationCode() {
    if (!this.verificationForm.valid) {
      alert("Please fill the form!")
      return;
    }
    const password  = this.verificationForm.get('password')?.value;
    const confirmPasword = this.verificationForm.get('confirmPassword')?.value;
    if (password !== confirmPasword) {
      alert("Password don't match")
      return;
    }
    const resetCode = this.verificationForm.get('verificationCode')?.value;

    const dto : PasswordResetDTO = {
      newPassword : password || "",
      newPasswordConfirmation : confirmPasword || ""
    }
    this.userService.resetPassword(resetCode, dto).subscribe({
      next: value => {
        console.log(value);
        alert("Password successfully reseted")
        this.router.navigate(['/home']);

      },
      error: err => {
        if (err instanceof HttpErrorResponse) {
          if (err.error.message === "New password cannot be previous password") {
            alert("New password cannot be previous password")
          }
        }
      }
    })

  }





  ngOnInit(): void {
  }


}
