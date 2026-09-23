import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CertificateService} from "../../services/certificate/certificate.service";
import {CertificateInfo} from "../../../models/Certificate";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-certificates-view',
  templateUrl: './certificates-view.component.html',
  styleUrls: ['./certificates-view.component.css']
})
export class CertificatesViewComponent implements OnInit{
  certificates: any;
  urlSegment : any;
  @Input() own: boolean = false;
  rejectionReason: any;
  certificateForRevoking : any;
  showRevokingForm: boolean = false;

  constructor(private certificateService: CertificateService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      this.own = urlSegments.join('/') === 'myCertificates';
    });
    if (!this.own)
    this.certificateService.getAllCertificates().subscribe( {
      next: (result) => {
        console.log("RESULT: ", result);
        this.certificates = result;
      },
      error: (error) => {
        console.log(error);
      }
    })
    else {
      this.certificateService.getOwnCertificates().subscribe( {
        next: (result) => {
          this.certificates = result;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }


  }

  downloadCertificate(certificateInfo : CertificateInfo) {
    this.certificateService.downloadCertificate(certificateInfo.serialNumber).subscribe(response => {
      console.log("response: ",response);
      const file = new Blob([response], { type: 'application/octet-stream' });
      const downloadURL = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'certificate.crt';

      link.click();
      URL.revokeObjectURL(downloadURL);
    });
  }

  setCertificateForRevoking(item: any) {
    this.certificateForRevoking = item.serialNumber;
    this.showRevokingForm = true;
  }

  revokeCertificate() {
    if (!this.rejectionReason || this.rejectionReason.length < 3) {
      alert("Enter valid reason!")
    }
    this.certificateService.revokeCertificate(this.certificateForRevoking, this.rejectionReason).subscribe({
      next: value => {
        console.log(value);
       alert("Certificate revoked!");
      },
      error: err => {
        if (err instanceof HttpErrorResponse)
          console.log(err);
      }
    })
  }


  downloadPrivateKey(serialNumber : number) {
    this.certificateService.downloadPrivateKey(serialNumber).subscribe(response => {
      console.log("response: ",response);
      const file = new Blob([response], { type: 'application/octet-stream' });
      const downloadURL = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'privateKey.pem';

      link.click();
      URL.revokeObjectURL(downloadURL);
    });
  }


}
