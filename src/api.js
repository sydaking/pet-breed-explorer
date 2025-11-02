// src/api.js
import { DOG_API_KEY } from "../config.js"; // notice the .. goes up one folder

const BASE = "https://api.thedogapi.com/v1";

export async function fetchBreeds() {
  const res = await fetch(`${BASE}/breeds`, {
    headers: { "x-api-key": DOG_API_KEY }
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json(); // returns an array of breed objects
}
