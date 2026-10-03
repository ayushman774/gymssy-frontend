import test from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK_IMAGE,
  similarGymHref,
  similarGymImage,
} from "../src/components/GymDetails/SimilarGyms/similarGymCardUtils.js";

test("similar gym cards use the canonical detail route", () => {
  assert.equal(
    similarGymHref({ slug: "prestige-athletic-club" }),
    "/gym-detail/prestige-athletic-club",
  );
});

test("similar gym cards preserve available cover images", () => {
  assert.equal(
    similarGymImage({ images: { cover: "https://cdn.example/gym.jpg" } }),
    "https://cdn.example/gym.jpg",
  );
});

test("similar gym cards fall back when listing media is absent", () => {
  assert.equal(similarGymImage({ images: { cover: "" } }), FALLBACK_IMAGE);
  assert.equal(similarGymImage({}), FALLBACK_IMAGE);
});
