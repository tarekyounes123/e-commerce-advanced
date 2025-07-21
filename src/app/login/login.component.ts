import { Component, forwardRef, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoginComponent),
      multi: true
    }
  ]
})
export class LoginComponent implements ControlValueAccessor {
  username = signal('');
  password = signal('');
  loginError = signal<string | null>(null);
  isDisabled = signal(false);

  // For ControlValueAccessor
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private router: Router) {
    effect(() => {
      this.onChange({
        username: this.username(),
        password: this.password()
      });
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.username.set(value.username || '');
      this.password.set(value.password || '');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  login() {
    this.onTouched();

    if (this.username().trim() === '' || this.password().trim() === '') {
      this.loginError.set("Please fill in all fields.");
      this.onChange(null);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const foundUser = users.find((user: any) =>
      user.username === this.username() && user.password === this.password()
    );

    if (foundUser) {
      this.loginError.set(null);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      this.onChange({ username: this.username(), password: this.password() });
      this.router.navigate(['/product_list']);
    } else {
      this.loginError.set('Invalid username or password.');
      this.onChange(null);
    }
  }

  get isLoginEnabled(): boolean {
    return !this.isDisabled() && this.username().trim() !== '' && this.password().trim() !== '';
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
