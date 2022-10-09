import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const chatApi=createApi({
    reducerPath: "chatApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.API_URL}/api/chat`,
        prepareHeaders:(headers,{getState})=>{
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = (getState() as RootState).auth?.loggedInUser?.token;

        if (token) { 
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", `application/json`);
        return headers;
    }
    }),
    tagTypes: ["Chat"], 
    endpoints:(builder)=>({

        getChat: builder.query<[],any>({
            query:()=>({
                url: "/",
                method: "get",
            }),
            providesTags: ["Chat"],
        }),

        

    }),
 

}) 

export const {
    useGetChatQuery,
} = chatApi;