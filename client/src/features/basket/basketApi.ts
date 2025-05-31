// Import createApi from RTK Query
import { createApi } from "@reduxjs/toolkit/query/react";
// Custom base query handler that wraps fetch and handles errors globally
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
// Type definitions for Product and Basket entities
import { Product } from "../../app/models/Product";
import { Basket, Item } from "../../app/models/Basket";

// Type guard function: checks if the object is a Basket Item (has quantity)
function isBasketItem(product: Product | Item): product is Item {
    return (product as Item).quantity !== undefined;
}

// Define a new API slice for basket-related operations
export const basketApi = createApi({
    reducerPath: "basketApi", // state slice name
    baseQuery: baseQueryWithErrorHandling, // customized fetch behavior
    tagTypes: ["Basket"], // tag used for cache invalidation
    endpoints: (builder) => ({
        // GET /basket - fetch the current basket
        fetchBasket: builder.query<Basket, void>({
            query: () => "basket", // API path
            providesTags: ["Basket"] // used for cache invalidation
        }),
        // POST /basket - add an item to the basket
        addBasketItem: builder.mutation<Basket, { product: Product | Item, quantity: number }>({
            query: ({ product, quantity }) => {
                // Determine product ID based on input type
                const productId = isBasketItem(product) ? product.productId : product.id;
                return {
                    url: `basket?productId=${productId}&quantity=${quantity}`,
                    method: "POST"
                };
            },
            // Optimistic update for adding an item to the basket
            onQueryStarted: async ({ product, quantity }, { dispatch, queryFulfilled }) => {
                let isNewBasket = false;
                // Optimistically update basket in cache before server response
                const patchResult = dispatch(
                    basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
                        // Type guard
                        const productId = isBasketItem(product) ? product.productId : product.id;
                        // Check if this is the first time basket is created
                        // we have this check to address the issue if a new user is updating the basket first time with no cookie
                        if (!draft?.basketId) isNewBasket = true;
                        // If it's not a new basket, update the item quantity or add new item
                        if (!isNewBasket) {
                            const existingItem = draft.items.find(item => item.productId === productId);
                            if (existingItem) {
                                existingItem.quantity += quantity;
                            } 
                            else {
                                // Add new item to basket
                                draft.items.push(
                                    isBasketItem(product)
                                        ? product
                                        : { ...product, productId: product.id, quantity } // new Item(product, quantity)); -> this is a class and this will throw "store cannot have non-serializable" warning, means only put seriazalble items in store
                                );
                            }
                        }
                    })
                );
                try {
                    // Wait for server confirmation
                    await queryFulfilled;
                    // If a new basket was created, invalidate the cache so it's refetched
                    if (isNewBasket) dispatch(basketApi.util.invalidateTags(["Basket"]));
                } catch (error) {
                    // Revert optimistic update on failure
                    console.log(error);
                    patchResult.undo();
                }
            }
        }),
        // DELETE /basket - remove an item from the basket
        removeBasketItem: builder.mutation<void, { productId: number, quantity: number }>({
            query: ({ productId, quantity }) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: "DELETE"
            }),
            // Optimistic update for removing item(s) from the basket
            onQueryStarted: async ({ productId, quantity }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData("fetchBasket", undefined, (draft) => {
                        const itemIndex = draft.items.findIndex(item => item.productId === productId);
                        if (itemIndex >= 0) {
                            draft.items[itemIndex].quantity -= quantity;

                            // Remove item from list if quantity drops to zero or below
                            if (draft.items[itemIndex].quantity <= 0) {
                                draft.items.splice(itemIndex, 1);
                            }
                        }
                    })
                );
                try {
                    // Wait for server confirmation
                    await queryFulfilled;
                } catch (error) {
                    // Undo changes on failure
                    console.log(error);
                    patchResult.undo();
                }
            }
        })

    })
});

// Auto-generated React hooks for using the API in components
export const {
    useFetchBasketQuery,
    useAddBasketItemMutation,
    useRemoveBasketItemMutation
} = basketApi;
