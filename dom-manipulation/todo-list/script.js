const todo_input = document.getElementById("todo_input");
const add_todo_btn = document.getElementById("add_todo_btn");
const todo_container = document.getElementById("todo_container");

let todo_list = [];
let todo_list_str = localStorage.getItem("todo_list");

if (!todo_list_str) {
  todo_list = [];
} else {
  todo_list = todo_list_str.split(",");
  for (let i = 0; i < todo_list.length; i++) {
    createCard(i, todo_list[i]);
  }
}

if (!todo_input || !add_todo_btn || !todo_container) {
  console.error("Something is missing");
}

function deleteElement(id) {
  document.getElementById(id).remove();
  todo_list.splice(id, 1);
  localStorage.setItem("todo_list", todo_list.join(","));
  console.log(localStorage.getItem("todo_list"));
}

function createCard(id, title) {
  const cardEl = document.createElement("div");
  const cardBodyEl = document.createElement("div");
  const cardTitleEl = document.createElement("h5");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  const markBtn = document.createElement("button");

  cardEl.id = id;
  cardEl.classList.add("card");
  cardBodyEl.classList.add("card-body");
  cardTitleEl.classList.add("card-title");

  editBtn.innerText = "Edit";
  deleteBtn.innerText = "Delete";
  markBtn.innerText = "[ ]";

  deleteBtn.onclick = () => deleteElement(id);

  cardBodyEl.appendChild(editBtn);
  cardBodyEl.appendChild(deleteBtn);
  cardBodyEl.appendChild(markBtn);

  cardTitleEl.innerText = title;

  cardBodyEl.appendChild(cardTitleEl);
  cardEl.appendChild(cardBodyEl);
  todo_container.appendChild(cardEl);
}

function add_todo() {
  if (todo_input.value.trim().length === 0) {
    alert("Enter todo");
    return;
  }
  todo_list.push(todo_input.value);

  createCard(todo_input.value);

  todo_input.value = "";

  localStorage.setItem("todo_list", todo_list.join(","));

  console.log(localStorage.getItem("todo_list"));
}

add_todo_btn.onclick = add_todo;

todo_input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    add_todo();
  }
});
