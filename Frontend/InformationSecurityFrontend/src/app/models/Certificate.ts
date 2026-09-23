import {User} from "./User";

export interface CertificateInfo {
  ownerInfo : User,
  startDate : string,
  expireDate : string,
  type : string,
  serialNumber : number,
  revokingReason ?: string

}

export interface ValidateCertificate {
  valid: boolean,
  startDate : string,
  expiredDate :string
}

export interface ApproveDTO {
  id:number
}

export interface RejectionDTO {
  id:number,
  reason:string
}
