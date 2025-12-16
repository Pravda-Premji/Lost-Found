// js/myposts.js

const myPostsEl = document.getElementById('myPosts');

async function loadMyPosts() {
  const user = firebase.auth().currentUser;

  if (!user) {
    myPostsEl.innerHTML = "<p>Please login to see your posts.</p>";
    return;
  }

  myPostsEl.innerHTML = "<p>Loading your posts...</p>";

  try {
    // Firestore query that requires a composite index
    const snap = await db.collection("items")
      .where("uid", "==", user.uid)
      .orderBy("postedAt", "desc")
      .get();

    const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderMyPosts(items);

  } catch (err) {
    console.error("Failed to load my posts", err);
    myPostsEl.innerHTML = "<p>Error loading posts. Check console.</p>";
  }
}

function renderMyPosts(items) {
  myPostsEl.innerHTML = "";

  if (!items.length) {
    myPostsEl.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${escapeHtml(item.title)}</h3>
      <div class="badge ${item.type}">${item.type}</div>
      <p>${escapeHtml(item.description || "")}</p>
      ${item.imageUrl ? `<img src="${item.imageUrl}" class="thumb">` : ""}
      <p><small>${escapeHtml(item.location || "")}</small></p>

      <div style="margin-top: 8px;">
        <button class="btn-edit" data-id="${item.id}">Edit</button>
        <button class="btn-delete" data-id="${item.id}">Delete</button>
      </div>
    `;

    myPostsEl.appendChild(card);
  });

  // Delete post handler
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      if (!confirm("Delete this post?")) return;

      try {
        await db.collection("items").doc(id).delete();
        loadMyPosts(); // Refresh list
      } catch (err) {
        console.error("Delete failed", err);
        alert("Could not delete the item.");
      }
    };
  });
  // Edit Post handler
  document.querySelectorAll(".btn-edit").forEach(btn => {
  btn.onclick = () => {
    const id = btn.dataset.id;
    window.location = `edit.html?id=${id}`;
  };
});

}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

// Reload posts when login status changes
firebase.auth().onAuthStateChanged(user => {
  if (user) loadMyPosts();
  else myPostsEl.innerHTML = "<p>Please login to see your posts.</p>";
});
