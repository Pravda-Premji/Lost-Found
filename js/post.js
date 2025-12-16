// js/post.js

const form = document.getElementById("postForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1️⃣ Ensure user is logged in
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("You must login first!");
    return;
  }

  // 2️⃣ Read form values
  const title = form.title.value.trim();
  const desc = form.description.value.trim();
  const type = form.type.value;
  const location = form.location.value.trim();
  const contact = form.contact.value.trim();
  const file = form.image.files[0];

  // 3️⃣ Create tags from title + description
  const tags = (title + " " + desc)
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean)
    .slice(0, 15);

  let imageUrl = "";

  // 4️⃣ Upload image to Cloudinary
  try {
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "unsigned_present");
      data.append("folder", "lostfound/");

      const cloudName = "dblykjx2k";

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data
        }
      );

      const result = await res.json();
      imageUrl = result.secure_url;
    }
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    alert("Image upload failed!");
    return;
  }

  try {
    // 5️⃣ Save item to Firestore
    const docRef = await db.collection("items").add({
      title,
      description: desc,
      type,
      location,
      contact,
      imageUrl,
      tags,
      postedAt: Date.now(),
      uid: user.uid
    });

    // 6️⃣ Fetch new item
    const newItemSnap = await docRef.get();
    const newItem = { id: docRef.id, ...newItemSnap.data() };

    // 7️⃣ Fetch all items
    const allSnap = await db.collection("items").get();
    const allItems = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 8️⃣ Find smart matches
    const matches = findMatches(newItem, allItems);

    // 9️⃣ Show result
    if (matches.length > 0) {
      alert(`🔔 Found ${matches.length} possible match(es)!`);

      if (confirm("View the best match now?")) {
        window.location = `item.html?id=${matches[0].id}`;
        return;
      }
    }

    alert("Posted successfully!");
    form.reset();
    window.location = "index.html";

  } catch (err) {
    console.error("Firestore error:", err);
    alert("Could not save item.");
  }
});


// =======================
// 🔥 B-PLUS SMART MATCHING
// =======================

function findMatches(newItem, allItems) {

  // ❌ Ignore useless words
  const STOP_WORDS = [
    "lost", "found", "near", "color", "blue", "black",
    "white", "small", "big", "red", "green"
  ];

  // 🔁 Normalize synonyms
  function normalize(tag) {
    tag = tag.toLowerCase();

    if (["phone", "mobile", "smartphone", "cell", "fone"].includes(tag)) return "phone";
    if (["wallet", "purse"].includes(tag)) return "wallet";
    if (["id", "idcard", "collegeid", "identity"].includes(tag)) return "idcard";
    if (["bag", "backpack", "handbag"].includes(tag)) return "bag";

    return tag;
  }

  // ✏️ Small typo tolerance
  function similar(a, b) {
    if (a === b) return true;
    if (a.length < 4 || b.length < 4) return false;
    return a.includes(b) || b.includes(a);
  }

  const newTags = (newItem.tags || [])
    .map(normalize)
    .filter(t => !STOP_WORDS.includes(t));

  const newLoc = (newItem.location || "").toLowerCase().trim();

  const matches = allItems
    .filter(it => it.id !== newItem.id && it.type !== newItem.type)
    .map(it => {

      const tags = (it.tags || [])
        .map(normalize)
        .filter(t => !STOP_WORDS.includes(t));

      let strongMatches = 0;

      newTags.forEach(nt => {
        tags.forEach(t => {
          if (similar(nt, t)) strongMatches++;
        });
      });

      // ❌ No object similarity → reject
      if (strongMatches === 0) return null;

      const itemLoc = (it.location || "").toLowerCase();
      const sameLocation =
        itemLoc.includes(newLoc) ||
        newLoc.includes(itemLoc);

      let score = strongMatches * 3;
      if (sameLocation) score += 1;

      const confidence = Math.min(100, score * 20);

      return { ...it, score, confidence };
    })
    .filter(Boolean)
    .filter(x => x.score >= 3)
    .sort((a, b) => b.score - a.score);

  return matches;
}
