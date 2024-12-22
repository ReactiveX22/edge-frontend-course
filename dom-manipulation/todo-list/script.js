const wish_input = document.getElementById("wish_input");
const add_wish_btn = document.getElementById("add_wish_btn");
const wish_container = document.getElementById("wish_container");

let wish_list = [];

fetch("https://jsonplaceholder.typicode.com/todos/")
  .then((response) => response.json())
  .then((json) => {
    wish_list = json;

    const wish_list_str = localStorage.getItem("wish_list");
    if (!wish_list_str) {
      localStorage.setItem("wish_list", JSON.stringify(wish_list));
    } else {
      wish_list = JSON.parse(wish_list_str);
    }

    logWishList();

    wish_list.forEach((wish, index) => {
      createWishCard(index, wish.title, wish.completed);
    });
  })
  .catch((error) => {
    console.error("Error fetching wish list:", error);
  });

logWishList();

if (!wish_input || !add_wish_btn || !wish_container) {
  console.error("Something is missing");
}

function deleteWishElement(id) {
  document.getElementById(id).remove();
  wish_list.splice(id, 1);
  localStorage.setItem("wish_list", JSON.stringify(wish_list));
  logWishList();
}

function markWishFulfilled(id, checkbox) {
  const card = document.getElementById(id);
  wish_list[id].fulfilled = checkbox.checked;

  if (checkbox.checked) {
    card.style.textDecoration = "line-through";
    card.style.backgroundColor = "#d3f9d8";
  } else {
    card.style.textDecoration = "none";
    card.style.backgroundColor = "white";
  }

  fetch(`https://jsonplaceholder.typicode.com/todos/${wish_list[id].id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...wish_list[id],
      completed: checkbox.checked,
    }),
  })
    .then((response) => response.json())
    .then((updatedWish) => {
      console.log("Wish updated:", updatedWish);
    })
    .catch((error) => {
      console.error("Error updating wish:", error);
    });

  localStorage.setItem("wish_list", JSON.stringify(wish_list));
  logWishList();
}

function createWishCard(id, title, fulfilled = false) {
  const cardEl = document.createElement("div");
  const cardBodyEl = document.createElement("div");
  const cardTitleEl = document.createElement("h5");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  const markBtn = document.createElement("input");

  cardEl.id = id;
  cardEl.classList.add("card", "mb-3");
  cardBodyEl.classList.add("card-body", "d-flex", "align-items-center");
  cardTitleEl.classList.add("card-title", "me-3");

  editBtn.innerText = "Edit";
  editBtn.classList.add("btn", "btn-warning", "btn-sm", "me-2");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "me-2");
  markBtn.type = "checkbox";
  markBtn.classList.add("form-check-input", "me-3");

  if (fulfilled) {
    markBtn.checked = true;
    cardTitleEl.style.textDecoration = "line-through";
    cardEl.style.backgroundColor = "#d3f9d8";
  }

  editBtn.onclick = () => {
    const newTitle = prompt("Edit your wish:", title);
    if (newTitle && newTitle.trim() !== "") {
      cardTitleEl.innerText = newTitle;
      wish_list[id].title = newTitle;

      fetch(`https://jsonplaceholder.typicode.com/todos/${wish_list[id].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...wish_list[id],
          title: newTitle,
        }),
      })
        .then((response) => response.json())
        .then((updatedWish) => {
          console.log("Wish updated:", updatedWish);
        })
        .catch((error) => {
          console.error("Error updating wish:", error);
        });

      localStorage.setItem("wish_list", JSON.stringify(wish_list));
      logWishList();
    }
  };

  deleteBtn.onclick = () => deleteWishElement(id);

  markBtn.onclick = () => markWishFulfilled(id, markBtn);

  cardTitleEl.innerText = title;

  cardBodyEl.appendChild(markBtn);
  cardBodyEl.appendChild(cardTitleEl);
  cardBodyEl.appendChild(editBtn);
  cardBodyEl.appendChild(deleteBtn);

  cardEl.appendChild(cardBodyEl);
  wish_container.appendChild(cardEl);
}

function addWish() {
  if (wish_input.value.trim().length === 0) {
    alert("Please enter a wish.");
    return;
  }

  const newWish = {
    title: wish_input.value,
    fulfilled: false,
  };

  wish_list.push(newWish);
  createWishCard(wish_list.length - 1, newWish.title);

  wish_input.value = "";
  localStorage.setItem("wish_list", JSON.stringify(wish_list));
  logWishList();
}

add_wish_btn.onclick = addWish;

wish_input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addWish();
  }
});

function logWishList() {
  const wishListStr = localStorage.getItem("wish_list");

  if (!wishListStr) {
    console.log("No wishlist found in localStorage.");
    return;
  }

  const wishList = JSON.parse(wishListStr);

  console.log(wishList);
}
