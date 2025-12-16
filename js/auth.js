const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut();
  });
}

firebase.auth().onAuthStateChanged(user => {
  const myPostsLink = document.getElementById('myPostsLink');
  
  if (user) {
    console.log("User logged in:", user.email);

    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (myPostsLink) myPostsLink.style.display = "inline";

  } else {
    console.log("User logged out");

    if (loginBtn) loginBtn.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (myPostsLink) myPostsLink.style.display = "none";
  }
});
