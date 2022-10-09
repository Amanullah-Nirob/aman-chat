import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

import { RegisterRequest,AuthResponse,LoginRequest,loginResponse } from "../interface/userinterface";


export const userApi=createApi({
    reducerPath: "userApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.API_URL}/api/user`,
        prepareHeaders:(headers,{getState})=>{
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = (getState() as RootState).auth?.loggedInUser?.token;

        if (token) { 
          headers.set("Authorization", `Bearer ${token}`);
        }
         return headers;
    }
    }),
    tagTypes: ["User"], 
    endpoints:(builder)=>({
        registerUser:builder.mutation<AuthResponse,RegisterRequest>({
            query:({name,email,password})=>({
                url: "/register",
                method: "POST",
                headers:{ "Content-Type":"application/json"},
                body: JSON.stringify({name,email,password}),
            }),
            invalidatesTags: ["User"],
        }),
 
        login: builder.mutation<loginResponse, LoginRequest>({
            query: ({email,password}) => ({
              url: "/login",
              method: "POST",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify({email,password}),
            }),
            invalidatesTags: ["User"],
        }),

         profilePhotoUpdate: builder.mutation<{}, FormData>({
            query: (data) => ({
              url: "/update/profile-pic",
              method: "put",
              body: data,
            }),
            invalidatesTags: ["User"],
         }),
         profileNameUpdate: builder.mutation<{}, {}>({
            query: (newName) => ({
              url: "/update/name",
              method: "put",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify(newName),
            }),
            invalidatesTags: ["User"],
         }),

         passwordUpdate: builder.mutation<{}, {}>({
            query: (updatePassword) => ({
              url: "/update/password",
              method: "put",
              headers:{"Content-Type":"application/json"},
              body: JSON.stringify(updatePassword),
            }),
            invalidatesTags: ["User"],
         }),


        

    }),
 

}) 

export const {
    useRegisterUserMutation,
    useLoginMutation,
    useProfilePhotoUpdateMutation,
    useProfileNameUpdateMutation,
    usePasswordUpdateMutation,
} = userApi;
  