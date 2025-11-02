// src/app.js
let ALL_BREEDS = [];

const search = document.getElementById('search');
const echo = document.getElementById('echo');

if (!search || !echo) {
  console.error('Missing #search or #echo in HTML');
} else {
  search.addEventListener('input', () => {
    const text = search.value.trim();
    echo.innerHTML = `You typed: <strong>${text || '(nothing yet)'}</strong>`;
      const q = text.toLowerCase();
  const filtered = ALL_BREEDS.filter(breed =>
    breed.name.toLowerCase().includes(q)
  );
  renderBreeds(filtered);
  setStatus(`Showing ${filtered.length} of ${ALL_BREEDS.length} breeds`);
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

function renderBreeds(breeds) {
  grid.innerHTML = "";
  if (!breeds.length) {
    setStatus("No breeds found.");
    return;
  }

  const html = breeds.map(b => {
    // some breeds have b.image?.url, some don't
    const imgUrl = b.image && b.image.url ? b.image.url : "https://via.placeholder.com/400x250?text=No+Image";
    const temperament = b.temperament ? b.temperament.split(',').slice(0, 3).join(', ') : "Temperament: n/a";

    return `
      <article class="dog-card">
        <img src="${imgUrl}" alt="${b.name}" class="dog-card-img">
        <div class="dog-card-body">
          <h3 class="dog-card-title">${b.name}</h3>
          <p class="dog-card-meta">${temperament}</p>
        </div>
      </article>
    `;
  }).join("");

  grid.innerHTML = html;
}



// run once when the page loads
(async function loadBreeds() {
  try {
    setStatus("Loading breeds…");
    const breeds = await fetchBreeds();
    ALL_BREEDS = breeds; // <-- save for later filtering
    renderBreeds(ALL_BREEDS);
    setStatus(`Loaded ${breeds.length} breeds.`);
  } catch (err) {
    console.error(err);
    setStatus("Failed to load breeds. Check your API key and try again.");
  }
})();


