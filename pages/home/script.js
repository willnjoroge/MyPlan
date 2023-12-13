const account = JSON.parse(window.localStorage.getItem("account"));
const dashboardObjs = JSON.parse(window.localStorage.getItem("objectives"));
const slidesContainer = document.querySelector(".slides");
const tilesContainer = document.querySelector(".tiles");
const title = document.querySelector(".title");

let activeSlide = 0;

updateName();
updateDashboard();

function updateName() {
  title.innerText = `Welcome ${account.name}`;
}

function updateDashboard() {
  if (dashboardObjs) {
    createSlide("Year Objectives", "yObjs", dashboardObjs.yearObjs, true);
    createSlide("Month Objectives", "mObjs", dashboardObjs.monthObjs);
    createSlide("Week Objectives", "wObjs", dashboardObjs.weekObjs);
    createTile("Year Objectives", "yObjs", true);
    createTile("Month Objectives", "mObjs");
    createTile("Week Objectives", "wObjs");
  }
}

function createSlide(title, type, objectives = [""], active = false) {
  const slide = document.createElement("div");
  slide.classList.add("slide");
  slide.classList.add(type);
  if (active) {
    slide.classList.add("active");
    slide.style.height = "100px";
  } else {
    slide.style.visibility = "hidden";
    slide.style.height = "0";
  }

  const objTitle = document.createElement("h2");
  objTitle.innerText = title;

  slide.appendChild(objTitle);

  objectives.forEach((obj) => {
    const text = document.createElement("span");
    text.innerHTML = `${obj} <hr>`;
    slide.appendChild(text);
  });

  slidesContainer.appendChild(slide);
}

function createTile(title, type, active = false) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  if (active) {
    tile.classList.add("active");
  }

  const objTitle = document.createElement("h4");
  objTitle.innerText = title;

  tile.appendChild(objTitle);

  tile.addEventListener("click", () => {
    setActiveSlide(type);
  });

  tilesContainer.appendChild(tile);
}

function setActiveSlide(type) {
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide) => {
    slide.classList.remove("active");
    slide.style.visibility = "hidden";
    slide.style.height = "0";
  });
  const slide = document.querySelector(`.${type}`);
  slide.classList.add("active");
  slide.style.visibility = "visible";
  slide.style.height = "100px";
}
