/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchCurrentCustomer, loginCustomer, registerCustomer } from "../services/customerAuthService.js";

const TOKEN_KEY = "gymssy_customer_token";
const CustomerAuthContext = createContext(null);

function readToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}

function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* session still works in memory */ }
}

function requireCustomer(user) {
  if (user?.role !== "user") throw new Error("Please use the appropriate Gymssy portal for this account.");
  return user;
}

export function CustomerAuthProvider({ children }) {
  const [token, setToken] = useState(readToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(readToken()));
  const [sessionError, setSessionError] = useState("");
  const restored = useRef(false);

  const clearSession = useCallback(() => {
    writeToken("");
    setToken("");
    setUser(null);
    setSessionError("");
    setLoading(false);
  }, []);

  const acceptSession = useCallback((payload) => {
    const customer = requireCustomer(payload?.data?.user);
    const nextToken = payload?.data?.token;
    if (!nextToken) throw new Error("Gymssy did not return a session token.");
    writeToken(nextToken);
    setToken(nextToken);
    setUser(customer);
    setSessionError("");
    return customer;
  }, []);

  const refreshUser = useCallback(async (sessionToken = token) => {
    if (!sessionToken) return null;
    try {
      const payload = await fetchCurrentCustomer(sessionToken);
      const customer = requireCustomer(payload?.data?.user);
      setUser(customer);
      setSessionError("");
      return customer;
    } catch (error) {
      if (error?.status === 401 || error?.status === 403 || /appropriate Gymssy portal/.test(error?.message || "")) {
        clearSession();
      } else {
        setSessionError(error?.message || "Unable to restore your session.");
      }
      throw error;
    }
  }, [clearSession, token]);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const storedToken = readToken();
    if (!storedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    refreshUser(storedToken).catch(() => {}).finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (credentials) => acceptSession(await loginCustomer(credentials)), [acceptSession]);
  const register = useCallback(async (details) => acceptSession(await registerCustomer(details)), [acceptSession]);
  const logout = useCallback(() => clearSession(), [clearSession]);

  const value = useMemo(() => ({ user, token, loading, sessionError, isAuthenticated: Boolean(user && token), login, register, logout, refreshUser }), [user, token, loading, sessionError, login, register, logout, refreshUser]);
  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const value = useContext(CustomerAuthContext);
  if (!value) throw new Error("useCustomerAuth must be used inside CustomerAuthProvider");
  return value;
}
