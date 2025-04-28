import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');

  constructor() { }

  // Add a new product
  addProduct(product: Product) {
    this.products.push(product);
    this.saveProducts();
  }

  // Remove a product by ID
  removeProduct(productId: number) {
    this.products = this.products.filter(product => product.id !== productId);
    this.saveProducts();
  }

  // Update an existing product
  updateProduct(updatedProduct: Product) {
    const index = this.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.saveProducts();
    }
  }

  filterProducts(searchTerm: string) {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Save products to localStorage
  private saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}
