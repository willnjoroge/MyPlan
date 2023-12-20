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
  const tile = document.createElement("button");
  tile.classList.add("tile");
  tile.classList.add(`${type}`);

  tile.innerText = title;

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
  const tiles = document.querySelectorAll(".tile");

  tiles.forEach((tile) => tile.classList.remove("active"));

  const newObjectives = findObjectives(type, date);
  createSlide(type, newObjectives);
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

function createSlide(type, objectives) {
  const slide = document.querySelector(".slide");
  slide.classList.add(type);

  slide.innerHTML = `
  <div class="slide-title ${type}">
    <h2>${setTitle(type)}</h2>

  </div>
  <div class="slide-content">
    <div class="subtitle-container">
      <button class="btn left"><i class="fa-solid fa-chevron-left"></i></button>
      <h3 class="subtitle">${objectives.subtitle}</h3>
      <button class="btn right"><i class="fa-solid fa-chevron-right"></i></button>
    </div>

    <div class="obj-actions">
      <div class="obj-container ${type}"></div>
      <button class="btn edit"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="btn save" hidden><i class="fa-solid fa-floppy-disk"></i></button>
    </div>
    
    <button class="btn add"><i class="fa-solid fa-plus"></i></button>
  </div>
  `;

  const objDiv = slide.querySelector(".obj-container");
  const editBtn = slide.querySelector(".edit");
  if (objectives.objs && objectives.objs.length > 0) {
    objectives.objs.forEach((obj) => {
      createObjective(obj.value, objDiv, obj.checked);
    });
  } else {
    editBtn.hidden = true;
  }

  addEventListeners(slide, type);
}

function createObjective(obj = "", objDiv, checked = false, enabled = false) {
  const objective = document.createElement("div");
  objective.classList.add("obj");
  objective.innerHTML = `
      <button class="btn check" ${enabled ? "hidden" : ""}><i class="${
    checked ? "fa-solid" : "fa-regular"
  } fa-circle-check fa-lg"></i></button>
      <input class="objective" ${enabled ? "" : "disabled"} type="text" />
      <button class="btn delete" ${
        enabled ? "" : "hidden"
      } id="delete"><i class="fa-solid fa-trash"></i></button>`;
  const objInput = objective.querySelector(".objective");
  objInput.value = obj;
  if (checked) {
    objInput.classList.add("checked");
  }

  if (enabled) {
    objInput.placeholder = "Type here...";
  }

  objDiv.appendChild(objective);

  const deleteBtn = objective.querySelector(".btn.delete");
  deleteBtn.addEventListener("click", () => {
    objective.remove();
  });

  const checkBtn = objective.querySelector(".btn i");
  checkBtn.addEventListener("click", () => {
    checkBtn.classList.toggle("fa-solid");
    checkBtn.classList.toggle("fa-regular");
    objInput.classList.toggle("checked");
    updateStorage();
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
    toggleEditing(true, slide, editBtn, saveBtn);
    createObjective("", objDiv, false, true);
  });

  leftBtn.addEventListener("click", () => {
    changeSlide("left");
  });

  rightBtn.addEventListener("click", () => {
    changeSlide("right");
  });
}

function toggleEditing(enable, slide, editBtn, saveBtn) {
  const deleteBtns = slide.querySelectorAll("button.delete");
  const inputs = slide.querySelectorAll("input");
  const checkBtns = slide.querySelectorAll("button.check");

  if (enable) {
    editBtn.hidden = true;
    saveBtn.hidden = false;
    inputs.forEach((input) => (input.disabled = false));
    deleteBtns.forEach((btn) => (btn.hidden = false));
    checkBtns.forEach((btn) => (btn.hidden = true));
  } else {
    editBtn.hidden = false;
    saveBtn.hidden = true;
    inputs.forEach((input) => (input.disabled = true));
    deleteBtns.forEach((btn) => (btn.hidden = true));
    checkBtns.forEach((btn) => (btn.hidden = false));
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
  const dirtyObjectives = document.querySelectorAll(`.${currentSlide} .obj`);
  dirtyObjectives.forEach((obj) => {
    const input = obj.querySelector("input");
    if (input.value.length > 0 && input.classList.contains("checked")) {
      updatedObjectives.push({ value: input.value, checked: true });
    } else if (input.value.length > 0) {
      updatedObjectives.push({ value: input.value, checked: false });
    } else {
      obj.remove();
      const editBtn = document.querySelector(".btn.edit");
      editBtn.remove();
    }
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
