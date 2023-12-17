const yearObjectives = JSON.parse(
  window.localStorage.getItem("yearObjectives")
);
const monthObjectives = JSON.parse(
  window.localStorage.getItem("monthObjectives")
);
const weekObjectives = JSON.parse(
  window.localStorage.getItem("weekObjectives")
);

const slidesContainer = document.querySelector(".slides");
const tilesContainer = document.querySelector(".tiles");
const title = document.querySelector(".title");

updateDashboard();

function updateDashboard() {
  createSlide("Year Objectives", "yObjs", yearObjectives, true);
  createSlide("Month Objectives", "mObjs", monthObjectives);
  createSlide("Week Objectives", "wObjs", weekObjectives);
}

function createSlide(title, type, objectives = [""], active = false) {
  const slide = document.createElement("div");
  slide.classList.add("slide");
  slide.classList.add(type);
  if (active) {
    slide.classList.add("active");
    slide.style.height = "100%";
  } else {
    slide.style.visibility = "hidden";
    slide.style.height = "0";
  }

  slide.innerHTML = `
  <div class="slide-title ${type}">
    <h2>${title}</h2>
    <button class="edit">Edit</button>
    <button class="save" hidden>Save</button>
  </div>
  <div class="obj-container ${type}">
  </div>
  <button class="add" hidden>Add Objective</button>
  `;

  const objDiv = slide.querySelector(".obj-container");
  if (objectives) {
    objectives.forEach((obj) => {
      createObjective(obj, objDiv);
    });
  } else {
    createObjective("Insert objective here....", objDiv);
  }

  slidesContainer.appendChild(slide);

  addEventListeners(slide, type);
  createTile(title, type, active);
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
  addBtn.innerText;

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
}

function createTile(title, type, active = false) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.classList.add(`${type}`);
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

function setActiveSlide(type) {
  const slides = document.querySelectorAll(".slide");
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile) => tile.classList.remove("active"));
  slides.forEach((slide) => {
    slide.classList.remove("active");
    slide.style.visibility = "hidden";
    slide.style.height = "0";
  });
  const slide = document.querySelector(`.slide.${type}`);
  const tile = document.querySelector(`.tile.${type}`);
  tile.classList.add("active");
  slide.classList.add("active");

  slide.style.visibility = "visible";
  slide.style.height = "100%";
}

function updateStorage() {
  const yearObjectives = document.querySelectorAll(".yObjs input");
  const monthObjectives = document.querySelectorAll(".mObjs input");
  const weekObjectives = document.querySelectorAll(".wObjs input");

  let yearObjs = [];
  let monthObjs = [];
  let weekObjs = [];
  yearObjectives.forEach((obj) => {
    yearObjs.push(obj.value);
  });
  monthObjectives.forEach((obj) => {
    monthObjs.push(obj.value);
  });
  weekObjectives.forEach((obj) => {
    weekObjs.push(obj.value);
  });

  window.localStorage.setItem("yearObjectives", JSON.stringify(yearObjs));
  window.localStorage.setItem("monthObjectives", JSON.stringify(monthObjs));
  window.localStorage.setItem("weekObjectives", JSON.stringify(weekObjs));
}
