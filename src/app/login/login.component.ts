import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoginComponent),
      multi: true
    }
  ]
})
export class LoginComponent implements ControlValueAccessor {
  username = '';
  password = '';

  // For ControlValueAccessor
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  loginError: string | null = null;

  constructor(private router: Router) {}

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
      this.username = value.username || '';
      this.password = value.password || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Custom login method
  login() {
    this.onTouched();

    if (this.username.trim() === '' || this.password.trim() === '') {
      this.loginError = "Please fill in all fields.";
      this.onChange(null);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const foundUser = users.find((user: any) =>
      user.username === this.username && user.password === this.password
    );

    if (foundUser) {
      this.loginError = null;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      this.onChange({ username: this.username, password: this.password });
      this.router.navigate(['/product_list']);
    } else {
      this.loginError = 'Invalid username or password.';
      this.onChange(null);
    }
  }

  // Used to disable the button when inputs are empty or disabled
  get isLoginEnabled(): boolean {
    return !this.isDisabled && this.username.trim() !== '' && this.password.trim() !== '';
  }

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/product_list']);
    }
  }
    goToSignup() {
    this.router.navigate(['/signup']);
  }
}
