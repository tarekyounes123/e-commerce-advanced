import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {
  @ViewChild('cartSummaryRef') cartSummaryRef!: ElementRef;

  private storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
  cartItems = signal<any[]>(this.storedCart);

  totalAmount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price, 0)
  );

  constructor() {
    effect(() => {
      // Sync changes with localStorage
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    });
  }

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.update((items) => {
      const updated = [...items];
      updated.splice(index, 1);
      return updated;
    });
  }

  goBack(): void {
    window.history.back();
  }
}
