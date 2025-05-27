import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../features/contact/counterReducer";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../features/catalog/catalogApi";
import { uiSlice } from "../layout/uiSlice";

export const store = configureStore({
    reducer: {
        [catalogApi.reducerPath]: catalogApi.reducer,
        counter: counterSlice.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(catalogApi.middleware)
});

// Get this from the redux docs under "TypeScript Quick Start"
// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()


// // Redux with legacy stuff
// import { legacy_createStore } from "@reduxjs/toolkit";
// import counterReducer from "../features/contact/counterReducer";

// export function configureTheStore() {
//     return legacy_createStore(counterReducer);
// }