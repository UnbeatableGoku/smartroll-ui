// import axios, { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from "axios";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { Store } from "src/views/forms/validation/store";
// import { base_url } from "src/base_url";

// // Define Token and API Response Types
// interface Tokens {
//   accessToken: string;
//   refreshToken: string;
// }

// interface CallAPIResponse {
//   error: boolean;
//   response?: AxiosResponse | null;
//   errorMessage?: string;
// }

// interface ExpireTokenResponse {
//   access?: string;
//   refresh?: string;
//   action?: string;
//   status?: number;
// }

// // useAPI Hook
// const useAPI = () => {
//   const navigate = useNavigate();
//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const { accessToken, refreshToken } = state;

//   const StoredTokens: Tokens = {
//     accessToken,
//     refreshToken,
//   };

//   const CallAPI = async (
//     tokens: Tokens = StoredTokens,
//     reqInstance: AxiosInstance,
//     endpoint: string,
//     method: 'get' | 'post',
//     headers: AxiosRequestHeaders,
//     body: any = null,
//     params: any = null
//   ): Promise<CallAPIResponse> => {
//     ctxDispatch({ type: 'LOADER_STATE', payload: true });
//     headers['Authorization'] = `Bearer ${tokens.accessToken}`;

//     try {
//       const response = await makeRequest(reqInstance, endpoint, method, headers, body, params);
//       ctxDispatch({ type: 'LOADER_STATE', payload: false });
//       return { error: false, response };
//     } catch (error: any) {
//       if (error.response && error.response.status === 401) {
//         const result = await expireToken(tokens.refreshToken);
//         if (result.access && result.refresh) {
//           const token_data: Tokens = {
//             accessToken: result.access,
//             refreshToken: result.refresh,
//           };
//           localStorage.setItem('accessToken', result.access);
//           localStorage.setItem('refreshToken', result.refresh);
//           ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.access });
//           ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.refresh });
//           return CallAPI(token_data, reqInstance, endpoint, method, headers, body, params);
//         }

//         if (result.action === 'tokenExpired' && result.status === 401) {
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('refreshToken');
//           navigate('/auth/sign-in/');
//           ctxDispatch({ type: 'LOADER_STATE', payload: false });
//           return { error: true, errorMessage: 'Token expired' };
//         }
//       } else {
//         ctxDispatch({ type: 'LOADER_STATE', payload: false });
//         return { error: true, errorMessage: error.response?.data || 'Unknown error' };
//       }
//     }
//   };

//   return [StoredTokens, CallAPI] as const;
// };

// // makeRequest Function
// const makeRequest = async (
//   reqInstance: AxiosInstance,
//   endpoint: string,
//   method: 'get' | 'post',
//   headers: AxiosRequestHeaders,
//   body: any = null,
//   params: any = null
// ): Promise<AxiosResponse> => {
//   if (method === 'get') {
//     return await reqInstance.get(`${base_url}${endpoint}`, { headers, params });
//   } else if (method === 'post') {
//     return await reqInstance.post(`${base_url}${endpoint}`, body, { headers });
//   } else {
//     throw new Error('Invalid HTTP method');
//   }
// };

// // expireToken Function
// const expireToken = async (refreshToken: string): Promise<ExpireTokenResponse> => {
//   const headers: AxiosRequestHeaders = {
//     'ngrok-skip-browser-warning': 'true',
//   };

//   try {
//     const response = await axios.post(`${base_url}/auth/api/token/refresh/`, { refresh: refreshToken }, { headers });
//     return response.data;
//   } catch (error: any) {
//     if (error.response?.status === 401) {
//       return { action: 'tokenExpired', status: error.response.status };
//     }
//     throw error;
//   }
// };
    
// export default useAPI;
