import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model'; // Import Categorie
import { Categorie } from '../../models/categorie.model';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select'; // Add this for dropdown

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule, // Add this
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categories: Categorie[] = []; // Add this for category dropdown

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      designation: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      dateAchat: ['', Validators.required],
      enPromotion: [false],
      categorie: [null, Validators.required], // Change to object
    });
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCategories(); // Load categories for dropdown

    if (this.productId) {
      this.isEditMode = true;
      this.productService.getProduct(this.productId).subscribe((product) => {
        this.productForm.patchValue(product);
      });
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe(
          () => {
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Error updating product:', error);
          }
        );
      } else {
        this.productService.createProduct(product).subscribe(
          () => {
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Error creating product:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}