import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

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
  editingProduct: boolean = false; // To know if editing
  cart: Product[] = [];
  username: string = ''; // Variable to store the logged-in user's name
  userRole: string = 'user'; // Store the user's role (default is 'user')

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      // Redirect user to login page if not logged in
      this.router.navigate(['/login']);
    } else {
      // Get the user from localStorage and extract their role
      const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
      this.username = user.username || 'Guest';
      this.userRole = user.role || 'user'; // Default to 'user' if no role is assigned
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
    console.log('Adding to cart:', product);

    // Check if the cart already exists in localStorage, if not, initialize it
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Add product to the cart
    cart.push(product);

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.name} added to cart!`);
  }

  editProduct(product: Product) {
    this.editingProduct = true;
    this.newProduct = { ...product };
  }

  removeProduct(productId: number) {
    this.productService.removeProduct(productId);
    console.log('Product removed:', productId);
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
    localStorage.removeItem('isLoggedIn'); // Remove login state
    alert('You have been logged out.');
    this.router.navigate(['/login']); // Redirect to login page
  }

  viewcart() {
    this.router.navigate(['/cart']);
  }
}
