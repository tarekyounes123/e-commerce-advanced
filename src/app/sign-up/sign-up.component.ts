import { Component, effect, signal, computed, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SignUpComponent,
      multi: true
    }
  ]
})
export class SignUpComponent implements ControlValueAccessor {
  fullname = signal('');
  username = signal('');
  password = signal('');
  role = signal('user');

  isFormValid = computed(() =>
    this.fullname().trim().length > 0 &&
    this.username().trim().length > 0 &&
    this.password().length >= 6 &&
    (this.role() === 'user' || this.role() === 'admin')
  );

  onChange = (_: any) => {};
  onTouched = () => {};

  @ViewChild('usernameInput', { static: true }) usernameInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) {
    effect(() => {
      this.onChange({
        fullname: this.fullname(),
        username: this.username(),
        password: this.password(),
        role: this.role()
      });
    });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.fullname.set(obj.fullname || '');
      this.username.set(obj.username || '');
      this.password.set(obj.password || '');
      this.role.set(obj.role || 'user');
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (this.usernameInput) {
      this.usernameInput.nativeElement.disabled = isDisabled;
    }
  }

  signup() {
    if (!this.isFormValid()) {
      alert('Please fill all fields correctly. Password must be at least 6 characters.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find((u: any) => u.username === this.username())) {
      alert('Username is already taken.');
      return;
    }

    users.push({
      fullname: this.fullname(),
      username: this.username(),
      password: this.password(),
      role: this.role()
    });

    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful!');
    this.router.navigate(['/login']);
  }
}
