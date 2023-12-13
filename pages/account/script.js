const authAccount = JSON.parse(window.localStorage.getItem("account"));
const username = document.getElementById("username");
const nameInput = document.getElementById("name");
const logOutBtn = document.querySelector(".btn.log-out");
const changePwBtn = document.querySelector(".btn.change-pw");
const validateBtn = document.querySelector(".btn.validate");
const updateBtn = document.querySelector(".btn.update");
const pwConfirmForm = document.querySelector(".pw-confirm-form");
const pwChangeForm = document.querySelector(".pw-new-form");

username.value = authAccount.username;
nameInput.value = authAccount.name;

changePwBtn.addEventListener("click", () => {
  changePwBtn.remove();
  pwConfirmForm.style.visibility = "visible";
  pwConfirmForm.style.height = "auto";
});

validateBtn.addEventListener("click", () => {
  const pw = document.getElementById("pw");
  const confirmPw = document.getElementById("confirmPw");

  if (
    authAccount.pw === pw.value &&
    validatePasswords(pw.value, confirmPw.value)
  ) {
    pwChangeForm.style.visibility = "visible";
    pwChangeForm.style.height = "auto";
    validateBtn.remove();
  }
});

updateBtn.addEventListener("click", () => {
  const pw = document.getElementById("newPw");
  const confirmPw = document.getElementById("newConfirmPw");

  if (validatePasswords(pw.value, confirmPw.value)) {
    pwConfirmForm.style.visibility = "hidden";
    pwConfirmForm.style.height = "0px";
    pwChangeForm.style.visibility = "hidden";
    pwChangeForm.style.height = "0px";
    updateBtn.remove();
    authAccount.pw = pw.value;
    window.localStorage.setItem("account", JSON.stringify(authAccount));
  }
});

logOutBtn.addEventListener("click", () => {
  logOut();
});

function validatePasswords(pw, confirmPw) {
  if (pw.value === confirmPw.value) {
    return true;
  } else {
    alert("Passwords don't match");
    return false;
  }
}

function confirm() {
  const pw = document.getElementById("pw");
  if (authAccount.pw === pw.value) {
    return true;
  }
  alert("Account cannot be found");
  return false;
}

function logOut() {
  window.location.href = "/pages/welcome/welcome.html";
  window.localStorage.removeItem("loggedIn");
}
