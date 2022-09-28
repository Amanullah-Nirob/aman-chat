import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

import { RegisterRequest,AuthResponse,LoginRequest,loginResponse } from "../interface/userinterface";
import { json } from "stream/consumers";

export const userApi=createApi({
    reducerPath: "userApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.API_URL}/api/user`,
        prepareHeaders:(headers,{getState})=>{
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = (getState() as RootState).auth?.loggedInUser.token;

        if (token) { 
          headers.set("Authorization", `Bearer ${token}`);
        }
         headers.set('Content-Type', 'application/json')
         return headers;
    }
    }),
    tagTypes: ["User"], 
    endpoints:(builder)=>({
        registerUser:builder.mutation<AuthResponse,RegisterRequest>({
            query:({name,email,password})=>({
                url: "/register",
                method: "POST",
                body: JSON.stringify({name,email,password}),
            }),
            invalidatesTags: ["User"],
        }),

        login: builder.mutation<loginResponse, LoginRequest>({
            query: ({email,password}) => ({
              url: "/login",
              method: "POST",
              body: JSON.stringify({email,password}),
            }),
            invalidatesTags: ["User"],
          }),

    }),
 

}) 

export const {
    useRegisterUserMutation,
    useLoginMutation,
} = userApi;
  