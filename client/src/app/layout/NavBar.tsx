import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography } from "@mui/material";
import { authLinks, navigationLinks } from "../constant";
import { NavLink } from "react-router-dom";

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

type Props = {
    toggleDarkMode: () => void;
    darkMode: boolean;
}

export const NavBar = ({toggleDarkMode, darkMode}: Props) => {

    return (
        <AppBar position="fixed">
            <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography component={NavLink} to="/" variant="h6" sx={{textDecoration: "none", color: "inherit"}}>
                        SHOPABUY
                    </Typography>
                    <IconButton onClick={toggleDarkMode}>
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
                    <IconButton size="large" sx={{color: "inherit"}}>
                        <Badge badgeContent="4" color="secondary">
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
        </AppBar>
    )
}