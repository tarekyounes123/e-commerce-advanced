import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  // Use signal for reactive cart items
  private cartItemsSignal = signal<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));

  // Expose readonly cartItems for template
  get cartItems() {
    return this.cartItemsSignal();
  }

  // Signal for disabling confirm button during confirmation
  isConfirmingSignal = signal(false);

  constructor() {}

  ngOnInit() {
    // Simple login check
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  }

  // Total amount as a computed function
  totalAmount() {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  confirmOrder() {
    if (this.cartItems.length > 0) {
      this.isConfirmingSignal.set(true);
      setTimeout(() => {
        alert('Order Confirmed!');
        localStorage.removeItem('cart');
        this.cartItemsSignal.set([]);
        this.isConfirmingSignal.set(false);
      }, 1000); // Simulate async confirmation delay
    } else {
      alert('Cart is empty');
    }
  }

  goBack() {
    window.history.back();
  }
}
