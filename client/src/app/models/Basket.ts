// Import the Product type/class used to construct basket items
import { Product } from "./Product";

// Define the structure of a Basket object
export type Basket = {
    basketId: string      // Unique identifier for the basket (could be a user/session ID)
    items: Item[]         // Array of items currently in the basket
}

// Define an Item class representing a single item in the basket
export class Item {
    // Constructor initializes an Item using a Product and a specified quantity
    constructor(product: Product, quantity: number) {
        // Assign relevant product properties to the basket item
        this.productId = product.id;
        this.name = product.name;
        this.price = product.price;
        this.pictureUrl = product.pictureUrl;
        this.brand = product.brand;
        this.type = product.type;

        // Set the quantity of the item added to the basket
        this.quantity = quantity;
    }

    // Properties that describe the item
    productId: number       // Unique ID of the product
    name: string            // Product name
    price: number           // Unit price of the product
    pictureUrl: string      // URL of the product image
    brand: string           // Product brand
    type: string            // Product type or category
    quantity: number        // Number of units added to the basket
}
