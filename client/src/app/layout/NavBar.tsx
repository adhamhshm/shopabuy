import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, LinearProgress, List, ListItem, Toolbar, Typography } from "@mui/material";
import { authLinks, navigationLinks } from "../constant";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { useFetchBasketQuery } from "../../features/basket/basketApi";

// what an ugly way to do styling haha
const navigationStyles = {
    color: "inherit", 
    typography: "h6",
    textDecoration: "none",
    "&:hover": {
        color: "secondary.main"
    },
    "&.active": {
        color: "secondary.main",
    }
}

export const NavBar = () => {

    const { isLoading, darkMode } = useAppSelector(state => state.ui);
    const dispatch = useAppDispatch();
    const { data: basket } = useFetchBasketQuery();

    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <AppBar position="fixed">
            <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography component={NavLink} to="/" variant="h6" sx={{textDecoration: "none", color: "inherit"}}>
                        SHOPABUY
                    </Typography>
                    <IconButton onClick={() => dispatch(setDarkMode())}>
                        {darkMode ? <DarkMode /> : <LightMode sx={{color: "yellow"}}/>}
                    </IconButton>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <List sx={{display: "flex"}}>
                        {navigationLinks.map(({title, path}) => (
                            <ListItem 
                                component={NavLink} 
                                to={path} 
                                key={path} 
                                sx={navigationStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <IconButton component={Link} to="/basket" size="large" sx={{color: "inherit"}}>
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{display: "flex"}}>
                        {authLinks.map(({title, path}) => (
                            <ListItem 
                                component={NavLink} 
                                to={path} 
                                key={path} 
                                sx={navigationStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>
            { isLoading && (
                <Box sx={{width: "100%"}}>
                    <LinearProgress color="secondary" />
                </Box>
            )}
        </AppBar>
    )
}