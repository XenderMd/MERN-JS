import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((id, token, expirationDate) => {
    setToken(token);
    setIsLoggedIn(!!token);
    setUserId(id);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 3600);
    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: id,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setIsLoggedIn(false);
    setUserId(null);
    setTokenExpirationDate();
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      if (new Date(storedData.expiration) > new Date()) {
        login(
          storedData.userId,
          storedData.token,
          new Date(storedData.expiration)
        );
      }
    }
  }, [login]);

  return {
    isLoggedIn,
    userId,
    login,
    logout,
    token,
  };
};
