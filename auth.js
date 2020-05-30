let auth0;

const config = {
  domain: "rbi-demo.auth0.com",
  client_id: "tvAcXa6DM2BKHHj9uotlCjFs1h8NpvVE",
};

async function checkIfAuthenticated() {
  auth0 = await createAuth0Client(config);
  await handleRedirect();
  if (await auth0.isAuthenticated()) {
    displayAppForAuthenticatedUser(await auth0.getUser());
  } else {
    displayAppForUnauthenticatedUser();
  }
}

async function handleRedirect() {
  if (
    window.location.search.includes("code=") &&
    window.location.search.includes("state=")
  ) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }
}

async function login() {
  await auth0.loginWithRedirect({ redirect_uri: window.location.origin });
}

function logout() {
  auth0.logout({ returnTo: window.location.origin });
}

function displayAppForAuthenticatedUser(user) {
  placeholder.innerHTML = `<button onclick="logout()">Log Out</button>`;
  main.innerHTML = `
    <h2>Hello, ${user.email}!</h2>
    <img alt="${user.email}" src="${user.picture || "avatar.png"}"/>
  `;
}

function displayAppForUnauthenticatedUser() {
  placeholder.innerHTML = `<button onclick="login()">Log In</button>`;
  main.innerHTML = `
    <h2>Here's a Random Picture for a Random Person!</h2>
    <img alt="random" src="https://picsum.photos/300" />`;
}

checkIfAuthenticated();
