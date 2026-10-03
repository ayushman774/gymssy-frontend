import { FALLBACK_IMAGE } from "../../Discover/DiscoveryCard/discoveryCardUtils.js";

export const similarGymImage = (gym) =>
  gym?.images?.cover || gym?.image?.url || FALLBACK_IMAGE;

export const similarGymHref = (gym) => `/gym-detail/${gym.slug}`;

export { FALLBACK_IMAGE };
