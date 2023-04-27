import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CountdownService } from 'src/app/countdown.service';
import { LoginStatusService } from 'src/app/login-status.service';
import { UserServiceService } from 'src/app/user-service.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  loginForm?: FormGroup;

  errorMessage?: string;
  loggedIn?: boolean = false;

  userNickname?: any;

  countdownDisplay?: any;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router,
    private countdownService: CountdownService,
    private loginStatusService: LoginStatusService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    let formValue = this.loginForm?.value;
    this.userService.login(formValue).subscribe({
      next: (user: any) => {
        localStorage.setItem('accessToken', user.accessToken);
        localStorage.setItem('ownerId', user.ownerId);
        localStorage.setItem('nickName', user.userNickName);
        this.userNickname = localStorage.getItem('nickName');
        this.loggedIn = true;
        this.loginStatusService.setLoginStatus(true);

        const timeoutDuration = 10 * 60 * 1000;
        let countdownDuration = timeoutDuration;
        const countdownInterval = setInterval(() => {
          countdownDuration -= 1000;
          const minutesLeft = Math.floor(countdownDuration / 1000 / 60);
          const secondsLeft = Math.floor((countdownDuration / 1000) % 60);
          this.countdownDisplay = `${minutesLeft}:${
            secondsLeft < 10 ? '0' : ''
          }${secondsLeft}`;
          this.countdownDisplay = `${minutesLeft}:${
            secondsLeft < 10 ? '0' : ''
          }${secondsLeft}`;
          this.countdownService.updateCountdownDisplay(this.countdownDisplay);
        }, 1000);

        setTimeout(() => {
          clearInterval(countdownInterval);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('ownerId');
          localStorage.removeItem('nickName');
          this.loggedIn = false;
          this.router.navigate(['/login']);
        }, timeoutDuration);
      },
      error: (err) => {
        this.errorMessage = err.error;
      },
    });
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
