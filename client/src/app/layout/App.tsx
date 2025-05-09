import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import Catalog from "../features/catalog/Catalog";
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { NavBar } from "./NavBar";

function App() {

    const [products, setProducts] = useState<Product[]>([]);
    const [darkMode, setDarkMode] = useState(false);
    //const darkMode = true;
    const palleteType = darkMode ? "dark" : "light";

    const theme = createTheme({
        palette: {
            mode: palleteType,
            background: {
                default: (palleteType === "light") ? "#EAEAEA" : "#121212"
            }
        }
    });

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // useEffect will need an array of dependencies, when these dependencies change
    // the idea is that the useEffect runs again to attempt to synchronize with the external state our API
    // if no dependencies, useEffect is only going to run once when this component first mounts
    useEffect(() => {
        fetch("https://localhost:5001/api/products")
            .then(response => response.json())
                .then(data => setProducts(data))
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
            <Box 
                sx={{
                    minHeight: "100vh", 
                    background: darkMode ? "radial-gradient(circle, #8B7141, #111B27)" : "radial-gradient(circle, #BAECF9, #F0F9FF)", 
                    py: 6
                }}
            >
                <Container maxWidth="xl" sx={{mt: 8}}>
                    <Catalog products={products}/>
                </Container>
            </Box>
        </ThemeProvider>
    )
};

export default App;


// const generateId = () => {
//     const randomNum = Math.floor(Math.random() * 100); // Random 2-digit number
//     return randomNum;
// }

// const addProduct = () => {
//     setProducts(prevState => [
//         ...prevState, 
//         {
//             id: prevState.length + 1,
//             name: "product " + (prevState.length + 1), 
//             price: (prevState.length * 100) + 100,
//             quantityInStock: 100,
//             description: "test",
//             pictureUrl: `https://picsum.photos/id/${generateId()}/200/300`,
//             type: "test",
//             brand: "test"
//         }
//     ])
// }

{/* 
    <Box display="flex" justifyContent="center" gap={3} marginY={3}>
        <Typography variant="h4">Shopabuy</Typography>
        <Button variant="contained" onClick={addProduct}>Add Products</Button>
    </Box> 
*/}