// js/main.js

const itemsEl = document.getElementById("items");
const searchEl = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");

let itemsCache = [];

async function loadItems() {
  const snap = await db.collection("items")
    .orderBy("postedAt", "desc")
    .get();

  itemsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderItems(itemsCache);
}

function renderItems(items) {
  itemsEl.innerHTML = "";

  if (!items.length) {
    itemsEl.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach(it => {
    const card = document.createElement("div");
    card.className = "card clickable";

    card.innerHTML = `
      <h3>${it.title}</h3>
      <div class="badge ${it.type}">${it.type}</div>
      <p>${it.description}</p>
      ${it.imageUrl ? `<img src="${it.imageUrl}" class="thumb">` : ""}


      <p><small>${it.location}</small></p>
    `;

    // ✔ Make card clickable
    card.onclick = () => window.location = `item.html?id=${it.id}`;

    // ✔ ADD CARD TO PAGE (missing before)
    itemsEl.appendChild(card);
  });
}

searchEl.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);

function applyFilters() {
  const q = searchEl.value.toLowerCase();
  const t = typeFilter.value;

  const filtered = itemsCache.filter(it => {
    if (t !== "all" && it.type !== t) return false;

    const text =
      (it.title + " " + it.description + " " + it.location).toLowerCase();

    return text.includes(q);
  });

  renderItems(filtered);
}

loadItems();
