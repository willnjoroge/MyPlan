const submitBtn = document.querySelector(".submit");

submitBtn.addEventListener("click", () => {
  if (addAccountToStorage()) {
    window.location.href = "/pages/home/home.html";
  }
});

function addAccountToStorage() {
  const username = document.getElementById("username");
  const name = document.getElementById("name");
  const pw = document.getElementById("pw");
  const confirmPw = document.getElementById("confirmPw");

  if (validatePasswords(pw, confirmPw) && validateInputs()) {
    const account = {
      username: username.value,
      name: name.value,
      pw: pw.value,
    };
    window.localStorage.setItem("account", JSON.stringify(account));
    return true;
  }
  return false;
}

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
