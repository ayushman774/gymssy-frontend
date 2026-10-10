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

import { reverseDeviceLocation } from "../services/locationService.js";

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
      const device = await requestDeviceLocation();
      let resolved = device;
      try {
        const place = await reverseDeviceLocation(device.latitude, device.longitude);
        if (place) {
          const parts = [place.name || place.area, place.city, place.state]
            .filter(Boolean)
            .filter((part, index, values) => values.findIndex((value) => value.toLowerCase() === part.toLowerCase()) === index);
          resolved = {
            ...device,
            name: place.name || "",
            area: place.area || "",
            city: place.city || "",
            state: place.state || "",
            postcode: place.postcode || "",
            label: parts.join(", ") || place.label || device.label,
          };
        }
      } catch (error) {
        console.warn("Could not resolve device address:", error);
      }
      return acceptLocation(resolved);
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
