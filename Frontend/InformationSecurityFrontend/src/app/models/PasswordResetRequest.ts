export interface PasswordResetRequest {
  passwordResetMethod : string,
  contact : string;
}

export interface PasswordResetDTO {
  newPassword : string,
  newPasswordConfirmation : string,

}
