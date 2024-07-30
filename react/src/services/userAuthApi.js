// userAuthApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken, setToken, refreshToken } from './TokenService';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000/api/user/',
  prepareHeaders: (headers) => {
    const { access_token } = getToken();
    if (access_token) {
      headers.set('Authorization', `Bearer ${access_token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Attempt to refresh token
    try {
      const newAccessToken = await refreshToken();
      api.dispatch(setToken({ access_token: newAccessToken }));
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } catch (error) {
      // Handle token refresh error
      console.error('Failed to refresh token', error);
    }
  }
  return result;
};

export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    userRegistration: builder.mutation({
      query: (user) => ({
        url: 'register/',
        method: 'POST',
        body: user,
      }),
    }),
    userLogin: builder.mutation({
      query: (user) => ({
        url: 'login/',
        method: 'POST',
        body: user,
      }),
    }),
    profileData: builder.query({
      query: () => 'profile/',
    }),
    changeUserPassword: builder.mutation({
      query: ({ realData }) => ({
        url: 'change_password/',
        method: 'POST',
        body: realData,
      }),
    }),
    sendUserPasswordResetMail: builder.mutation({
      query: (user) => ({
        url: 'password_reset_send/',
        method: 'POST',
        body: user,
      }),
    }),
    resetUserPassword: builder.mutation({
      query: ({ realData, id, token }) => ({
        url: `/reset_password/${id}/${token}/`,
        method: 'POST',
        body: realData,
      }),
    }),
    inviteUser: builder.mutation({
      query: (user) => ({
        url: 'invite_user/',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { 
  useUserRegistrationMutation, 
  useUserLoginMutation, 
  useProfileDataQuery, 
  useChangeUserPasswordMutation, 
  useSendUserPasswordResetMailMutation, 
  useResetUserPasswordMutation, 
  useInviteUserMutation 
} = userAuthApi;
