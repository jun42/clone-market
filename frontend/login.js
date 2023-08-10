const form = document.querySelector("#login-form");

let accessToken = null;
const handleLoginForm = async function (event) {
  event.preventDefault();
  const loginData = new FormData(form);
  const sha256Password = sha256(loginData.get("password"));
  loginData.set("password", sha256Password);

  const res = await fetch("/login", {
    method: "POST",
    body: loginData,
  });
  const data = await res.json();
  accessToken = data.access_token;
  console.log(accessToken);

  if (res.status === 200) {
    alert("로그인에 성공했습니다.");
    const infoDiv = document.querySelector("#info");
    infoDiv.innerText = "로그인 되었습니다!!";
    const btn = document.createElement("button");
    btn.innerText = "상품 가져오기";
    btn.addEventListener("click", async () => {
      const res = await fetch("/items", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      console.log(data);
    });
    infoDiv.appendChild(btn);
  } else if (res.status === 401) {
    alert("id 혹은 password가 틀렸습니다.");
  }
};

form.addEventListener("submit", handleLoginForm);
