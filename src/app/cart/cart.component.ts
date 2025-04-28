import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor() {
    // Load cart from localStorage on initialization
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  }

  ngOnInit() {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      // Redirect user to login page if not logged in
      window.location.href = '/login'; // <<< simple page redirect
    }
  }

  removeFromCart(index: number) {
    // Remove the item from the cart
    this.cartItems.splice(index, 1);
    
    // Update localStorage with the modified cart
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  get totalAmount() {
    // Calculate total amount for all items in the cart
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  goBack() {
    // Go back to the previous page
    window.history.back();
  }
}
