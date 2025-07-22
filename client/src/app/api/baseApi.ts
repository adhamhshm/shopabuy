import { BaseQueryApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

const customBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include"
});

type ErrorResponse = | string | { title: string } | { errors: string[] };

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    // start loading
    api.dispatch(startLoading());
    await sleep();
    const result = await customBaseQuery(args, api, extraOptions);
    // stop loading
    api.dispatch(stopLoading());
    if (result.error) {
        //const { status, data } = result.error;
        const originalStatus = 
            result.error.status === "PARSING_ERROR" && result.error.originalStatus 
            ? result.error.originalStatus 
            : result.error.status
        //console.log({ status, data })
        //console.log(result.error);
        const responseData = result.error.data as ErrorResponse;
        switch (originalStatus) {
            case 400:
                //type guard
                if (typeof responseData === "string") {
                    toast.error(responseData);
                }
                else if ("errors" in responseData) {
                    // toast.error("Validation error");
                    throw Object.values(responseData.errors).flat().join(', ');
                }
                else {
                    toast.error(responseData.title)
                }
                break;
            case 401:
                //type guard
                if (typeof responseData === "object" && "title" in responseData)
                    toast.error(responseData.title);
                break;
            case 404:
                //type guard
                if (typeof responseData === "object" ) // && "title" in responseData
                    //toast.error(responseData.title);
                    router.navigate('/not-found')
                break;
            case 500:
                //type guard
                if (typeof responseData === "object") // && "title" in responseData
                    //toast.error(responseData.title);
                    router.navigate('/server-error', {state: {error: responseData}})
                break;
            default:
                break;
        }
    }

    return result;
}

// JSON data received in console log in dev tools
// data: "Bad request returned."
// error: "SyntaxError: Unexpected token 'B', \"Bad reques\"... is not valid JSON"
// originalStatus: 400
// status: "PARSING_ERROR"