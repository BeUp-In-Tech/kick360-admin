export const BASE_URL = '';

interface ApiOptions extends RequestInit {
  data?: any;
}

export const fetchApi = async (endpoint: string, options: ApiOptions = {}) => {
  const { data, headers, ...customConfig } = options;

  let authHeaders = {};
  if (typeof window !== 'undefined') {
    const access = localStorage.getItem('access_token');
    if (access) {
      authHeaders = {
        Authorization: `Bearer ${access}`,
      };
    }
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If 401 Unauthorized, we might need to handle refresh token logic or clear tokens
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized');
    }

    if (response.status === 204 || response.status === 205) {
      return {};
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const result = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMsg = 'API error occurred';
      if (typeof result === 'object' && result !== null) {
        if (result.error && typeof result.error === 'object') {
          if (result.error.details && result.error.details.non_field_errors) {
            errorMsg = result.error.details.non_field_errors[0];
          } else if (result.error.message) {
            errorMsg = result.error.message;
          } else {
            errorMsg = JSON.stringify(result.error);
          }
        } else if (result.message) {
          errorMsg = result.message;
        } else if (result.detail) {
          errorMsg = result.detail;
        } else {
          // Fallback to stringify the whole result for field errors like {"start_date": ["Invalid format"]}
          errorMsg = JSON.stringify(result);
        }
      } else if (typeof result === 'string' && result) {
        errorMsg = result;
      }
      throw new Error(errorMsg);
    }

    return result;
  } catch (error) {
    throw error;
  }
};
