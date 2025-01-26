
export interface Product {
  id?: number; // Optional for new products
  code: string;
  designation: string;
  prix: number;
  quantite: number;
  dateAchat: string;
  enPromotion: boolean;
  categorie: Stock; // Add category field
}

export interface Stock {
  id?: number;
  code: string;
  libelle: string;
}

export interface Stock {
  id?: number;
  code: string;
  libelle: string;
}
