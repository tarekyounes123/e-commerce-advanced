import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  username = '';
  password = '';
  fullname = '';
  role = 'user'; // Default role

  constructor(private router: Router) {}

  signup() {
    // Basic field validation
    if (!this.username || !this.fullname || !this.password || !this.role) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const existingUser = users.find((user: any) => user.username === this.username);
    if (existingUser) {
      alert('This username is already taken.');
      return;
    }

    users.push({
      username: this.username,
      fullname: this.fullname,
      password: this.password,
      role: this.role
    });

    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful!');
    this.router.navigate(['/login']);
  }
}
