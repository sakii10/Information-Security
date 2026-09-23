export interface CertificateRequestIn {
  parentCertificateSerialNumber? : number;
  certificateType : string;
  organization : string;
  organizationUnit : string;
}
