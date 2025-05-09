import { useState } from "react";
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { NavBar } from "./NavBar";
import { Outlet } from "react-router-dom";

function App() {

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
            <Box 
                sx={{
                    minHeight: "100vh", 
                    background: darkMode ? "radial-gradient(circle,rgb(5, 33, 51),rgb(11, 21, 32))" : "radial-gradient(circle,rgb(136, 205, 223),rgb(227, 242, 250))", 
                    py: 6
                }}
            >
                <Container maxWidth="xl" sx={{mt: 8}}>
                    {/* before --> <Catalog /> */}
                    <Outlet />
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