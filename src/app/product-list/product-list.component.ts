import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  searchTerm: string = '';
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
  };
  editingProduct = false;
  username: string = '';
  userRole: string = 'user';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
      this.username = user.username || 'Guest';
      this.userRole = user.role || 'user';
    }
  }

  filterProducts() {
    return this.productService.filterProducts(this.searchTerm);
  }

  saveProduct() {
    if (this.newProduct.name && this.newProduct.description && this.newProduct.price) {
      if (this.editingProduct) {
        this.productService.updateProduct(this.newProduct);
        alert('Product updated successfully!');
      } else {
        const newProductWithId = { ...this.newProduct, id: Date.now() };
        this.productService.addProduct(newProductWithId);
        alert('Product added successfully!');
      }
      this.resetForm();
    } else {
      alert('Please fill in all fields');
    }
  }

  addToCart(product: Product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  }

  editProduct(product: Product) {
    this.editingProduct = true;
    this.newProduct = { ...product };
  }

  removeProduct(productId: number) {
    this.productService.removeProduct(productId);
  }

  resetForm() {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
    };
    this.editingProduct = false;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    alert('You have been logged out.');
    this.router.navigate(['/login']);
  }

  viewcart() {
    this.router.navigate(['/cart']);
  }
  openEditModal(product: Product) {
  this.editingProduct = true;
  this.newProduct = { ...product };
}

closeModal() {
  this.editingProduct = false;
  this.resetForm();
}
}
