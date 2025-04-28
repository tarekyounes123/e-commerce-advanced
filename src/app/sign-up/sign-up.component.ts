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
      return; // Exit the function if any field is empty
    }
  
    // Password validation (e.g., password should be at least 6 characters)
    if (this.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return; // Exit the function if password is too short
    }
  
    // Check if username already exists (optional but useful)
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (existingUser.username === this.username) {
      alert('This username is already taken.');
      return; // Exit the function if username is already taken
    }
  
    // Store the new user data
    localStorage.setItem('user', JSON.stringify({ username: this.username, fullname: this.fullname, password: this.password }));
  
    alert('Signup successful!');
    this.router.navigate(['/login']); // Redirect to login page
  }
  
}
