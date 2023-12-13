const addBtn = document.querySelectorAll(".btn");
const submitBtn = document.querySelector(".btn.submit");

const yearList = document.querySelector(".year-list");
const yearObjectives = document.querySelector(".objectives.year");
const monthList = document.querySelector(".month-list");
const monthObjectives = document.querySelector(".objectives.month");
const weekList = document.querySelector(".week-list");
const weekObjectives = document.querySelector(".objectives.week");

yearObjectives.querySelector(".btn.add").addEventListener("click", () => {
  addNewObjective(yearList);
});
monthObjectives.querySelector(".btn.add").addEventListener("click", () => {
  addNewObjective(monthList);
});
weekObjectives.querySelector(".btn.add").addEventListener("click", () => {
  addNewObjective(weekList);
});

let objectives = {};
submitBtn.addEventListener("click", () => updateStorage());

checkStorage();

function checkStorage() {
  if (window.localStorage.getItem("objectives")) {
    objectives = JSON.parse(window.localStorage.getItem("objectives"));
    objectives.yearObjs.forEach((obj) => addNewObjective(yearList, obj));
    objectives.monthObjs?.forEach((obj) => addNewObjective(monthList, obj));
    objectives.weekObjs?.forEach((obj) => addNewObjective(weekList, obj));
  }
}

function addNewObjective(list, text = "") {
  const objective = document.createElement("div");
  objective.classList.add("objective");

  objective.innerHTML = `
        <input type="text" />
        <button class="btn delete" id="delete">X</button>
        <button class="btn save" id="save">+</button>`;

  const input = objective.querySelector("input");
  const deleteBtn = objective.querySelector("#delete");
  const saveBtn = objective.querySelector("#save");

  input.addEventListener("keyup", () => {
    saveBtn.style.visibility = "visible";
  });

  deleteBtn.addEventListener("click", () => {
    input.remove();
    deleteBtn.remove();
    saveBtn.remove();
  });

  saveBtn.addEventListener("click", () => {
    saveBtn.remove();
    updateStorage();
  });

  input.value = text;
  list.appendChild(objective);
}

function compileObjectives() {
  const yearObjectives = document.querySelectorAll(
    ".year-list .objective input"
  );
  const monthObjectives = document.querySelectorAll(
    ".month-list .objective input"
  );
  const weekObjectives = document.querySelectorAll(
    ".week-list .objective input"
  );

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

  objectives = {
    yearObjs: yearObjs,
    monthObjs: monthObjs,
    weekObjs: weekObjs,
  };
}

function updateStorage() {
  compileObjectives();
  removeAddButtons();
  window.localStorage.setItem("objectives", JSON.stringify(objectives));
}

function removeAddButtons() {
  const visibleAddBtns = document.querySelectorAll(".btn.save");
  visibleAddBtns.forEach((btn) => btn.remove());
}
