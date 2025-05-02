const app = document.getElementById("app");
const url = window.location.origin;

let username = "";
let hasAppended = false;
let loginText = "Please login";

function render() {
  username = localStorage.getItem("username");
  if (username && username !== "invalid") {
    app.innerHTML = `
          <h1>Welcome, ${username}!</h1>
          <button onclick="getDocument()">View Personal Information</button>
          <button onclick="logout()">Logout</button>
        `;
  } else {
    if (username)
      loginText = `${username} is not valid, please login with a valid username`;
    app.innerHTML = `
          <h1>${loginText}</h1>
          <input id="nameInput" placeholder="Enter your name" />
          <button onclick="login()">Login</button>
        `;
  }
}

function login() {
  const name = document.getElementById("nameInput").value.trim();
  if (name) {
    fetch(`${url}/user?name=${name}`).then((res) => {
      res.json().then((res) => {
        const { id } = res;
        if (id !== -1) {
          localStorage.setItem("username", name);
        } else {
          localStorage.setItem("username", "invalid");
        }
        render();
      });
    });
  }
}

function logout() {
  hasAppended = false;
  localStorage.removeItem("username");
  username = "";
  loginText = "Please login";
  render();
}

function getDocument() {
  if (hasAppended) return;
  hasAppended = true;
  fetch(`${url}/documents?name=${username}`).then((res) => {
  const token = localStorage.getItem("token");
  // pass token into the headers
  fetch(`${url}/documents?name=${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {

    res.json().then((res) => {
      Object.keys(res).forEach((key) => {
        const li = document.createElement("li");
        li.setAttribute("style", "list-style-type:none;");
        li.textContent = `${key}: ${res[key]}`;
        app.appendChild(li);
      });
    });
  });
}

render();
