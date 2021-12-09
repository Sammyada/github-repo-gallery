// where my profile information will appear
const overview = document.querySelector(".overview");
const username = "sammyada";
const repoList = document.querySelector(".repo-list");
const allRepos = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const repoButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

// fetch api json data
const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    userDisplayInfo(data);
};

gitUserInfo();

// fetch and display my information
const userDisplayInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
  <figure>
     <img alt="user avatar" src=${data.avatar_url} />
   </figure>
   <div>
     <p><strong>Name:</strong> ${data.name}</p>
     <p><strong>Bio:</strong> ${data.bio}</p>
     <p><strong>Location:</strong> ${data.location}</p>
     <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
   </div>
  `;

  overview.append(div);
  gitRepos(username);
};

// fetch repos
const gitRepos = async function (username) {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  displayRepos(repoData);
};

// display repos
const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    retrieveInfo(repoName);
  }
});

const retrieveInfo = async function (repoName) {
  const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();

    // fetch languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

// Make a list of languages
  const languages = [];
  for (const language in languageData) {
  languages.push(language);
}
displayRepoInfo(repoInfo, languages);
};

// display specific repos
const displayRepoInfo = function (repoInfo, languages) {
  repoButton.classList.remove("hide");
  repoData.innerHTML = "";
  repoData.classList.remove("hide");
  allRepos.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
   `;
   repoData.append(div);
};

repoButton.addEventListener("click", function() {
  allRepos.classList.remove("hide");
  repoData.classList.add("hide");
  repoButton.classList.add("hide");
});

// search
filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const searchLowerText = searchText.toLowerCase();

  for (const repo of repos) {
    const repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(searchLowerText)) {
    } else {
      repo.classList.add("hide");
    }
  }
});
