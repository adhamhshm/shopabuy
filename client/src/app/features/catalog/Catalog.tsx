import { ProductList } from "./ProductList";
import { useFetchProductsQuery } from "./catalogApi";

export default function Catalog() {

    const { data, isLoading } = useFetchProductsQuery();

    if (isLoading || !data) {
        return <div>Loading...</div>
    }

    return (
        <>
            <ProductList products={data}/>
        </>
    )
}

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