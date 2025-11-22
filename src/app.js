// src/app.js

// 1) Import the API helper
import { fetchBreeds } from "./api.js";

// 2) Grab important DOM elements
const search = document.getElementById("search");
const echo = document.getElementById("echo");
const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const favToggle = document.getElementById("toggle-favorites");

// 3) App state
let ALL_BREEDS = [];
let favoriteIds = new Set();

// 4) Favorites helpers (localStorage)
function loadFavorites() {
  try {
    const raw = localStorage.getItem("favoriteBreeds");
    if (!raw) {
      favoriteIds = new Set();
    } else {
      favoriteIds = new Set(JSON.parse(raw)); // array -> Set
    }
  } catch (e) {
    console.error("Error loading favorites", e);
    favoriteIds = new Set();
  }
}

function saveFavorites() {
  localStorage.setItem("favoriteBreeds", JSON.stringify([...favoriteIds]));
}

// 5) Status helper
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg || "";
}

// 6) Render breed cards (with image + favorite button)
function renderBreeds(breeds) {
  grid.innerHTML = "";

  if (!breeds.length) {
    grid.innerHTML = `
      <div class="card" style="text-align:center; padding:20px;">
        🐶 No breeds match your search.
      </div>
    `;
    setStatus("No breeds found.");
    return;
  }

  const html = breeds
    .map((b) => {
      const imgUrl =
        b.image && b.image.url
          ? b.image.url
          : "https://via.placeholder.com/400x250?text=No+Image";

      const temperament = b.temperament
        ? b.temperament.split(",").slice(0, 3).join(", ")
        : "Temperament: n/a";

      const isFav = favoriteIds.has(b.id);

      return `
        <article class="dog-card">
          <img src="${imgUrl}" alt="${b.name}" class="dog-card-img">
          <div class="dog-card-body">
            <h3 class="dog-card-title">${b.name}</h3>
            <p class="dog-card-meta">${temperament}</p>
            <button
  class="fav-heart ${isFav ? "hearted" : ""}"
  type="button"
  data-id="${b.id}"
  aria-label="Favorite"
>
  ${isFav ? "❤️" : "🤍"}
</button>
          </div>
        </article>
      `;
    })
    .join("");

  grid.innerHTML = html;
}

// 7) Handle clicks on favorite buttons (event delegation)
if (grid) {
  grid.addEventListener("click", (event) => {
    const btn = event.target.closest(".fav-heart");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (favoriteIds.has(id)) {
      // remove from favorites
      favoriteIds.delete(id);
      btn.classList.remove("faved");
      btn.textContent = "🤍";
    } else {
      // add to favorites
      favoriteIds.add(id);
      btn.classList.add("faved");
      btn.textContent = "❤️";
    }

    saveFavorites();
    applyFilters();
  });
}
function applyFilters() {
  if (!ALL_BREEDS.length) return;

  const text = search.value.trim().toLowerCase();
  let list = ALL_BREEDS;

  // 1) Filter by search text
  if (text) {
    list = list.filter((breed) =>
      breed.name.toLowerCase().includes(text)
    );
  }

  // 2) Filter by favorites only if the toggle is checked
  if (favToggle && favToggle.checked) {
    list = list.filter((breed) => favoriteIds.has(breed.id));
  }

  // Render and update status
  renderBreeds(list);
  setStatus(`Showing ${list.length} of ${ALL_BREEDS.length} breeds`);
}

// 8) Search input: echo text + filter breeds
if (!search || !echo) {
  console.error("Missing #search or #echo in HTML");
} else {
  search.addEventListener("input", () => {
    const text = search.value.trim();
    echo.innerHTML = `You typed: <strong>${text || "(nothing yet)"}</strong>`;

    applyFilters(); // ← handles all filtering now
  });
}
if (favToggle) {
  favToggle.addEventListener("change", () => {
    applyFilters();
  });
}


// 9) Initial load: get favorites, fetch breeds, render
(async function loadBreeds() {
  try {
    setStatus("Loading breeds…");

    loadFavorites(); // load saved favorites first

    const breeds = await fetchBreeds();
    ALL_BREEDS = breeds;

    renderBreeds(ALL_BREEDS);
    setStatus(`Loaded ${breeds.length} breeds.`);
  } catch (err) {
    console.error(err);
    setStatus("Failed to load breeds. Check your API key and try again.");
  }
})();



