import { Box } from "@mui/material";
import { Product } from "../../models/Product";
import { ProductCard } from "./ProductCard";

type Props = {
    products: Product[]
}

export const ProductList = ({products}: Props) => {
    return (
        <Box sx={{display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center"}}>
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </Box>
    )
}