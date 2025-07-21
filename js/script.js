// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const gallery = document.getElementById("gallery");
const button = document.querySelector("button");
const API_KEY = "1j3kXQxtJbd0Rr2hhcaPH6QXRH27ucdosiilIazY"; // Replace with your own NASA API key if needed

button.addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  showRandomFact(); // Show a random space fact when fetching images
  fetchImages(startDate, endDate);
});

function fetchImages(start, end) {
  gallery.innerHTML = "<p>Loading images...</p>";

  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      gallery.innerHTML = ""; // Clear gallery
      if (data.length === 0) {
        gallery.innerHTML = "<p>No images found for this range.</p>";
        return;
      }

      data.reverse().forEach(item => {
        if (item.media_type !== "image") return;

        const div = document.createElement("div");
        div.className = "gallery-item";

        div.innerHTML = `
          <img src="${item.url}" alt="${item.title}" />
          <p><strong>${item.title}</strong><br>${item.date}</p>
          <p>${item.explanation.slice(0, 200)}...</p>
        `;

        div.addEventListener("click", () => {
          openModal(item);
        });

        gallery.appendChild(div);
      });


    })
    .catch(error => {
      console.error("Error fetching NASA data:", error);
      gallery.innerHTML = "<p>Error fetching data. Try again later.</p>";
    });
}

// Modal functionality
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.querySelector(".close");
const fullscreenBtn = document.getElementById("fullscreen-btn");

function openModal(item) {
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalDate = document.getElementById("modal-date");
  const modalDescription = document.getElementById("modal-description");

  modalImage.src = item.hdurl || item.url;
  modalImage.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalDescription.textContent = item.explanation;

  modal.style.display = "block";
}


// Close modal with click
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal by clicking outside content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Close modal with ESC key
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.style.display = "none";
  }
});

// Toggle fullscreen
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    modalImage.requestFullscreen().catch(err => {
      console.error("Fullscreen error:", err);
    });
  } else {
    document.exitFullscreen();
  }
});

// Fun space facts array (15 total)
const spaceFacts = [
  "Venus is the hottest planet in our solar system — even hotter than Mercury!",
  "One day on Venus is longer than an entire year on Earth.",
  "There’s a planet made of diamonds called 55 Cancri e.",
  "The largest volcano in the solar system is Olympus Mons on Mars.",
  "Neutron stars can spin at over 600 times per second!",
  "A spoonful of a neutron star would weigh about a billion tons.",
  "The sun makes up 99.86% of the mass in our solar system.",
  "There may be more stars in the universe than grains of sand on Earth.",
  "Spacesuits used by NASA can cost over $12 million each.",
  "The Boomerang Nebula is the coldest known place in the universe.",
  "Earth is the only planet not named after a Roman or Greek god.",
  "A year on Mercury is just 88 Earth days long.",
  "Jupiter’s moon Europa may have more water than all of Earth’s oceans.",
  "Saturn’s rings are mostly made of ice and rock.",
  "Light from the Sun takes about 8 minutes to reach Earth."
];

// Function to show a new random fact
function showRandomFact() {
  const factBox = document.getElementById("space-fact");
  factBox.classList.add("fade-out");

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    factBox.innerHTML = `<strong>🚀 Did You Know?</strong> ${spaceFacts[randomIndex]}`;
    factBox.classList.remove("fade-out");
  }, 250);
}

showRandomFact(); // Show a random fact on page load
