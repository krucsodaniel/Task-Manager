import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/user-service.service';
import { WebRequestService } from 'src/app/web-request.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  registrationForm?: FormGroup;

  registered: Boolean = false;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      nickName: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

  onSubmit() {
    let formValue = this.registrationForm?.value;
    let email = formValue.email;
    let password = formValue.password;
    let nickName = formValue.nickName;
    this.userService
      .createUser(email, password, nickName)
      .subscribe((user: any) => {
        this.registered = true;
      });
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
