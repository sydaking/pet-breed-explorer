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
