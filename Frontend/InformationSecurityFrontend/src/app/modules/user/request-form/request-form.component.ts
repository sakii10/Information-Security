import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthenticationService} from "../../auth/authentication.service";
import {CertificateRequestIn} from "../../../models/CertificateRequestIn";
import {CertificateService} from "../../services/certificate/certificate.service";
import {HttpErrorResponse} from "@angular/common/http";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";
import {ValidateCertificate} from "../../../models/Certificate";

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {

  certificateForm = this.formBuilder.group({
    serialNumber: [''],
    type: ['', Validators.required],
    organization: ['', Validators.required],
    organizationUnit: ['', Validators.required]
  });

  role = null;
  isRoot = false;


  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
              private certificateService : CertificateService) {
  }

  ngOnInit(): void {
    this.authenticationService.userState$.subscribe((result) => {
      this.role = result;
    });
    this.certificateForm.get('type')?.valueChanges.subscribe(value => {
      this.isRoot = value === 'ROOT';
    })
  }

  onSubmit() {
    console.log(this.certificateForm.value);
    if (!this.certificateForm.valid) {
      alert("Please fill the form!")
      return;
    }
    let requestIn : CertificateRequestIn;
    if (this.isRoot) {
      requestIn = {
        certificateType: this.certificateForm.value.type || "",
        organization: this.certificateForm.value.organization || "",
        organizationUnit: this.certificateForm.value.organizationUnit || ""
      }
    } else {
      requestIn = {
        certificateType: this.certificateForm.value.type || "",
        organization: this.certificateForm.value.organization || "",
        organizationUnit: this.certificateForm.value.organizationUnit || "",
        parentCertificateSerialNumber : parseInt(<string>this.certificateForm.value.serialNumber)
      }
    }
    console.log(requestIn);
        this.certificateService.createCertificateRequest(requestIn).subscribe({
          next: (result: ValidateCertificate) => {
              console.log(result);
              alert("Request created!")
          },
          error: (error) => {
            if (error instanceof HttpErrorResponse) {
              console.log(error)
            }
          }
        })

      }


}
