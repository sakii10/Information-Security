import {User} from "./User";

export interface RequestInfoDTO {
  id : number,
  parentCertificateSerialNumber : number,
  creationTime : string,
  requestState : string,
  acceptanceTime : string,
  owner : User,
  certificateType : string,
  rejection : string,
  organization : string,
  organizationUnit : string
}

// id : number,
