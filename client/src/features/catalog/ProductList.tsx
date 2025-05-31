import { Box } from "@mui/material";
import { ProductCard } from "./ProductCard";
import { Product } from "../../app/models/Product";

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