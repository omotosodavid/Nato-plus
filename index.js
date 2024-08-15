const ts = 1701689634218;
const publicKey = "02e1f0a2d49b93ccbd50739d6b726c5c";
const hash = "e0d6a8e188272e010b434feb7a1444cb";
const API_BASE_URL = `https://gateway.marvel.com/v1/public`;
const COMICS_ENDPOINT = `${API_BASE_URL}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
const SERIES_ENDPOINT = `${API_BASE_URL}/series?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

// getting DOM element
const animeContainer = document.querySelector(".anime-content>section");
const comicContent = document.querySelector(".comic-content");
const HEAD = document.head;
const animeLoader = document.querySelector(".anime-loader");
const animeImageLoader = document.querySelector(".anime-intro-loader");
let hiddenH1 = document.querySelector(".hidden");
const comicLoader = document.querySelector(".comic-loader");
const series = document.querySelector(".series");
const readerContent = document.querySelector(".readerContent");
const itemsRoot = document.querySelector(".items-root");
const itemsContainer = document.querySelector(".items-container");
const selectVariants = document.getElementById("variants");
const selectStories = document.getElementById("stories");
const itemHeading = document.getElementById("read-heading");

// Declaring empty variable to be used later
let html = "";
let content = "";

// Store a list of images in an array into a variable
const thumbnails = [
  { path: "./assets/Image-Not-Found-1", extension: "webp" },
  { path: "./assets/Image-Not-Found-2", extension: "webp" },
  { path: "./assets/Image-Not-Found-3", extension: "webp" },
  { path: "./assets/Image-Not-Found-4", extension: "webp" },
  { path: "./assets/Image-Not-Found-5", extension: "webp" },
  { path: "./assets/Image-Not-Found-6", extension: "webp" },
  {
    path: "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available",
    extension: "jpg",
  },
];

// head function
const headContent = () => {
  HEAD.innerHTML += `
  <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Bootstrap cdn -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    <!-- Favicon (general) -->
    <link rel="shortcut icon" href="./assets/favicon.webp" type="image/x-icon">
    <!-- For normal desktop browsers -->
    <link rel="icon" type="image/png" href="./assets/favicon.webp">
    
    <!-- For Safari on macOS -->
    <link rel="apple-touch-icon" type="image/png" href="./assets/favicon.webp">
    
    <!-- For Android Chrome -->
    <link rel="icon" type="image/png" href="./assets/favicon.webp">
    
    <!-- For Windows -->
    <meta name="msapplication-TileImage" content="./assets/favicon.webp">
    <meta name="msapplication-TileColor" content="#ff7300">
  `;
};

// making dummy DOM element for loader
function dummyDomElements() {
  let elements = "";
  for (let i = 5; i > 0; i--) {
    elements += `
        <section>
          <div></div>
          <div></div>
        </section>
    `;
  }
  animeImageLoader.innerHTML += elements;
}

// Reload browser
const reload = () => {
  location.reload();
};

// hamburger function
const hamburger = () => {
  let menu = document.querySelector(".bi-list-nested");
  let nav = document.querySelector("nav>ul");
  menu.addEventListener("click", (e) => {
    nav.classList.toggle("show");
    nav.classList == "show"
      ? (e.target.classList = "bi-x-circle")
      : (e.target.classList = "bi-list-nested");
  });
};

// looping through data.
const loopAnime = (parentComponent, src, heading, id, classes, type) => {
  const { parent, figure, header } = classes;
  html += `
        <section  class="${parent}" id=${id}  onclick="saveInfo(id,'${type}')" data=${type}>
          <figure class="${figure}">
            <img src="${src.path}.${src.extension}" alt="${heading}" loading="lazy"/>
          </figure>
          <section class="${header}">
          ${heading}
          </section>
        </section>
        `;
  parentComponent.innerHTML = html;
};

// Saving id & location in session storage
const saveInfo = (id, pathname, item) => {
  sessionStorage.setItem("animeId", id);
  sessionStorage.setItem("type", pathname);
  if (item == "story") {
    sessionStorage.setItem("type", "stories");
  }
  window.location.href = `./readContent.html`;
};

// function for different page readStory
function diffStories(url, result) {
  let story = "";
  if (url.includes("comics")) {
    result.textObjects[0] === undefined
      ? (story = "No description found")
      : (story = result.textObjects[0].text);
  } else {
    story = "No description found";
  }
  return story;
}

// get variants from webpage
function getVariants(result) {
  let variants = "";
  result.variants == "" || result.variants === undefined
    ? (variants = "No variant available")
    : (variants = result.variants.map((item) => item.resourceURI));
  return variants;
}

function getStories(result) {
  let variedStories = "";
  result.stories === undefined || result.stories.items === undefined
    ? (variedStories = "No story available")
    : (variedStories = result.stories.items.map((item) => item.resourceURI));
  return variedStories;
}

