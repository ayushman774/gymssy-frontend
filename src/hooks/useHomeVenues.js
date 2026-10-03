import useDiscovery from "./useDiscovery.js";
import { HOME_VENUE_FILTERS } from "../utils/homeMarketplace.js";

export default function useHomeVenues() {
  return useDiscovery(HOME_VENUE_FILTERS);
}

