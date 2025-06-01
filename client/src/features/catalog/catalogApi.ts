import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Product } from "../../app/models/Product";
import { Pagination } from "../../app/models/Pagination";
import { ProductParams } from "../../app/models/ProductParams";
import { filterEmptyValues } from "../../lib/util";

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<{items: Product[], pagination: Pagination}, ProductParams>({
            query: (productParams) => {
                return {
                    url: "products",
                    params: filterEmptyValues(productParams)
                }
            },
            transformResponse: (items: Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get("Pagination");
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return {items, pagination}
            }
        }),
        fetchProductDetails: builder.query<Product, number>({
            query: (productId) => `products/${productId}`
        }),
        fetchFilters: builder.query<{ brands: string[], types: string[] }, void>({
            query: () => "products/filters"
        })
    })
});

export const { 
    useFetchProductDetailsQuery, 
    useLazyFetchProductsQuery, 
    useLazyFetchFiltersQuery 
} = catalogApi;

// export const catalogApi = createApi({
//     reducerPath: "catalogApi",
//     baseQuery: baseQueryWithErrorHandling,
//     endpoints: (builder) => ({
//         fetchProducts: builder.query<Product[], void>({
//             query: () => ({ url: "products" })
//         }),
//         fetchProductDetails: builder.query<Product, number>({
//             query: (productId) => `products/${productId}`
//         })
//     })
// });

// export const { useFetchProductsQuery, useFetchProductDetailsQuery } = catalogApi;

// Before using the custom RTK Query
// export const catalogApi = createApi({
//     reducerPath: "catalogApi",
//     baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:5001/api" }),
//     endpoints: (builder) => ({
//         fetchProducts: builder.query<Product[], void>({
//             query: () => ({ url: "products" })
//         }),
//         fetchProductDetails: builder.query<Product, number>({
//             query: (productId) => `products/${productId}`
//         })
//     })
// });

// export const { useFetchProductsQuery, useFetchProductDetailsQuery } = catalogApi;