// fetch variants
const fetchItems = async (rawUrl, identifyItem) => {
  let url = `${rawUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  const data = await fetch(url);
  const response = await data.json();
  let result = response.data.results[0];
  let { title, thumbnail, id } = result;
  const classes = {
    parent: "item",
    figure: "item-image",
    header: "item-desc",
  };
  if (thumbnail === null) {
    let imgLength = Math.floor(Math.random() * thumbnails.length);
    thumbnail = thumbnails[imgLength];
  }
  let receivedType = sessionStorage.getItem("type");
  sessionStorage.setItem(
    "dataToBeTransferred",
    loopComic(
      itemsContainer,
      thumbnail,
      title,
      id,
      classes,
      identifyItem,
      receivedType
    )
  );
};

// making a function for readComic content
function readComicContent(content, title, participant, story) {
  document.title = `${title} | Story`;
  content.innerHTML += `
    <section>
      <h2>${title}</h2>
      </section>
      <section class="creators">
      ${participant}
      </section>
      <section class="story">
        ${story}
      </section>
    </section>
  `;
}

// fetching data for top five comics
const topAnime = async () => {
  try {
    const data = await fetch(COMICS_ENDPOINT);
    const response = await data.json();
    const outcomes = response.data.results;
    const slicedOutcomes = outcomes.slice(1, 6);

    // remove a class and loader from DOM
    animeLoader.remove();
    hiddenH1.classList.remove("hidden");

    const classes = {
      parent: "anime-intro",
      figure: "action-figure",
      header: "comic-desc",
    };

    slicedOutcomes.forEach((outcome) => {
      const { title, thumbnail, id } = outcome;
      loopAnime(animeContainer, thumbnail, title, id, classes, "comic");
    });
  } catch {
    let anime = document.querySelector(".anime-content");
    animeLoader.remove();
    anime.className = "err-img";
    anime.innerHTML = `
    <h1 style="color:red;text-align:center;font-size:3em">
      Check internet connection.<p onClick=reload()>Reload</p>
    </h1>`;
  }
};

// function for change in selectVariants
function changeInSelectVariants(variants, stories) {
  selectVariants.addEventListener("change", () => {
    isSelectvariantsOrSelectStoriesSelected(variants, stories);
  });
}
// function for change in selectStories
function changeInSelectStories(variants, stories) {
  selectStories.addEventListener("change", () => {
    isSelectvariantsOrSelectStoriesSelected(variants, stories);
  });
}
// function to eliminate elements
function EliElems(input) {
  input.forEach((elem) => {
    elem.remove();
  });
}

// a function to check if selectStories or selectVariant checkbox is selected
function isSelectvariantsOrSelectStoriesSelected(variants, stories) {
  let recievedData = sessionStorage.getItem("dataToBeTransferred");
  if (selectVariants.checked === false && selectStories.checked === false) {
    itemsContainer.innerHTML = `<h1 style="padding:2em 0;color:#1f1f1f;text-align:center;font-size:3em">No variant or story available. Toggle the checkboxes above</h1>`;

    itemHeading.textContent = "";
  } else if (
    selectVariants.checked === true &&
    selectStories.checked === false
  ) {
    itemHeading.textContent = "View Variants";
    if (variants == "No variant available") {
      itemsContainer.innerHTML = `<h1 style="padding:2em 0;color:#1f1f1f;text-align:center;font-size:3em">No variants available.</h1>`;
    } else {
      itemsContainer.innerHTML = recievedData;
    }
    EliElems(document.querySelectorAll('[data="story"]'));
  } else if (
    selectStories.checked === true &&
    selectVariants.checked === false
  ) {
    itemHeading.textContent = "View Stories";
    if (stories == "No story available") {
      itemsContainer.innerHTML = `<h1 style="padding:2em 0;color:#1f1f1f;text-align:center;font-size:3em">No stories available.</h1>`;
    } else {
      itemsContainer.innerHTML = recievedData;
    }
    EliElems(document.querySelectorAll('[data="variant"]'));
  } else {
    itemHeading.textContent = "View Variants and Stories";
    itemsContainer.innerHTML = recievedData;
  }
}

// a function to check if stories or variant aren't empty what do to display
const isVariantsOrStoriesValid = (variants, stories) => {
  if (variants !== "No variant available" && stories !== "No story available") {
    itemHeading.textContent = "View Variants and Stories";
    selectVariants.checked = true;
    selectStories.checked = true;
    mapItems(variants);
    mapItems(stories);
  } else if (stories !== "No story available") {
    itemHeading.textContent = "View Stories";
    selectStories.checked = true;
    mapItems(stories);
  } else if (variants !== "No variant available") {
    itemHeading.textContent = "View Variants";
    selectVariants.checked = true;
    mapItems(variants);
  } else {
    itemsContainer.innerHTML = `<h1 style="padding:2em 0;color:#1f1f1f;text-align:center;font-size:3em">No variant or story available.</h1>`;
  }
};

const loopComic = (
  parentComponent,
  src,
  heading,
  id,
  classes,
  identifyItem,
  identifyType
) => {
  const { parent, figure, header } = classes;
  content += `
        <section class="${parent}" id="${id}" data="${identifyItem}" onclick="saveInfo(id, '${identifyType}','${identifyItem}')">
          <figure class="${figure}">
            <img src="${src.path}.${src.extension}" alt="${heading}" loading="lazy"/>
          </figure>
          <section class="${header}">
          ${heading}
          </section>
        </section>
        `;
  parentComponent.innerHTML = content;
  return parentComponent.innerHTML;
};

// Error message
function err() {
  let body = document.body;
  let header = document.querySelector(".header");
  header.remove();
  comicLoader.remove();
  body.classList.add("err-img");
  body.innerHTML = `
    <h1 style="color:red;text-align:center;font-size:3em">
      Check internet connection.<p onclick=reload()>Reload</p>
    </h1>
  `;
}

// fetching data for 20 comics
const allComic = async (url) => {
  try {
    const data = await fetch(url);
    const response = await data.json();
    const outcomes = response.data.results;

    // remove loader from DOM
    comicLoader.remove();

    const classes = {
      parent: "comic-intro",
      figure: "comic-image",
      header: "comic-desc",
    };
    outcomes.forEach((outcome) => {
      const { title, thumbnail, id } = outcome;
      if (comicContent !== null) {
        loopComic(comicContent, thumbnail, title, id, classes, "", "comic");
      } else {
        loopComic(series, thumbnail, title, id, classes, "", "series");
      }
    });
  } catch {
    err();
  }
};

// Validate if it is a comic or story url
const validateIfComicOrStory = () => {
  let receivedType = sessionStorage.getItem("type");
  return receivedType;
};

// Map out items
function mapItems(items) {
  let identifyItem = "";
  items.map((item) => {
    let newItem = `https${item.slice(4)}`;
    if (newItem.includes("comics")) {
      identifyItem = "variant";
    } else {
      identifyItem = "story";
    }
    fetchItems(newItem, identifyItem);
  });
}

const distributeImages = (img) => {
  let imgSrc = "";
  if (img == null) {
    let imgLength = Math.floor(Math.random() * thumbnails.length);
    let thumbnail = thumbnails[imgLength];
    imgSrc = `${thumbnail.path}.${thumbnail.extension}`;
  } else {
    imgSrc = `${img.path}.${img.extension}`;
  }
  return imgSrc;
};

// fetching individual comics
const getIndividualData = async () => {
  let indivComImg = document.getElementById("cover");
  try {
    // assigning variables to empty strings
    let participant = "";
    let INDIVIDUALURL = "";

    // getting id & location from session storage
    let retrivedId = sessionStorage.getItem("animeId");

    // validating which page to fetch data for
    // fetching api via id
    validateIfComicOrStory() == "comic"
      ? (INDIVIDUALURL = `${API_BASE_URL}/comics/${retrivedId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
      : validateIfComicOrStory() == "series"
      ? (INDIVIDUALURL = `${API_BASE_URL}/series/${retrivedId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
      : (INDIVIDUALURL = `${API_BASE_URL}/stories/${retrivedId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);

    const url = await fetch(INDIVIDUALURL);
    const output = await url.json();
    const result = output.data.results[0];

    // remove loader
    document.querySelector(".load").remove();

    // getting image
    let bg = document.querySelector(".body");

    //Assign imgSrc to an imageDistributor function
    let imgSrc = distributeImages(result.thumbnail);

    // Implementing images to background
    bg.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75),rgba(0,0,0,0.7)),url(${imgSrc})`;

    // getting  title
    let title = result.title;

    // attaching title and imgSrc to indivComImg
    indivComImg.innerHTML = `<img class="com-img" src="${imgSrc}" alt="${title}" loading="lazy" />`;

    // getting story
    let story = diffStories(INDIVIDUALURL, result);

    // getting creators
    let creators = result.creators.items;
    creators[0] == undefined
      ? (participant = `<section>No creators found</section>`)
      : getCreators();
    function getCreators() {
      creators.forEach((creator) => {
        participant += `<section>
      <h3>${creator.role}:</h3>
      <p>${creator.name}</p>
      </section>`;
      });
    }
    readComicContent(readerContent, title, participant, story);

    // Displaying items-root
    itemsRoot.style.display = "block";

    // Assign variables to functions
    let variants = getVariants(result);
    let stories = getStories(result);

    // calling subsidiary functions
    isVariantsOrStoriesValid(variants, stories);
    changeInSelectStories(variants, stories);
    changeInSelectVariants(variants, stories);
  } catch {
    document.querySelector(".load").textContent =
      "Unable to get data from api. Check your internet connection";
    itemsRoot.remove();
    document.title = "ERROR";
  }
};

// Fetching different data for different page
function diffData() {
  if (comicContent !== null) {
    allComic(COMICS_ENDPOINT);
  } else {
    allComic(SERIES_ENDPOINT);
  }
}

headContent();
hamburger();
getIndividualData();
diffData();
topAnime();
dummyDomElements();
