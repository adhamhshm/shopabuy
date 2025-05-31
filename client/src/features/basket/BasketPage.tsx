import { Grid, Typography } from "@mui/material";
import { useFetchBasketQuery } from "./basketApi"
import OrderSummary from "../../app/shared/components/OrderSummary";
import BasketItem from "./BasketItem";

export default function BasketPage() {
    // Use the custom hook to fetch basket data; destructure the data and loading state
    const { data, isLoading } = useFetchBasketQuery();

    // If data is still loading, show a loading message
    if (isLoading) return <Typography>Loading basket...</Typography>

    // If there's no basket data or the basket is empty, show a message
    if (!data || data.items.length === 0) return <Typography variant="h3">Your basket is empty.</Typography>

    // Render the basket items and order summary in a grid layout
    return (
        <Grid container spacing={2}>
            {/* Left section: list of basket items, taking 8 out of 12 columns */}
            <Grid size={8}>
                {data.items.map(item => (
                    // Render each basket item using the BasketItem component
                    <BasketItem item={item} key={item.productId} />
                ))}
            </Grid>

            {/* Right section: order summary, taking 4 out of 12 columns */}
            <Grid size={4}>
                <OrderSummary />
            </Grid>
        </Grid>
    )
}
