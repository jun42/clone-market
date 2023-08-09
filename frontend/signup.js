const form = document.querySelector("#signup-form");

const checkSamePassword = function () {
  const signUpData = new FormData(form);
  const firstPassword = signUpData.get("password");
  const secondPassword = signUpData.get("password2");

  if (firstPassword === secondPassword) {
    return true;
  } else {
    return false;
  }
};

const handleSignUpForm = async function (event) {
  event.preventDefault();
  const signUpData = new FormData(form);
  const sha256Password = sha256(signUpData.get("password"));
  signUpData.set("password", sha256Password);

  const sha256Password2 = sha256(signUpData.get("password2"));
  signUpData.set("password2", sha256Password2);

  if (checkSamePassword()) {
    const res = await fetch("/signup", {
      method: "POST",
      body: signUpData,
    });

    const responseToJson = await res.json();
    console.log(responseToJson);
  } else {
    alert("비밀번호가 같지 않습니다.");
  }
};

form.addEventListener("submit", handleSignUpForm);
