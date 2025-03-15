import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model'; // Import Categorie
import { Categorie } from '../../models/categorie.model';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select'; // Add this for dropdown
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  categories: Categorie[] = []; // Ensure this uses the updated Categorie model
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categoryName: string = ''; // New category name
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      designation: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      quantite: [0, [Validators.required, Validators.min(0)]],
      dateAchat: ['', Validators.required],
      enPromotion: [false],
      categorie: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCategories();

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
        this.categories = data; // Now this holds the category array with 'id' and 'libelle'
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  onAddCategory(): void {
    if (this.categoryName.trim()) {
      const newCategory: Categorie = { id: null, libelle: this.categoryName };

      this.productService.addCategory(newCategory).subscribe({
        next: (category) => {
          this.categories.push(category); // Update dropdown list
          this.categoryName = ''; // Clear input field
        },
        error: (error) => {
          console.error('Error adding category:', error);
          alert('Failed to add category.');
        },
      });
    } else {
      alert('Category name cannot be empty.');
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;

      if (this.isEditMode && this.productId) {
        // Ensure the id is included in the product object
        product.id = this.productId; // You can set it explicitly if not included

        // Update existing product
        this.productService.updateProduct(this.productId, product).subscribe({
          next: () => {
            this.productForm.reset(); // Reset the form after success
            this.router.navigate(['/']); // Redirect on success
          },
          error: (error) => {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again!');
          },
        });
      } else {
        // Create new product
        this.productService.createProduct(product).subscribe({
          next: () => {
            this.productForm.reset(); // Reset the form after success
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error creating product:', error);
            alert('Error creating product. Please try again!');
          },
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
