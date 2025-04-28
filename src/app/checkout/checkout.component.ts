import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',

})
export class CheckoutComponent {
  cartItems: any[] = [];

  constructor() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  get totalAmount() {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  confirmOrder() {
    if (this.cartItems.length > 0) {
      alert('Order Confirmed!');
      localStorage.removeItem('cart');
      this.cartItems = [];
    } else {
      alert('Cart is empty');
    }
  }
  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      // Redirect user to login page
      window.location.href = '/login'; // <<< simple page redirect
    }
  }
    goBack() {
      window.history.back();  // This will take the user to the previous page
    }
}
