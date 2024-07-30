export const getToken = () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    return { access_token, refresh_token };
  };
  
  export const setToken = (tokens) => {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  };
  
  export const refreshToken = async () => {
    const { refresh_token } = getToken();
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }
  
    const response = await fetch('http://127.0.0.1:8000/api/user/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refresh_token }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
  
    const tokens = await response.json();
    setToken(tokens);
    return tokens.access_token;
  };
  