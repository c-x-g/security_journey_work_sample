const app = document.getElementById("app");
const usernames = ["Bob", "Alice"];

let username = "";
let hasAppended = false;
let loginText = "Please login";

function render() {
  username = localStorage.getItem("username");
  if (username && usernames.includes(username)) {
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
    localStorage.setItem("username", name);
    render();
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
  const url = window.location.origin;
  fetch(`${url}/documents?name=${username}`).then((res) => {
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
