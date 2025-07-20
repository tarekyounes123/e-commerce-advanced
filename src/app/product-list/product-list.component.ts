import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, AfterViewInit {
  searchTerm = signal('');
  username = signal('Guest');
  userRole = signal<'user' | 'admin'>('user');
  editingProduct = signal(false);

  newProduct = signal<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0,
  });

  products = signal<Product[]>([]); // نحتفظ بقائمة المنتجات هنا

  @ViewChild('nameInput') nameInput!: ElementRef;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    this.username.set(user.username || 'Guest');
    this.userRole.set(user.role || 'user');

    this.loadProducts(); // تحميل المنتجات عند بداية المكون
  }

  ngAfterViewInit(): void {
    if (this.editingProduct()) {
      setTimeout(() => {
        this.nameInput?.nativeElement.focus();
      }, 0);
    }
  }

  loadProducts() {
    // هنا نجلب المنتجات من الخدمة ونحدث الـ signal عندنا
    this.products.set(this.productService.filterProducts(''));
  }

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products()
      .filter(p => p.name.toLowerCase().includes(term));
  });

  updateProductName(value: string) {
    this.newProduct.update(p => ({ ...p, name: value }));
  }

  updateProductDescription(value: string) {
    this.newProduct.update(p => ({ ...p, description: value }));
  }

  updateProductPrice(value: string) {
    const price = parseFloat(value);
    this.newProduct.update(p => ({
      ...p,
      price: isNaN(price) ? 0 : price,
    }));
  }

  saveProduct(): void {
    const product = this.newProduct();
    if (!product.name || !product.description || product.price <= 0) {
      alert('Please fill in all fields');
      return;
    }

    if (this.editingProduct()) {
      this.productService.updateProduct(product);
      alert('Product updated successfully!');
    } else {
      this.productService.addProduct({ ...product, id: Date.now() });
      alert('Product added successfully!');
    }

    this.resetForm();
    this.loadProducts(); // تحديث المنتجات في الـ signal => يظهر التحديث في الشاشة
  }

  resetForm(): void {
    this.newProduct.set({ id: 0, name: '', description: '', price: 0 });
    this.editingProduct.set(false);
  }

  addToCart(product: Product): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  }

  editProduct(product: Product): void {
    this.editingProduct.set(true);
    this.newProduct.set({ ...product });

    setTimeout(() => {
      this.nameInput?.nativeElement.focus();
    }, 0);
  }

  removeProduct(productId: number): void {
    this.productService.removeProduct(productId);
    alert('Product removed!');
    this.loadProducts(); // تحديث المنتجات بعد الحذف
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    alert('You have been logged out.');
    this.router.navigate(['/login']);
  }

  viewcart(): void {
    this.router.navigate(['/cart']);
  }
}
