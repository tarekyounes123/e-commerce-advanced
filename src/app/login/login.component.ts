import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {} // Inject Router service

  login() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (this.username === '' || this.password === '') {
      alert("Please fill in the inputs");
    } else {
      if (user.username === this.username && user.password === this.password) {
        alert('Login successful!');
        this.router.navigate(['/product_list']); // Navigate to product_list page
        localStorage.setItem('isLoggedIn', 'true');

      } else {
        alert('Invalid credentials');
      }
    }
  }
  ngOnInit() {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      // Redirect user to login page if not logged in
      this.router.navigate(['/login']);
    } else {
     this.router.navigate(['/product_list']);
    }
  }
}
