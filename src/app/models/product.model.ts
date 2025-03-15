import { Categorie } from "./categorie.model";

// src/app/models/product.model.ts
export interface Product {
  enPromotion: any;
  id: number;
  code: string;
  designation: string;
  prix: number;
  quantite: number;
  dateAchat: string; // Or Date if you're using Date objects
  categorie: Categorie | null; // Reference to the Category model
}
