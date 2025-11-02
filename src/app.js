// src/app.js

const search = document.getElementById('search');
const echo = document.getElementById('echo');

if (!search || !echo) {
  console.error('Missing #search or #echo in HTML');
} else {
  search.addEventListener('input', () => {
    const text = search.value.trim();
    echo.innerHTML = `You typed: <strong>${text || '(nothing yet)'}</strong>`;
  });
}

// ----- Step 9: fetch breeds and render names -----
import { fetchBreeds } from "./api.js";

const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");

// helper: show status messages
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg || "";
}

// helper: render a simple card for each breed name
function renderBreedNames(breeds) {
  grid.innerHTML = ""; // clear existing cards
  if (!breeds.length) {
    setStatus("No breeds found.");
    return;
  }

  const html = breeds.map(b => `<div class="card">${b.name}</div>`).join("");
  grid.innerHTML = html;
}

// run once when the page loads
(async function loadBreeds() {
  try {
    setStatus("Loading breeds…");
    const breeds = await fetchBreeds();
    renderBreedNames(breeds);
    setStatus(`Loaded ${breeds.length} breeds.`);
  } catch (err) {
    console.error(err);
    setStatus("Failed to load breeds. Check your API key and try again.");
  }
})();

