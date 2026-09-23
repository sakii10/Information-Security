import {Component, OnInit} from '@angular/core';
import {CertificateService} from "../../services/certificate/certificate.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ApproveDTO, RejectionDTO} from "../../../models/Certificate";
import {RequestInfoDTO} from "../../../models/Request";



@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit{

  certificateList: any;
  showRejectionForm = false;
  rejectionReason = '';
  certificateForRejection : any;

  constructor(private certificateService : CertificateService) {
  }

  ngOnInit() {
    this.certificateService.getPendingCertificates().subscribe({
      next: value => {
        console.log(value);
        this.certificateList = value;
      },
      error: err => {
        if (err instanceof HttpErrorResponse)
          console.log(err);
      }
    })
  }

  approveCertificate(item: RequestInfoDTO): void {
    const dto : ApproveDTO = {
      id: item.id
    }
    this.certificateService.approveCertificate(dto).subscribe({
      next: value => {
        console.log(value);
        alert("Certificate approved")
      },
      error: err => {
        if (err instanceof HttpErrorResponse)
          console.log(err);
      }
    })
  }

  rejectCertificate(item: RequestInfoDTO): void {
    this.certificateForRejection = item;
    this.showRejectionForm = true;
  }

  sendRejection(): void {
    if (this.rejectionReason.length < 3 ) {
      alert("Enter valid reason")
      return;
    }
    this.showRejectionForm = false;
    const dto : RejectionDTO =  {
      id : this.certificateForRejection.id,
      reason : this.rejectionReason
    }
    this.certificateService.rejectCertificate(dto).subscribe({
      next: value => {
        console.log(value);
        alert("Certificate rejected!")
      },
      error: err => {
        if (err instanceof HttpErrorResponse)
          console.log(err);
      }
    })
  }
}
