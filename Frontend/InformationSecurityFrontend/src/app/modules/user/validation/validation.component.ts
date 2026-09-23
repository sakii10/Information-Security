import { Component } from '@angular/core';
import {CertificateService} from "../../services/certificate/certificate.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent {
  verificationMethod: string = 'serialNumber';
  serialNumber: string = '';
  certificateFile: File | null = null;
  validCertificate: boolean = false;
  invalidCertificate : boolean = false;

  constructor(private certificateService : CertificateService) {
  }

  verifyBySerialNumber() {
    this.certificateService.validateCertificate(parseInt(this.serialNumber)).subscribe({
      next: (result) => {
        this.validCertificate = result.valid;
        if (!result.valid) {
          this.invalidCertificate = true;
        }
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          console.log(error)
        }
      }
    })

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file.type !== 'application/x-x509-ca-cert') {
      alert('Invalid file format. Please select a certificate file.');
      event.target.value = '';
      this.certificateFile = null;
      return;
    }
    const fileSizeInBytes = file.size;
    const maxSizeInBytes = 8 * 1024; // 8 KB

    if (fileSizeInBytes > maxSizeInBytes) {
      alert('File size exceeds the maximum limit of 8 KB.');
      event.target.value = '';
      this.certificateFile = null;
      return;
    }

    this.certificateFile = file;

  }

  verifyByCertificateFile() {
    if (this.certificateFile) {
      const formData = new FormData();
      formData.append('file', this.certificateFile);
      this.certificateService.verifyCertificate(formData).subscribe({
        next: (response) => {
          console.log("response:", response)
          if (response ===  'Certificate is valid') {
            this.invalidCertificate = false;
            this.validCertificate = true;
          }
          else if (response === 'Certificate is invalid') {
            this.validCertificate = false;
            this.invalidCertificate = true;
          }
        }
        ,
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            console.log(error);
          }
        }
      });
    }
  }

  changeValues() {
    this.invalidCertificate = false;
    this.validCertificate = false;
  }
}
