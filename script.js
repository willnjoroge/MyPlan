const slidesContainer = document.querySelector(".slides");
const tilesContainer = document.querySelector(".tiles");

let currentSlide = "yearObjectives";
let currentDate = new Date();

function getWeekOfMonth(date) {
  let adjustedDate = date.getDate() + date.getDay();
  let prefixes = ["0", "1", "2", "3", "4", "5"];
  return parseInt(prefixes[0 | (adjustedDate / 7)]) + 1;
}

loadContent();

function loadContent() {
  createTiles("Year Objectives", "yearObjectives");
  createTiles("Month Objectives", "monthObjectives");
  createTiles("Week Objectives", "weekObjectives");
  setActiveSlide(currentSlide, currentDate);
}

function createTiles(title, type) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.classList.add(`${type}`);

  const objTitle = document.createElement("h4");
  objTitle.innerText = title;

  tile.appendChild(objTitle);

  tile.addEventListener("click", () => {
    const currentDate = new Date();

    setActiveSlide(type, currentDate);
  });

  tilesContainer.appendChild(tile);
}

function setTitle(type) {
  switch (type) {
    case "yearObjectives":
      return "Year Objectives";
    case "monthObjectives":
      return "Month Objectives";
    case "weekObjectives":
      return "Week Objectives";
  }
}

function getIndexChoice(type, date) {
  let index = "";
  switch (type) {
    case "yearObjectives":
      index = date.getFullYear();
      break;
    case "monthObjectives":
      index = date.toLocaleString("default", {
        month: "long",
        year: "2-digit",
      });
      break;
    case "weekObjectives":
      index =
        "Week " +
        getWeekOfMonth(date) +
        " - " +
        date.toLocaleString("default", {
          month: "long",
          year: "2-digit",
        });
      break;
  }
  return index;
}

function setActiveSlide(type, date) {
  const slide = document.querySelector(".slide");
  const tiles = document.querySelectorAll(".tile");
  if (slide) slide.remove();

  tiles.forEach((tile) => tile.classList.remove("active"));

  const newObjectives = findObjectives(type, date);
  createSlide(type, type, newObjectives);
  const tile = document.querySelector(`.tile.${type}`);
  tile.classList.add("active");
  currentSlide = type;
  currentDate = date;
}

function findObjectives(type, scope) {
  const index = getIndexChoice(type, scope);
  let objectives = [""];
  if (window.localStorage.getItem(type)) {
    objectives = JSON.parse(window.localStorage.getItem(type));
  }
  return { objs: objectives[index], subtitle: index };
}

function createSlide(title, type, objectives) {
  const slide = document.createElement("div");
  slide.classList.add("slide");
  slide.classList.add(type);

  slide.innerHTML = `
  <div class="slide-title ${type}">
    <h2>${setTitle(type)}</h2>
    <button class="edit">Edit</button>
    <button class="save" hidden>Save</button>
  </div>
  <div class="subtitle-container">
    <button class="btn left">Left</button>
    <h3 class="subtitle">${objectives.subtitle}</h3>
    <button class="btn right">Right</button>
  </div>

  <div class="obj-container ${type}"></div>
  <button class="btn add" hidden>Add Objective</button>
  `;

  const objDiv = slide.querySelector(".obj-container");
  if (objectives.objs) {
    objectives.objs.forEach((obj) => {
      createObjective(obj, objDiv);
    });
  } else {
    createObjective("Click Edit to add objective....", objDiv);
  }

  slidesContainer.appendChild(slide);

  addEventListeners(slide, type);
}

function createObjective(obj = "", objDiv, enabled = false) {
  const objective = document.createElement("div");
  objective.classList.add("obj");
  objective.innerHTML = `
      <input class="objective" ${enabled ? "" : "disabled"} type="text" />
      <button class="btn delete" ${
        enabled ? "" : "hidden"
      } id="delete">X</button>`;
  const objInput = objective.querySelector(".objective");
  objInput.value = obj;
  objDiv.appendChild(objective);

  const deleteBtn = objective.querySelector(".btn.delete");
  deleteBtn.addEventListener("click", () => {
    objective.remove();
  });
}

function addEventListeners(slide, type) {
  const editBtn = document.querySelector(`.${type} button.edit`);
  const saveBtn = document.querySelector(`.${type} button.save`);
  const addBtn = document.querySelector(`.${type} .add`);
  const leftBtn = document.querySelector(`.${type} .left`);
  const rightBtn = document.querySelector(`.${type} .right`);

  editBtn.addEventListener("click", () => {
    toggleEditing(true, slide, editBtn, saveBtn);
  });

  saveBtn.addEventListener("click", () => {
    toggleEditing(false, slide, editBtn, saveBtn);
    updateStorage();
  });

  addBtn.addEventListener("click", () => {
    const objDiv = slide.querySelector(`.${type}.obj-container`);
    console.log(objDiv);
    createObjective("", objDiv, true);
  });

  leftBtn.addEventListener("click", () => {
    changeSlide("left");
  });

  rightBtn.addEventListener("click", () => {
    changeSlide("right");
  });
}

function toggleEditing(enable, slide, editBtn, saveBtn) {
  const addBtns = slide.querySelectorAll("button.add");
  const deleteBtns = slide.querySelectorAll("button.delete");
  const inputs = slide.querySelectorAll("input");

  if (enable) {
    slide.classList.add("editing");
    editBtn.hidden = true;
    saveBtn.hidden = false;
    inputs.forEach((input) => (input.disabled = false));
    addBtns.forEach((btn) => (btn.hidden = false));
    deleteBtns.forEach((btn) => (btn.hidden = false));
  } else {
    slide.classList.remove("editing");
    editBtn.hidden = false;
    saveBtn.hidden = true;
    inputs.forEach((input) => (input.disabled = true));
    addBtns.forEach((btn) => (btn.hidden = true));
    deleteBtns.forEach((btn) => (btn.hidden = true));
  }
}

function changeSlide(direction) {
  switch (currentSlide) {
    case "yearObjectives":
      if (direction === "left") {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
      } else {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
      break;
    case "monthObjectives":
      if (direction === "left") {
        currentDate.setMonth(currentDate.getMonth() - 1);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      break;
    case "weekObjectives":
      if (direction === "left") {
        currentDate.setDate(currentDate.getDate() - 7);
      } else {
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
  }
  setActiveSlide(currentSlide, currentDate);
}

function updateStorage() {
  let updatedObjectives = [];
  const dirtyObjectives = document.querySelectorAll(`.${currentSlide} input`);
  dirtyObjectives.forEach((obj) => {
    updatedObjectives.push(obj.value);
  });
  const currentStorage = JSON.parse(window.localStorage.getItem(currentSlide));
  const title = document.querySelector(".subtitle");
  let updatedStorage;
  if (currentStorage) {
    currentStorage[title.innerText] = updatedObjectives;
    updatedStorage = currentStorage;
  } else {
    updatedStorage = {};
    updatedStorage[title.innerText] = updatedObjectives;
  }
  window.localStorage.setItem(currentSlide, JSON.stringify(updatedStorage));
}
