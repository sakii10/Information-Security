import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../auth/authentication.service";
import {Router} from "@angular/router";
import {TokenDecoderService} from "../../auth/token/token-decoder.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role = null;
  decodedToken = null;


  ngOnInit(): void {

    this.authenticationService.userState$.subscribe((result) => {
      this.role = result;
    });
  }

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private tokenService: TokenDecoderService) {
  }


  logout(): void{
    this.authenticationService.logout().subscribe({
      next: (result) => {
        localStorage.removeItem('user');
        this.authenticationService.setUser();
        this.role = null;
        this.router.navigate(['/home']);

      },
      error: (error) => {console.log(error);},
    });
  }
}
