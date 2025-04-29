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

  constructor(private router: Router) {}

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]'); // Get the users array

    if (this.username === '' || this.password === '') {
      alert("Please fill in the inputs");
      return;
    }

    // Find user matching username and password
    const foundUser = users.find((user: any) => 
      user.username === this.username && user.password === this.password
    );

    if (foundUser) {
      alert('Login successful!');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser)); // Optional: store the logged in user
      this.router.navigate(['/product_list']);
    } else {
      alert('Invalid credentials');
    }
  }

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      // If already logged in, go directly to product_list
      this.router.navigate(['/product_list']);
    }
    // Otherwise stay on login page
  }
}
