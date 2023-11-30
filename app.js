import { v4 as uuid } from "https://jspm.dev/uuid";

function $(id) {
  return document.getElementById(id);
}

const tbody = $("tbody");
const form = $("form");
const date = $("date");
const listDate = $("list-date");
const searchField = $("s-name");
const filterField = $("filter");
const sort = $("sort");
const byDate = $("by-date");
const today = new Date().toISOString().slice(0, 10);
date.value = today;
// byDate.value = today;

/***************************
 * SEARCHING FUNCTIONALITY *
 ***************************/
searchField.addEventListener("input", function (e) {
  filterField.selectedIndex = 0;
  tbody.innerHTML = "";
  sort.selectedIndex = 0;
  byDate.value = "";
  const searchTerm = this.value;
  let no = 0;
  const tasks = getDataFromLocalStorage();
  tasks.forEach((task, index) => {
    if (task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      ++no;
      displayToUI(task, no);
    }
  });
});

/************************
 * FILTER FUNCTIONALITY *
 ************************/
filterField.addEventListener("change", function (e) {
  searchField.value = "";
  sort.selectedIndex = 0;
  tbody.innerHTML = "";
  byDate.value = "";
  const filterTerm = this.value;
  const tasks = getDataFromLocalStorage();
  switch (filterTerm) {
    case "all":
      let no1 = 0;
      tasks.forEach((task) => {
        ++no1;
        displayToUI(task, no1);
      });
      break;
    case "completed":
      let no2 = 0;
      tasks.forEach((task) => {
        if (task.status === "completed") {
          ++no2;
          displayToUI(task, no2);
        }
      });

      break;
    case "incomplete":
      let no3 = 0;
      tasks.forEach((task) => {
        if (task.status === "incomplete") {
          ++no3;
          displayToUI(task, no3);
        }
      });
      break;
    case "today":
      let no4 = 0;
      tasks.forEach((task) => {
        if (task.date === today) {
          ++no4;
          displayToUI(task, no4);
        }
      });
      break;
    case "high":
      let no5 = 0;
      tasks.forEach((task) => {
        if (task.priority === "high") {
          ++no5;
          displayToUI(task, no5);
        }
      });
      break;
    case "medium":
      let no6 = 0;
      tasks.forEach((task) => {
        if (task.priority === "medium") {
          ++no6;
          displayToUI(task, no6);
        }
      });
      break;
    case "low":
      let no7 = 0;
      tasks.forEach((task) => {
        if (task.priority === "low") {
          ++no7;
          displayToUI(task, no7);
        }
      });
      break;
  }
});

/*************************
 * SORTING FUNCTIONALITY *
 *************************/
sort.addEventListener("change", function (e) {
  filterField.selectedIndex = 0;
  searchField.value = "";
  byDate.value = "";
  tbody.innerHTML = "";
  const sortTerm = this.value;
  const tasks = getDataFromLocalStorage();
  if (sortTerm === "newest") {
    tasks.sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1;
      } else if (new Date(a.date) < new Date(b.date)) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    tasks.sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return 1;
      } else if (new Date(a.date) < new Date(b.date)) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  tasks.forEach((task, i) => {
    displayToUI(task, i + 1);
  });
});

/*************************
 * BY DATE FUNCTIONALITY *
 *************************/
byDate.addEventListener("change", function (e) {
  tbody.innerHTML = "";
  filterField.selectedIndex = 0;
  sort.selectedIndex = 0;
  searchField.value = "";
  const selectedDate = this.value;
  const tasks = getDataFromLocalStorage();
  let no = 0;
  console.log(selectedDate);
  if (selectedDate) {
    tasks.forEach((task) => {
      if (task.date === selectedDate) {
        ++no;
        displayToUI(task, no);
      }
    });
  } else {
    tasks.forEach((task) => {
      ++no;
      displayToUI(task, no);
    });
  }
});

/**************************
 * LOAD DATA OF WITH PAGE *
 **************************/
window.onload = load;
function load() {
  tbody.innerHTML = "";
  const tasks = getDataFromLocalStorage();
  tasks.forEach((task, index) => {
    displayToUI(task, index + 1);
  });
}

/***********************
 * TASK SUBMIT HANDLER *
 ***********************/
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = [...this.elements];
  const formData = {};
  let isValid = true;
  inputs.forEach((elem) => {
    if (elem.type !== "submit") {
      if (elem.value === "") {
        alert("please fill up the field with valid value");
        isValid = false;
        return;
      }
      // formData.status = "incomplete";
      formData[elem.name] = elem.value;
    }
  });
  console.log(formData);
  if (isValid) {
    formData.status = "incomplete";
    formData.id = uuid();
    const tasks = getDataFromLocalStorage();
    displayToUI(formData, tasks.length + 1);
    tasks.push(formData);
    setDataToLocalStorage(tasks);
    console.log(tasks);
    this.reset();
    date.value = today;
  }
});

