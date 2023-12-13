const signUpOption = document.querySelector(".option.sign-up");
const loginOption = document.querySelector(".option.home");

signUpOption.addEventListener("click", () => {
  const route = "../../pages/sign-up/sign-up.html";
  window.location.href = route;
});

loginOption.addEventListener("click", () => {
  const route = "../../pages/sign-in/sign-in.html";
  window.location.href = route;
});
