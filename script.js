
// Getting the HTML elements we need
const searchBar = document.getElementById("recipe-search");
const submitButton = document.getElementById("submit");
const recipeCards = document.querySelectorAll(".recipe-card");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");

//Filters
const cuisineFilters = document.querySelectorAll("#cuisine-filters .chip");
const difficultyFilters = document.querySelectorAll("#difficulty-filters .chip");

//Favorites Section elements
const favCount = document.getElementById("fav-count");
const favouritesList = document.getElementById("favourites-list");
const favouritesEmpty = document.getElementById("favourites-empty");
const clearFavsBtn = document.getElementById("clear-favourites-btn");
const clearFiltersBtn = document.getElementById("clear-filters-btn");

//Tracking what the user has selected
let activeSearch = '';
let activeCuisine = 'all';
let activeDifficulty = 'all';

//Array to Store users favorites
let favourites = [];

// When a user clicks the submit button, an Event listener to track the search and filter
submitButton.addEventListener("click", () => {
  activeSearch = searchBar.value.trim().toLowerCase();
  applyFilters();
});

// When the User clicks Enter inside the search bar instead of submit
searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    activeSearch = searchBar.value.trim().toLowerCase();
    applyFilters();
  }
});

// Direct Live Search
searchBar.addEventListener("input", () => {
  activeSearch = searchBar.value.trim().toLowerCase();
  applyFilters();
});


// Filtering Using cuisineFilters
 cuisineFilters.forEach((chip) => {
  chip.addEventListener("click", () => {
    cuisineFilters.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
 
    activeCuisine = chip.getAttribute("data-filter");
    applyFilters();
  });
});

// Filtering using difficultyFilters

difficultyFilters.forEach((chip) => {
  chip.addEventListener("click", () => {
    difficultyFilters.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
 
    activeDifficulty = chip.getAttribute("data-difficulty");
    applyFilters();
  });
});
 
// Apply filters using the different variables functions
function applyFilters() {
  let visibleCount = 0;

  for (let i = 0; i < recipeCards.length; i++) {
    let card = recipeCards[i];
 
    let cardCuisine    = card.getAttribute("data-cuisine");
    let cardDifficulty = card.getAttribute("data-difficulty");
    let cardTitle = card.querySelector(".card-title").textContent.toLowerCase();
    let cardDesc  = card.querySelector(".card-desc").textContent.toLowerCase();
 

    // Cuisine Filter
    let cuisineMatch = false;
    if (activeCuisine === "all") {
      cuisineMatch = true;
    } else if (cardCuisine === activeCuisine) {
      cuisineMatch = true;
    }
 
    // Difficult filter
    let difficultyMatch = false;
    if (activeDifficulty === "all") {
      difficultyMatch = true;
    } else if (cardDifficulty === activeDifficulty) {
      difficultyMatch = true;
    }
 
    // Looking if the card matches the search bar value
    let searchMatch = false;
    if (activeSearch === "") {
      searchMatch = true;
    } else if (cardTitle.includes(activeSearch)) {
      searchMatch = true;
    } else if (cardDesc.includes(activeSearch)) {
      searchMatch = true;
    }
 
    // Show or hide the card 
    if (cuisineMatch && difficultyMatch && searchMatch) {
      card.hidden = false;
      visibleCount = visibleCount + 1;
    } else {
      card.hidden = true;
    }
  }
 
  // Update the "Showing X recipes" text
  resultsCount.innerHTML = "Showing <strong>" + visibleCount + "</strong> recipes";
 
  // Show the "No results" message only when nothing is visible
  if (visibleCount === 0) {
    noResults.hidden = false;
  } else {
    noResults.hidden = true;
  }
}
 
// When the User want's to clear the filter sections
 
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", function() {
    // Clearing the search bar
    searchBar.value = "";
    activeSearch = "";
 
    // Reset the cuisine filters
    for (let i = 0; i < cuisineFilters.length; i++) {
      cuisineFilters[i].classList.remove("active");
    }
    document.querySelector('#cuisine-filters .chip[data-filter="all"]').classList.add("active");
    activeCuisine = "all";
 
    // Reset difficulty filters
    for (let i = 0; i < difficultyFilters.length; i++) {
      difficultyFilters[i].classList.remove("active");
    }
    document.querySelector('#difficulty-filters .chip[data-difficulty="all"]').classList.add("active");
    activeDifficulty = "all";
 
    // Re-run the filter so all cards appear again
    applyFilters();
  });
}
 
// Viewing the Recipes when the modal is opened

let viewButtons = document.querySelectorAll(".btn-view-recipe");
 
for (let i = 0; i < viewButtons.length; i++) {
  viewButtons[i].addEventListener("click", function() {
    // Find out which recipe this button belongs to
    let recipeId = viewButtons[i].getAttribute("data-recipe-id");
 
    let modal = document.getElementById("modal-" + recipeId);
 
    if (modal) {
      modal.classList.add("open");
      // Stop the page from scrolling behind the modal
      document.body.style.overflow = "hidden";
    }
  });
}
 
