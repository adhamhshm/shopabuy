import { Grid, Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useLazyFetchFiltersQuery, useLazyFetchProductsQuery } from "./catalogApi";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";
import { useEffect } from "react";

export default function Catalog() {
  const productParams = useAppSelector(state => state.catalog);
  const [triggerFetchProducts, {data, isLoading: productsLoading}] = useLazyFetchProductsQuery();
  const [triggerFetchFilters, {data: filtersData, isLoading: filtersLoading}] = useLazyFetchFiltersQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    triggerFetchProducts(productParams);
    triggerFetchFilters();
  }, [triggerFetchFilters, triggerFetchProducts, productParams])

  if (productsLoading || filtersLoading || !data || !filtersData) 
    return <div>Loading...</div>

  return (
        <Grid container spacing={4}>
            <Grid size={3}>
                <Filters data={filtersData} />
            </Grid>
            <Grid size={9}>
                {data.items && data.items.length > 0 ? (
                <>
                    <ProductList products={data.items} />
                    <AppPagination
                        metadata={data.pagination}
                        onPageChange={(page: number) => {
                            dispatch(setPageNumber(page));
                            window.scrollTo({top: 0, behavior: "smooth"})
                        }}
                    />
                </>
                ) : (
                    <Typography variant="h5">
                        There are no results found.
                    </Typography>
                )}
            </Grid>
        </Grid>
  )
}

// Old code
// export default function Catalog() {

//     const { data, isLoading } = useFetchProductsQuery();

//     if (isLoading || !data) {
//         return <div>Loading...</div>
//     }

//     return (
//         <>
//             <ProductList products={data}/>
//         </>
//     )
// }

// Before using the Redux Toolkit
// export default function Catalog() {

//     const [products, setProducts] = useState<Product[]>([]);

//     // useEffect will need an array of dependencies, when these dependencies change
//     // the idea is that the useEffect runs again to attempt to synchronize with the external state our API
//     // if no dependencies, useEffect is only going to run once when this component first mounts
//     useEffect(() => {
//         fetch("https://localhost:5001/api/products")
//             .then(response => response.json())
//                 .then(data => setProducts(data))
//     }, []);

//     return (
//         <>
//             <ProductList products={products}/>
//         </>
//     )
// }