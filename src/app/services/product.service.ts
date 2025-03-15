// product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Categorie } from '../models/categorie.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3333/produits/';
  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Fetch a single product by ID
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}`);
  }

  // Delete a product by  ID
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  // Create a new product
  createProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Convert dateAchat to the correct format (YYYY-MM-DD)
    if (product.dateAchat) {
      const date = new Date(product.dateAchat);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      product.dateAchat = `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD'
    }

    return this.http.post<Product>(`${this.apiUrl}add`, product, { headers });
  }

  // Update an existing product
  updateProduct(id: number, product: Product): Observable<Product> {
    console.log(product);
    if (product.dateAchat) {
      const date = new Date(product.dateAchat);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      product.dateAchat = `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD'
    }
    return this.http.put<Product>(`${this.apiUrl}update`, product);
  }

  // Fetch all categories
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}categories`);
  }

  // product.service.ts

  // Add a new category
  addCategory(category: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiUrl}categories/add`, category);
  }

  // Update product category
  updateProductCategory(
    produitId: number,
    categoryId: number
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}update-category/${produitId}`,
      categoryId
    );
  }

  // Filter products based on criteria
  // filterProducts(criteria: any): Observable<Product[]> {
  //   let params = new HttpParams();
  //   for (const key in criteria) {
  //     if (criteria[key]) {
  //       params = params.append(key, criteria[key]);
  //     }
  //   }
  //   return this.http.get<Product[]>(`${this.apiUrl}filter`, { params });
  // }
  filterProducts(criteria: any): Observable<Product[]> {
    let params = new HttpParams();

    for (const key in criteria) {
      if (criteria[key]) {
        let value = criteria[key];

        if (key === 'dateAchat') {
          // Ensure date is formatted as 'YYYY-MM-DD' string without time zone issues
          const date = new Date(value);
          const formattedDate = date.toLocaleDateString('en-CA'); // 'en-CA' gives 'YYYY-MM-DD' format
          value = formattedDate;
        }

        params = params.append(key, value.toString()); // Ensure it's a string
      }
    }

    return this.http.get<Product[]>(`${this.apiUrl}filter`, { params });
  }
}
