const loggedIn = window.localStorage.getItem("loggedIn");
const btn = document.querySelector("button");

if (loggedIn) {
  window.location.href = "pages/home/home.html";
}

btn.addEventListener("click", () => {
  console.log("ehllo");
  window.location.href = "pages/welcome/welcome.html";
});
