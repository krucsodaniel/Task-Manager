import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStatusService } from 'src/app/login-status.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private loginStatusService: LoginStatusService
  ) {}

  isLoggedIn = false;

  ngOnInit(): void {
    this.loginStatusService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  isScrolled = false;
  isTransparent = true;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollTop = event.target.documentElement.scrollTop;

    if (scrollTop > 50) {
      this.isScrolled = true;
      this.isTransparent = false;
    } else {
      this.isScrolled = false;
      this.isTransparent = true;
    }
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  goToDashboard() {
    this.router.navigate(['lists']);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('ownerId');
    localStorage.removeItem('nickName');
    this.loginStatusService.setLoginStatus(false);
    this.router.navigate(['/login']);
  }
}
