# Information Security Project

University project developed for the **Information Security** course.

## About the Project

The project is a monolithic web application designed for **managing digital certificates**. Its main purpose is to simulate a certificate management system in which users can request, issue, validate, download and revoke certificates while maintaining a hierarchy of **root, intermediate and end certificates**.

The application also focuses on applying practical information-security concepts to authentication, authorization, data protection and secure communication.

Users can register and authenticate, manage their accounts, view and validate certificates, submit certificate requests and manage certificates they own. Administrators additionally manage the application's root certificates and requests related to them.

When a certificate is revoked, certificates issued below it in the certificate chain are also revoked.

## Main Features

* User registration and account verification
* Login and JWT-based authentication
* Role-based authorization
* Password recovery and password rotation
* Password history and prevention of password reuse
* Two-factor authentication
* OAuth authentication
* Certificate overview and download
* Certificate validation by identifier or uploaded file
* Certificate issuance and signing
* Certificate request approval/rejection
* Certificate revocation and certificate-chain handling
* HTTPS communication
* CAPTCHA protection
* Security-related application logging
* Input and file validation
* Protection against common attacks such as injection, XSS and Path Traversal

## Certificate Hierarchy

The application works with three types of certificates:

```text
Root Certificate
       │
       └── Intermediate Certificate
                │
                └── End Certificate
```

Certificates can be issued and signed by certificates higher in the hierarchy. Requests are sent to the owner of the certificate that will be used for signing, while certain requests can be automatically approved depending on the requester and certificate hierarchy.

## User Roles

### Authenticated User

An authenticated user can:

* view all certificates
* download certificates, including expired and revoked ones
* validate certificates
* request intermediate or end certificates
* view submitted certificate requests
* approve or reject requests for certificates based on certificates they own
* revoke certificates they own

### Administrator

The administrator has all authenticated-user permissions and is additionally responsible for:

* managing root certificates
* approving certificate requests based on application root certificates
* managing administrator-level certificate requests

## Technologies

### Backend

* Java 19
* Spring Boot 3

### Frontend

* Angular

### Database & Storage

* H2 Database
* Local file storage for certificates

## Running the Project

### Backend

Navigate to the backend directory:

```bash
cd Backend
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
./mvnw spring-boot:run
```

### Frontend

Navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

> **Note:** Environment-specific files such as local certificates and external-service credentials are not included in the repository and may need to be configured separately before running the application.

## Original Team Repository

The project was originally developed in a team repository:

https://github.com/InformationalSecurityTeam11
