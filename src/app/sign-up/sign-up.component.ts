import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // <-- Make sure to import Router

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  username = '';
  password = '';
  fullname='';

  constructor(private router: Router) {} // <-- inject Router here

  signup() {
    // Basic field validation
    if (!this.username || !this.fullname || !this.password) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Password validation
    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
  
    // Get existing users array from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
  
    // Check if username already exists
    const existingUser = users.find((user: any) => user.username === this.username);
    if (existingUser) {
      alert('This username is already taken.');
      return;
    }
  
    // Add new user
    users.push({
      username: this.username,
      fullname: this.fullname,
      password: this.password
    });
  
    // Save updated users array back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
  
    alert('Signup successful!');
    this.router.navigate(['/login']);
  }
  
  
}