/**********************
 * CHECKBOX FEATURES *
 **********************/
let selectedTask = [];
function selectFunc(e) {
  const tr = e.target.parentElement.parentElement;
  const id = tr.dataset.id;
  if (e.target.checked) {
    selectedTask.push(tr);
    bulkActionHandler();
  } else {
    const index = selectedTask.findIndex((tr) => tr.dataset.id === id);
    selectedTask.splice(index, 1);
    bulkActionHandler();
  }
}

const bulkAction = $("bulk-action");
function bulkActionHandler() {
  if (selectedTask.length) {
    bulkAction.style.display = "flex";
  } else {
    bulkAction.style.display = "none";
  }
}
const allSelect = $("all-select");
const checkboxes = document.getElementsByClassName("checkbox");
allSelect.addEventListener("change", function (e) {
  if (e.target.checked) {
    selectedTask = [];
    [...checkboxes].forEach((box) => {
      box.checked = true;
      selectedTask.push(box.parentElement.parentElement);
    });
    bulkActionHandler();
  } else {
    selectedTask = [];
    [...checkboxes].forEach((box) => {
      box.checked = false;
    });
    bulkActionHandler();
  }
});
///////////////////////////////////////////////////////
$("bulk-delete").addEventListener("click", function (e) {
  let tasks = getDataFromLocalStorage();
  selectedTask.forEach((tr) => {
    const id = tr.dataset.id;
    tasks = tasks.filter((task) => task.id !== id);
    tr.remove();
    bulkAction.style.display = "none";
  });
  setDataToLocalStorage(tasks);
});
//////////////////////////////////////////////////////
const bulkPriority = $("bulk-priority");
bulkPriority.addEventListener("change", function (e) {
  const selected = this.value;
  let tasks = getDataFromLocalStorage();
  selectedTask.forEach((tr) => {
    const id = tr.dataset.id;
    [...tr.children].forEach((td) => {
      if (td.id === "priority") {
        td.textContent = selected;
      }
    });
    tasks = tasks.filter((task) => {
      if (task.id === id) {
        task.priority = selected;
        return task;
      } else {
        return task;
      }
    });
  });
  setDataToLocalStorage(tasks);
});
/////////////////////////////////////////////
const bulkStatus = $("bulk-status");
bulkStatus.addEventListener("change", function (e) {
  const selected = this.value;
  let tasks = getDataFromLocalStorage();
  selectedTask.forEach((tr) => {
    const id = tr.dataset.id;
    [...tr.children].forEach((td) => {
      if (td.id === "status") {
        td.textContent = selected;
      }
    });
    tasks = tasks.filter((task) => {
      if (task.id === id) {
        task.status = selected;
        return task;
      } else {
        return task;
      }
    });
  });
  setDataToLocalStorage(tasks);
});
//////////////////////////////////////

const editInp = $("edit-inp");
const editSel = $("edit-sel");
editSel.addEventListener("change", function (e) {
  console.log(this.value);
  if (this.value === "name") {
    editInp.type = "text";
    editInp.value = "";
  } else {
    editInp.type = "date";
    editInp.value = "";
  }
});
editInp.addEventListener("input", function (e) {
  if (this.type === "text") {
    const modifiedName = this.value;
    let tasks = getDataFromLocalStorage();
    selectedTask.forEach((tr) => {
      const id = tr.dataset.id;
      [...tr.children].forEach((td) => {
        if (td.id === "name") {
          td.textContent = modifiedName;
        }
      });
      tasks = tasks.filter((task) => {
        if (task.id === id) {
          task.name = modifiedName;
          return task;
        } else {
          return task;
        }
      });
    });
    setDataToLocalStorage(tasks);
  } else {
    const modifiedDate = this.value;
    let tasks = getDataFromLocalStorage();
    selectedTask.forEach((tr) => {
      const id = tr.dataset.id;
      [...tr.children].forEach((td) => {
        if (td.id === "list-date") {
          td.textContent = modifiedDate;
        }
      });
      tasks = tasks.filter((task) => {
        if (task.id === id) {
          task.date = modifiedDate;
          return task;
        } else {
          return task;
        }
      });
    });
    setDataToLocalStorage(tasks);
  }
});

$("dismiss").addEventListener("click", function (e) {
  bulkAction.style.display = "none";
  selectedTask = [];
  [...checkboxes].forEach((box) => {
    box.checked = false;
    allSelect.checked = false;
  });
  bulkPriority.selectedIndex = 0;
  bulkStatus.selectedIndex = 0;
  editInp.value = "";
  editSel.selectedIndex = 0;
  editInp.type = "text";
});

/**************************
 * SHOW DATA IN TASK LIST *
 **************************/
