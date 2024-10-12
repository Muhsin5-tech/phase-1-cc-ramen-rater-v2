// index.js

// Callbacks
const handleClick = (ramen) => {
  const detailImage = document.querySelector('.detail-image');
  const nameDisplay = document.querySelector('.name');
  const restaurantDisplay = document.querySelector('.restaurant');
  const ratingDisplay = document.getElementById('rating-display');
  const commentDisplay = document.getElementById('comment-display');

  // Update the DOM with the ramen details
  detailImage.src = ramen.image;
  nameDisplay.textContent = ramen.name;
  restaurantDisplay.textContent = ramen.restaurant;
  ratingDisplay.textContent = ramen.rating;
  commentDisplay.textContent = ramen.comment;

  // Pre-fill the edit form with the current ramen details
  document.getElementById('edit-rating').value = ramen.rating;
  document.getElementById('edit-comment').value = ramen.comment;

  // Store the ramen ID for updating
  document.getElementById('edit-ramen').dataset.ramenId = ramen.id;
};

const addSubmitListener = () => {
  const form = document.getElementById('new-ramen');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const newRamen = {
        name: form.name.value,
        restaurant: form.restaurant.value,
        image: form.image.value,
        rating: Number(form.rating.value), // Ensure this is a number
        comment: form['new-comment'].value,
      };

      // Add the new ramen to the ramen menu visually
      displayNewRamen(newRamen);

      // Send a POST request to add the new ramen to the database
      fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRamen),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('New ramen added:', data);
          form.reset(); // Clear the form fields
        })
        .catch(error => {
          console.error('Error adding new ramen:', error);
        });
    });
  } else {
    console.error('Form element not found!');
  }
};

const displayNewRamen = (ramen) => {
  const ramenMenu = document.getElementById('ramen-menu');
  const ramenImage = document.createElement('img');
  ramenImage.src = ramen.image;
  ramenImage.alt = ramen.name;
  ramenImage.addEventListener('click', () => handleClick(ramen));
  ramenMenu.appendChild(ramenImage);
};

const displayRamens = () => {
  fetch('http://localhost:3000/ramens')
    .then(response => response.json())
    .then(ramens => {
      ramens.forEach(ramen => displayNewRamen(ramen));
      
      // Display the first ramen's details if available
      if (ramens.length > 0) {
        handleClick(ramens[0]);
      }
    })
    .catch(error => console.error('Error fetching ramens:', error));
};

const addUpdateListener = () => {
  const editForm = document.getElementById('edit-ramen');
  if (editForm) {
    editForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const ramenId = editForm.dataset.ramenId; // Get the ramen ID from data attribute
      const updatedRamen = {
        rating: Number(editForm.rating.value),
        comment: editForm['edit-comment'].value,
      };

      // Send a PATCH request to update the ramen in the database
      fetch(`http://localhost:3000/ramens/${ramenId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRamen),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Ramen updated:', data);
          // Update the displayed details on the page
          const ramenToUpdate = { ...data, image: document.querySelector('.detail-image').src }; // Retain the image source
          handleClick(ramenToUpdate); // Re-display the updated ramen
        })
        .catch(error => {
          console.error('Error updating ramen:', error);
        });
    });
  } else {
    console.error('Edit form element not found!');
  }
};

// Wrap the main invocation in a DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
  displayRamens();
  addSubmitListener();
  addUpdateListener(); // Add listener for the update form
});

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  addUpdateListener,
};