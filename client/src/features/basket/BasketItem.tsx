import { Box, Grid, IconButton, Paper, Typography } from "@mui/material"
import { Add, Close, Remove } from "@mui/icons-material"
import { useAddBasketItemMutation, useRemoveBasketItemMutation } from "./basketApi"
import { currencyFormat } from "../../lib/util"
import { Item } from "../../app/models/Basket"

type Props = {
    item: Item // Type definition for the expected 'item' prop
}

export default function BasketItem({ item }: Props) {
    // Hook to call the mutation for removing an item from the basket
    const [removeBasketItem] = useRemoveBasketItemMutation();
    
    // Hook to call the mutation for adding an item to the basket
    const [addBasketItem] = useAddBasketItemMutation();

    return (
        <Paper sx={{
            height: 140,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2 // margin bottom for spacing between items
        }}>
            {/* Left section with image and product details */}
            <Box display="flex" alignItems="center">
                {/* Product image */}
                <Box
                    component="img"
                    src={item.pictureUrl}
                    alt={item.name}
                    sx={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: "4px",
                        mr: 8, // margin right
                        ml: 4  // margin left
                    }}
                />

                {/* Product info and quantity controls */}
                <Box display="flex" flexDirection="column" gap={1}>
                    {/* Product name */}
                    <Typography variant="h6">{item.name}</Typography>

                    {/* Price per unit and total price */}
                    <Box display="flex" alignItems="center" gap={3}>
                        <Typography sx={{fontSize: "1.1rem"}}>
                            {currencyFormat(item.price)} x {item.quantity}
                        </Typography>
                        <Typography sx={{fontSize: "1.1rem"}} color="primary">
                            {currencyFormat(item.price * item.quantity)}
                        </Typography>
                    </Box>

                    {/* Quantity adjustment controls */}
                    <Grid container spacing={1} alignItems="center">
                        {/* Decrease quantity by 1 */}
                        <IconButton 
                            onClick={() => removeBasketItem({productId: item.productId, quantity: 1})}
                            color="error" 
                            size="small" 
                            sx={{border: 1, borderRadius: 1, minWidth: 0}}
                        >
                            <Remove />
                        </IconButton>

                        {/* Display current quantity */}
                        <Typography variant="h6">{item.quantity}</Typography>

                        {/* Increase quantity by 1 */}
                        <IconButton 
                            onClick={() => addBasketItem({product: item, quantity: 1})}
                            color="success" 
                            size="small" 
                            sx={{border: 1, borderRadius: 1, minWidth: 0}}
                        >
                            <Add />
                        </IconButton>
                    </Grid>
                </Box>
            </Box>

            {/* Remove item entirely from basket */}
            <IconButton
                onClick={() => removeBasketItem({productId: item.productId, quantity: item.quantity})}
                color="error"
                size="small" 
                sx={{
                    border: 1, 
                    borderRadius: 1, 
                    minWidth: 0, 
                    alignSelf: "start", // aligns the button to the top of the Paper
                    mr: 1, // margin right
                    mt: 1  // margin top
                }}
            >
                <Close />
            </IconButton>
        </Paper>
    )
}
