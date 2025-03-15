// product-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { Categorie } from '../../models/categorie.model';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,

    MatTooltipModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = [
    'code',
    'designation',
    'prix',
    'quantite',
    'dateAchat',
    'categorie',
    'actions',
  ];
  filterForm: FormGroup;
  categories: Categorie[] = []; // Updated to use the correct model
  libelle: any;

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.filterForm = this.fb.group({
      code: [''],
      designation: [''],
      prixMin: [''],
      prixMax: [''],
      quantiteMin: [''],
      quantiteMax: [''],
      dateAchat: [''],
      categorie: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories(); // Fetch categories when the component initializes
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        console.log('Fetched categories:', data);
        this.categories = data; // Assign the categories
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
      complete: () => {
        console.log('Category fetching complete.');
      },
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      },
      complete: () => {
        console.log('Product deletion complete.');
      },
    });
  }

  editProduct(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  applyFilter(): void {
    const filterCriteria = this.filterForm.value;
    this.productService.filterProducts(filterCriteria).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error filtering products:', error);
      }
    );
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.loadProducts();
  }
}
