// js/item.js

const detailsEl = document.getElementById("itemDetails");

// Get item ID from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

async function loadItem() {
  try {
    const doc = await db.collection("items").doc(itemId).get();

    if (!doc.exists) {
      detailsEl.innerHTML = "<p>Item not found.</p>";
      return;
    }

    const item = doc.data();
    const user = firebase.auth().currentUser;

    const isOwner = user && user.uid === item.uid;

    detailsEl.innerHTML = `
      <div class="item-card">
        <h2>${escapeHtml(item.title)}</h2>
        <div class="badge ${item.type}">${item.type}</div>

        ${item.imageUrl ? `<img src="${item.imageUrl}" class="big-img">` : ""}

        <p><strong>Description:</strong><br>${escapeHtml(item.description)}</p>
        <p><strong>Location:</strong> ${escapeHtml(item.location)}</p>

        <p><strong>Contact:</strong> 
          <span id="contactHidden">**********</span>
          <button id="revealBtn">Reveal</button>
        </p>

        <p><small>Posted: ${new Date(item.postedAt).toLocaleString()}</small></p>

        ${isOwner ? `
          <button onclick="window.location='edit.html?id=${itemId}'">Edit</button>
          <button id="deleteBtn">Delete</button>
        ` : ""}
      </div>
    `;

    // Reveal Contact Button
    document.getElementById("revealBtn").onclick = () => {
      document.getElementById("contactHidden").innerText = item.contact;
    };

    // Delete Button (only for owner)
    if (isOwner) {
      document.getElementById("deleteBtn").onclick = async () => {
        if (confirm("Delete this post?")) {
          await db.collection("items").doc(itemId).delete();
          alert("Item deleted");
          window.location = "myposts.html";
        }
      };
    }

  } catch (err) {
    console.error(err);
    detailsEl.innerHTML = "<p>Error loading item.</p>";
  }
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

firebase.auth().onAuthStateChanged(() => loadItem());
