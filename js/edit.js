// js/edit.js
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

const form = document.getElementById("editForm");
let existingImageUrl = "";
let originalUID = "";

async function loadPost() {
  const doc = await db.collection("items").doc(postId).get();

  if (!doc.exists) {
    alert("Post not found!");
    return;
  }

  const item = doc.data();

  // Save for later
  existingImageUrl = item.imageUrl || "";
  originalUID = item.uid;

  // Fill form
  form.title.value = item.title;
  form.description.value = item.description;
  form.type.value = item.type;
  form.location.value = item.location;
  form.contact.value = item.contact;
}

loadPost();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = firebase.auth().currentUser;
  if (!user) return alert("Login required");

  // Prevent others from editing
  if (user.uid !== originalUID) {
    return alert("You cannot edit someone else's post");
  }

  const file = form.image.files[0];
  let imageUrl = existingImageUrl;

  // If a new image was uploaded → send to Cloudinary
  if (file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_present");

    const res = await fetch("https://api.cloudinary.com/v1_1/dblykjx2k/image/upload", {
      method: "POST",
      body: data
    });

    const cloud = await res.json();
    imageUrl = cloud.secure_url;
  }

  await db.collection("items").doc(postId).update({
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    type: form.type.value,
    location: form.location.value.trim(),
    contact: form.contact.value.trim(),
    imageUrl
  });

  alert("Post updated!");
  window.location = "myposts.html";
});
