import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/Routes.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store/store.ts';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ToastContainer position="bottom-right" theme="colored"/>
                <RouterProvider router={router} />
        </Provider>
    </StrictMode>,
)

// Redux with legacy stuff
// const store = configureTheStore();
// console.log(store.getState())

// createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//         <App />
//     </StrictMode>,
// )
