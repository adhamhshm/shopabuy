import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import { ProductDetails } from "../../features/catalog/ProductDetails";
import { ContactPage } from "../../features/contact/ContactPage";
import AboutPage from "../../features/about/AboutPage";
import BasketPage from "../../features/basket/BasketPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess";
import OrdersPage from "../../features/orders/OrdersPage";
import OrderDetailedPage from "../../features/orders/OrderDetailedPage";

// notice how the import style is differences is due to different function style

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {element: <RequireAuth />, children: [
                {path: 'checkout', element: <CheckoutPage />},
                {path: 'checkout/success', element: <CheckoutSuccess />},
                {path: 'orders', element: <OrdersPage />},
                {path: 'orders/:id', element: <OrderDetailedPage />},
            ]},
            {path: "", element: <HomePage />},
            {path: "catalog", element: <Catalog />},
            {path: "catalog/:id", element: <ProductDetails />},
            {path: "about", element: <AboutPage />}, 
            {path: "contact", element: <ContactPage />}, 
            {path: "basket", element: <BasketPage />}, 
            {path: 'checkout', element: <CheckoutPage />},
            {path: "login", element: <LoginForm />},
            {path: "register", element: <RegisterForm />},
            {path: "server-error", element: <ServerError />}, 
            {path: "not-found", element: <NotFound />}, 
            {path: "*", element: <Navigate replace to="/not-found" />},
        ]
    }
]);