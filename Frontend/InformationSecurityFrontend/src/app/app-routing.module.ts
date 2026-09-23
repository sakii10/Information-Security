import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegistrationComponent} from "./modules/auth/registration/registration.component";
import {LoginComponent} from "./modules/auth/login/login.component";
import {RequestFormComponent} from "./modules/user/request-form/request-form.component";
import {CertificatesViewComponent} from "./modules/user/certificates-view/certificates-view.component";
import {ValidationComponent} from "./modules/user/validation/validation.component";
import {PasswordRecoveryComponent} from "./modules/auth/password-recovery/password-recovery.component";
import {RequestsTableComponent} from "./modules/user/requests-table/requests-table.component";
import {PendingRequestsComponent} from "./modules/user/pending-requests/pending-requests.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'registration', component: RegistrationComponent },
  {path: 'newCertificate', component: RequestFormComponent},
  {path: 'allCertificates', component: CertificatesViewComponent},
  {path: 'myCertificates', component:CertificatesViewComponent},
  {path: 'validation', component:ValidationComponent},
  {path: 'resetPassword', component:PasswordRecoveryComponent},
  {path: 'requests', component:RequestsTableComponent},
  {path: 'requestsForMe', component:PendingRequestsComponent},
  {path: 'home', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