function displayToUI({ name, priority, status, date, id }, index) {
  const tr = document.createElement("tr");
  const check = document.createElement("input");
  check.type = "checkbox";
  check.value = id;
  check.className = "checkbox";
  check.addEventListener("change", selectFunc);

  tr.innerHTML = `
    <td id="check"></td>
    <td id="no">${index}</td>
    <td id="name">${name}</td>
    <td id="priority">${priority}</td>
    <td id="status">${status}</td>
    <td id="list-date">${date}</td>
    <td id="action-btn">
      <button id="delete">
        <i class="delete-icon ri-delete-bin-2-line"></i>
      </button>
      <button id="check">
        <i class="check-icon ri-checkbox-line"></i>
      </button>
      <button id="edit">
        <i class="edit-icon ri-edit-box-line"></i>
      </button>
      
    </td>`;

  tr.dataset.id = id;
  tr.firstElementChild.appendChild(check);
  tbody.appendChild(tr);
}

/******************************
 * GET DATA FROM LOCAL STORAGE *
 ******************************/
function getDataFromLocalStorage() {
  let tasks = [];
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
  return tasks;
}

/*****************************
 * SET DATA TO LOCAL STORAGE *
 *****************************/
function setDataToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/***************************
 * ACTION BUTTON CONDITION *
 ***************************/
tbody.addEventListener("click", (e) => {
  /*****************
   * DELETE BUTTON *
   *****************/
  if (e.target.id === "delete") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    tr.remove();
    let tasks = getDataFromLocalStorage();
    tasks = tasks.filter((task) => {
      if (task.id !== id) {
        return task;
      }
    });

    setDataToLocalStorage(tasks);
    load();

    /****************
     * CHECK BUTTON *
     ****************/
  } else if (e.target.id === "check") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    const tds = tr.children;

    [...tds].forEach((td) => {
      if (td.id === "status") {
        let tasks = getDataFromLocalStorage();
        tasks = tasks.filter((task) => {
          if (task.id === id) {
            if (task.status === "incomplete") {
              td.textContent = "completed";
              task.status = "completed";
            } else {
              td.textContent = "incomplete";
              task.status = "incomplete";
            }
            return task;
          } else {
            return task;
          }
        });
        setDataToLocalStorage(tasks);
      }
    });
    /***************
     * EDIT BUTTON *
     ***************/
  } else if (e.target.id === "edit") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    const tds = tr.children;

    let nameTd;
    let newNameField;

    let priorityTd;
    let prioritySelect;

    let dateTd;
    let dateInputField;

    [...tds].forEach((td) => {
      // name condition
      if (td.id === "name") {
        nameTd = td;

        const preName = td.textContent;
        td.innerHTML = "";
        newNameField = document.createElement("input");
        newNameField.type = "text";
        newNameField.value = preName;
        td.appendChild(newNameField);
        // priority condition
      } else if (td.id === "priority") {
        priorityTd = td;
        const prePriority = td.textContent;
        td.innerHTML = "";
        prioritySelect = document.createElement("select");
        prioritySelect.innerHTML = `
          <option value="" disabled>Select one</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>`;

        if (prePriority === "high") {
          prioritySelect.selectedIndex = 1;
        } else if (prePriority === "medium") {
          prioritySelect.selectedIndex = 2;
        } else if (prePriority === "low") {
          prioritySelect.selectedIndex = 3;
        }
        // prioritySelect.value = prePriority;
        td.appendChild(prioritySelect);
        // list-date condition
      } else if (td.id === "list-date") {
        dateTd = td;
        const preDate = td.textContent;
        td.innerHTML = "";
        dateInputField = document.createElement("input");
        dateInputField.type = "date";
        dateInputField.value = preDate;
        td.appendChild(dateInputField);
        // action-btn condition
      } else if (td.id === "action-btn") {
        const preBtn = td.innerHTML;
        td.innerHTML = "";
        const saveBtn = document.createElement("button");
        saveBtn.innerHTML = `<i class="ri-save-line save-btn" ></i>`;
        saveBtn.addEventListener("click", function () {
          // name
          const newName = newNameField.value;
          nameTd.innerHTML = newName;

          // priority
          const newPriority = prioritySelect.value;
          priorityTd.innerHTML = newPriority;
          // list-date
          const newDate = dateInputField.value;
          dateTd.innerHTML = newDate;
          // save modified task info to local storage
          let tasks = getDataFromLocalStorage();
          tasks = tasks.filter((task) => {
            if (task.id === id) {
              task.name = newName;
              task.priority = newPriority;
              task.date = newDate;
              return task;
            } else {
              return task;
            }
          });
          setDataToLocalStorage(tasks);
          td.innerHTML = preBtn;
        });
        td.appendChild(saveBtn);
      }
    });
  }
});
