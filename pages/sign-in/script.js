const authAccount = JSON.parse(window.localStorage.getItem("account"));
const submitBtn = document.querySelector(".submit");

submitBtn.addEventListener("click", () => {
  if (validate() && confirm()) {
    window.location.href = "/pages/home/home.html";
  } else {
    window.location.href = "/pages/welcome/welcome.html";
  }
});

function validateInputs() {
  const inputs = document.querySelectorAll("input");
  let valid = false;
  inputs.forEach((input) => {
    if (input.value === "") {
      valid = false;
    } else {
      valid = true;
    }
  });

  if (valid) {
    return true;
  } else {
    alert("Please fill all fields");
    return false;
  }
}

function validatePasswords(pw, confirmPw) {
  if (pw.value === confirmPw.value) {
    return true;
  } else {
    alert("Passwords don't match");
    return false;
  }
}

function validate() {
  const pw = document.getElementById("pw");
  const confirmPw = document.getElementById("confirmPw");
  if (validateInputs() && validatePasswords(pw, confirmPw)) {
    return true;
  }
  return false;
}

function confirm() {
  const username = document.getElementById("username");
  const pw = document.getElementById("pw");

  if (authAccount.username === username.value && authAccount.pw === pw.value) {
    window.localStorage.setItem("loggedIn", "true");
    return true;
  }
  alert("Account cannot be found");
  return false;
}
