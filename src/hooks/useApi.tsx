import axios, { AxiosHeaders, AxiosInstance, AxiosRequestHeaders, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { base_url } from "@utils/base_url";
import { useSelector , useDispatch } from "react-redux";
import { setAuth } from "@data/redux/slices/authSlice";
import { setLoader } from "@data/redux/slices/loaderSlice";


import { RootState } from '@data/redux/Store'

// Define Token and API Response Types
interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

interface CallAPIResponse {
  error: boolean;
  response?: AxiosResponse | null;
  errorMessage?: {
    data : any;
    error : boolean;
    message : string;
  };
}

interface ExpireTokenResponse {
  access?: string;
  refresh?: string;
  action?: string;
  status?: number;
}

interface headerInterface {
    'ngrok-skip-browser-warning' : string;
    'Authorization' : string;
}

// useAPI Hook
const useAPI = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const Auth = useSelector((state : RootState) => state.auth)
    
  const StoredTokens: Tokens = {
    accessToken : Auth?.accessToken,
    refreshToken : Auth?.refreshToken,
  };

  const CallAPI = async (
    tokens: Tokens = StoredTokens,
    reqInstance: AxiosInstance,
    endpoint: string,
    method: 'get' | 'post',
    headers: any,
    body: any = null,
    params: any = null
  ): Promise<CallAPIResponse> => {
    dispatch(setLoader(true));
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  
    try {
      const response = await makeRequest(reqInstance, endpoint, method, headers, body, params);
      dispatch(setLoader(false));
      return { error: false, response };
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // Token refresh logic
        const result = await expireToken(tokens.refreshToken);
        if (result.access && result.refresh) {
          const token_data: Tokens = {
            accessToken: result.access,
            refreshToken: result.refresh,
          };
          localStorage.setItem('accessToken', result.access);
          localStorage.setItem('refreshToken', result.refresh);
          const tokens = {
            access: result.access,
            refresh: result.refresh,
            isAuth: true
          };
          dispatch(setAuth(tokens));
          
          // Recursively call the API after refreshing the token
          return CallAPI(token_data, reqInstance, endpoint, method, headers, body, params);
        }
  
        if (result.action === 'tokenExpired' && result.status === 401) {
          // Handle token expiration
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/auth/sign-in/');
          dispatch(setLoader(false));
          return { error: true, errorMessage: {data : null,error:true,message : "Token Expired"} };
        }
      } else {
        // Handle other errors
        dispatch(setLoader(false));
        return { error: true, errorMessage: error.response?.data || 'Unknown error' };
      }
    }
  
    // In case of an unexpected issue, return a default response
    dispatch(setLoader(false));
    return { error: true, errorMessage: {data: null,error:true,message : 'Unexpected error occurred'} };
  };
  

  return [StoredTokens, CallAPI] as const;
};

// makeRequest Function
const makeRequest = async (
  reqInstance: AxiosInstance,
  endpoint: string,
  method: 'get' | 'post',
  headers: any,
  body: any = null,
  params: any = null
): Promise<AxiosResponse> => {
  if (method === 'get') {
    return await reqInstance.get(`${base_url}${endpoint}`, { headers : headers, params });
  } else if (method === 'post') {
    return await reqInstance.post(`${base_url}${endpoint}`, body, { headers });
  } else {
    throw new Error('Invalid HTTP method');
  }
};

// expireToken Function
const expireToken = async (refreshToken: string | null): Promise<ExpireTokenResponse> => {
    const headers = {
        'ngrok-skip-browser-warning': 'true',
      };
 
  try {
    const response = await axios.post(`${base_url}/auth/api/token/refresh/`, { refresh: refreshToken }, { headers });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { action: 'tokenExpired', status: error.response.status };
    }
    throw error;
  }
};
    
export default useAPI;
