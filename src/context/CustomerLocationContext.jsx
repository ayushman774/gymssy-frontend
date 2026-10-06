/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  normalizeCustomerLocation,
  normalizeSearchLocation,
  persistCustomerLocation,
  readPersistedCustomerLocation,
  removePersistedCustomerLocation,
  requestDeviceLocation,
} from "../utils/customerLocation.js";

const CustomerLocationContext = createContext(null);

export function CustomerLocationProvider({ children }) {
  const [location, setLocation] = useState(readPersistedCustomerLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const acceptLocation = useCallback((nextLocation) => {
    const normalized = normalizeCustomerLocation(nextLocation);
    if (!normalized) return null;
    persistCustomerLocation(normalized);
    setLocation(normalized);
    setLocationError("");
    return normalized;
  }, []);

  const setSearchLocation = useCallback((suggestion) => acceptLocation(normalizeSearchLocation(suggestion)), [acceptLocation]);

  const setDeviceLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationError("");
    try {
      return acceptLocation(await requestDeviceLocation());
    } catch (error) {
      setLocationError(error?.message || "We couldn’t use your location. Search for an area instead.");
      return null;
    } finally {
      setIsLocating(false);
    }
  }, [acceptLocation]);

  const clearLocation = useCallback(() => {
    removePersistedCustomerLocation();
    setLocation(null);
    setLocationError("");
  }, []);

  const clearLocationError = useCallback(() => setLocationError(""), []);
  const value = useMemo(() => ({
    location,
    hasLocation: Boolean(location),
    setSearchLocation,
    setDeviceLocation,
    clearLocation,
    isLocating,
    locationError,
    clearLocationError,
  }), [clearLocation, clearLocationError, isLocating, location, locationError, setDeviceLocation, setSearchLocation]);

  return <CustomerLocationContext.Provider value={value}>{children}</CustomerLocationContext.Provider>;
}

export function useCustomerLocation() {
  const value = useContext(CustomerLocationContext);
  if (!value) throw new Error("useCustomerLocation must be used inside CustomerLocationProvider");
  return value;
}
