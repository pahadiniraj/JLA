import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Login {
  email: string;
  password: string;
}

interface Otp {
  otp: number | string;
}

interface Response {
  message: string;
  success?: boolean; // Add success if other endpoints return it
  user?: User;
}

interface User {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<Response, Register>({
      query: (user) => {
        return {
          url: "register",
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        };
      },
    }),
    verifyOtp: builder.mutation<Response, Otp>({
      query: (user) => {
        return {
          url: `verify-otp`,
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation<Response, Login>({
      query: (user) => {
        return {
          url: `login`,
          method: "POST",
          body: user,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        };
      },
    }),
    logoutUser: builder.mutation<{ data: string }, void>({
      query: (user) => {
        return {
          url: `logout`,
          body: user,
          method: "POST",
          credentials: "include",
        };
      },
    }),
    resetUserPasswordLink: builder.mutation({
      query: (user) => {
        return {
          url: `reset-password-link`,
          body: user,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    resetUserPassword: builder.mutation({
      query: (data) => {
        const { id, token, ...values } = data;
        const actualData = { ...values };
        return {
          url: `reset-password-confirm/${id}/${token}`,
          method: "POST",
          body: actualData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    getToken: builder.query<Response, void>({
      query: () => ({
        url: "refresh-token",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useResetUserPasswordLinkMutation,
  useResetUserPasswordMutation,
  useGetTokenQuery,
} = authApi;