// Close the modal when the close button is clicked.
let closeButtons = document.querySelectorAll(".modal-close");
 
for (let i = 0; i < closeButtons.length; i++) {
  closeButtons[i].addEventListener("click", function() {
    let parentModal = closeButtons[i].closest(".recipe-modal");
    parentModal.classList.remove("open");
    document.body.style.overflow = "";
  });
}

let allModals = document.querySelectorAll(".recipe-modal");
 
for (let i = 0; i < allModals.length; i++) {
  allModals[i].addEventListener("click", function(e) {
    if (e.target === allModals[i]) {
      allModals[i].classList.remove("open");
      document.body.style.overflow = "";
    }
  });
}
 
 function updateFavCount() {
  favCount.textContent = favourites.length;
}
 
// Update the heart button on a card to show filled heart or empty heart
function updateFavButton(recipeId) {
  let heartButtons = document.querySelectorAll(".fav-btn[data-recipe-id='" + recipeId + "']");
 
  for (let i = 0; i < heartButtons.length; i++) {
    if (favourites.includes(recipeId)) {
      heartButtons[i].textContent = "♥";
      heartButtons[i].classList.add("saved");
    } else {
      heartButtons[i].textContent = "♡";
      heartButtons[i].classList.remove("saved");
    }
  }
}
 
// Build the saved recipes list shown in the Favourites section
function renderFavouritesList() {
  favouritesList.innerHTML = "";

  if (favourites.length === 0) {
    favouritesEmpty.hidden = false;
    clearFavsBtn.hidden    = true;
    return;
  }
 
  favouritesEmpty.hidden = true;
  clearFavsBtn.hidden    = false;
 

  for (let i = 0; i < favourites.length; i++) {
    let id = favourites[i];
 
    let card = document.querySelector(".recipe-card[data-id='" + id + "']");
    if (!card) continue; 
 
    let title   = card.querySelector(".card-title").textContent;
    let cuisine = card.querySelector(".cuisine-tag").textContent;
 
    let li = document.createElement("li");
    li.classList.add("favourites-item");
 
    li.innerHTML =
      "<span class='fav-cuisine-tag'>" + cuisine + "</span>" +
      "<span class='fav-title'>" + title + "</span>" +
      "<button class='btn-remove-fav' data-recipe-id='" + id + "'>Remove</button>";
 
    favouritesList.appendChild(li);
  }
 
  let removeButtons = document.querySelectorAll(".btn-remove-fav");
  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function() {
      let idToRemove = removeButtons[i].getAttribute("data-recipe-id");
      toggleFavourite(idToRemove);
    });
  }
}
 
// Add or remove a recipe from the favourites array
function toggleFavourite(recipeId) {
  if (favourites.includes(recipeId)) {
    let newFavourites = [];
    for (let i = 0; i < favourites.length; i++) {
      if (favourites[i] !== recipeId) {
        newFavourites.push(favourites[i]);
      }
    }
    favourites = newFavourites;
 
  } else {
    favourites.push(recipeId);
  }
 
  updateFavCount();
  updateFavButton(recipeId);
  renderFavouritesList();
}
 
let heartButtons = document.querySelectorAll(".fav-btn");
 
for (let i = 0; i < heartButtons.length; i++) {
  heartButtons[i].addEventListener("click", function() {
    let recipeId = heartButtons[i].getAttribute("data-recipe-id");
    toggleFavourite(recipeId);
  });
}
 
// Save to Favourites
let modalFavButtons = document.querySelectorAll(".btn-favourite-modal");
 
for (let i = 0; i < modalFavButtons.length; i++) {
  modalFavButtons[i].addEventListener("click", function() {
    let recipeId = modalFavButtons[i].getAttribute("data-recipe-id");
    toggleFavourite(recipeId);
  });
}
 
// Reset everything 
clearFavsBtn.addEventListener("click", function() {
  let oldFavs = favourites;
  favourites = [];
  for (let i = 0; i < oldFavs.length; i++) {
    updateFavButton(oldFavs[i]);
  }
  updateFavCount();
  renderFavouritesList();
});


// Mobile Menu
const hamburger = document.querySelector(".hamburger");
const mainNav   = document.getElementById("main-nav");
 
if (hamburger && mainNav) {
  hamburger.addEventListener("click", function() {
    if (mainNav.classList.contains("open")) {
      // When the navigation is open close it.
      mainNav.classList.remove("open");
      hamburger.textContent = "☰";
      hamburger.setAttribute("aria-expanded", "false");
    } else {
      // When navigation is closed open it
      mainNav.classList.add("open");
      hamburger.textContent = "✕";
      hamburger.setAttribute("aria-expanded", "true");
    }
  });
}

// Initializing when the Page loads. 
function init() {
  if (hamburger) {
    hamburger.textContent = "☰";
  }
  updateFavCount();
  renderFavouritesList();
 
  applyFilters();
}
 
init();