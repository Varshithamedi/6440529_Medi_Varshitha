// Exercise 1: Basics - Log & alert on load
function pageLoaded() {
  console.log("Welcome to the Community Portal");
  alert("Page is fully loaded! Enjoy the events.");
  fetchEventsAsync(); // Exercise 9: fetch events
}

// Exercise 5: Event Constructor with prototype method
function Event(name, date, category, location, seats) {
  this.name = name;
  this.date = new Date(date);
  this.category = category;
  this.location = location;
  this.seats = seats;
  this.registrations = 0;
}
Event.prototype.checkAvailability = function () {
  return this.seats - this.registrations > 0;
};

// Initial events array (Exercise 6: array + push + filter + map)
let events = [
  new Event("Music Festival", "2025-06-30", "Music", "Park", 5),
  new Event("Football Match", "2025-07-15", "Sports", "Stadium", 20),
  new Event("Jazz Night", "2025-06-20", "Music", "Jazz Club", 15),
  new Event("Workshop on Baking", "2025-08-01", "Workshop", "Community Center", 10),
];

// Exercise 4: Closure to track total registrations by category
function registrationTracker() {
  const categoryCount = {};
  return function (category) {
    categoryCount[category] = (categoryCount[category] || 0) + 1;
    return categoryCount[category];
  };
}
const trackCategoryRegistration = registrationTracker();

// DOM elements
const eventsList = document.querySelector("#events-list");
const categoryFilter = document.querySelector("#categoryFilter");
const searchInput = document.querySelector("#searchInput");
const registrationForm = document.querySelector("#registrationForm");
const eventSelect = registrationForm.elements["eventSelect"];
const formMessage = document.querySelector("#formMessage");
const statsTableBody = document.querySelector("#statsTableBody");
const loadingSpinner = document.querySelector("#loadingSpinner");

// Exercise 7: Render navigation links with JS (List + links) - already static in HTML

// Exercise 13 & 14: DOM manipulation & event handling

function renderEvents(filterCategory = "All", searchTerm = "") {
  eventsList.innerHTML = "";
  const filteredEvents = events.filter((e) => {
    const matchCategory = filterCategory === "All" || e.category === filterCategory;
    const matchName = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchName;
  });

  if (filteredEvents.length === 0) {
    eventsList.innerHTML = "<p>No events found.</p>";
    eventSelect.innerHTML = '<option value="">No events</option>';
    return;
  }

  // Fill event select dropdown for registration form
  eventSelect.innerHTML = filteredEvents
    .map((e, i) => `<option value="${i}">${e.name} (${e.date.toDateString()})</option>`)
    .join("");

  filteredEvents.forEach((e) => {
    const card = document.createElement("article");
    card.className = "event-card";

    card.innerHTML = `
      <h3>${e.name}</h3>
      <p><strong>Date:</strong> ${e.date.toDateString()}</p>
      <p><strong>Category:</strong> ${e.category}</p>
      <p><strong>Location:</strong> ${e.location}</p>
      <p><strong>Seats Left:</strong> ${e.seats - e.registrations}</p>
      <button ${e.checkAvailability() ? "" : "disabled"} data-event="${e.name}">Register</button>
    `;
    eventsList.appendChild(card);
  });

  updateStatsTable();
}

function updateStatsTable() {
  statsTableBody.innerHTML = events
    .map(
      (e) =>
        `<tr>
          <td>${e.name}</td>
          <td>${e.seats}</td>
          <td>${e.seats - e.registrations}</td>
          <td>${e.registrations}</td>
        </tr>`
    )
    .join("");
}

// Event handlers

categoryFilter.addEventListener("change", () => {
  renderEvents(categoryFilter.value, searchInput.value);
});
searchInput.addEventListener("input", () => {
  renderEvents(categoryFilter.value, searchInput.value);
});

registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = registrationForm.elements["name"].value.trim();
  const email = registrationForm.elements["email"].value.trim();
  const eventIndex = registrationForm.elements["eventSelect"].value;

  if (!name || !email || eventIndex === "") {
    formMessage.textContent = "Please fill all fields.";
    return;
  }
  const selectedEvent = events[eventIndex];
  if (!selectedEvent.checkAvailability()) {
    formMessage.textContent = "Sorry, no seats available for this event.";
    return;
  }

  // Exercise 12: Debugging example - try/catch around registration
  try {
    selectedEvent.registrations++;
    trackCategoryRegistration(selectedEvent.category);
    formMessage.style.color = "green";
    formMessage.textContent = `Thank you, ${name}! You registered for ${selectedEvent.name}.`;
    registrationForm.reset();
    renderEvents(categoryFilter.value, searchInput.value);
  } catch (error) {
    formMessage.style.color = "red";
    formMessage.textContent = "Error during registration, please try again.";
    console.error(error);
  }
});

// Exercise 9: Async JS - simulate fetching events (e.g., from API)
function fetchEventsAsync() {
  loadingSpinner.style.display = "block";
  setTimeout(() => {
    loadingSpinner.style.display = "none";
    renderEvents();
  }, 1000); // simulate 1 second delay
}

// Exercise 14: jQuery - Bonus example for smooth scroll to registration form on nav click
$("#nav-register").on("click", function (e) {
  e.preventDefault();
  $("html, body").animate(
    {
      scrollTop: $("#registration-section").offset().top,
    },
    800
  );
});
