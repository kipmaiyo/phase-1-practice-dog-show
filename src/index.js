
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#table-body');
    const dogForm = document.querySelector('#dog-form');
  
    // Fetches the list of dogs from the API and renders them in the table
    function fetchDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
          tableBody.innerHTML = '';
          dogs.forEach(dog => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td><button class="edit-button" data-id="${dog.id}">Edit</button></td>
            `;
            tableBody.appendChild(tr);
          });
        })
        .catch(error => console.log('Error fetching dogs:', error));
    }
  
    // Populates the form with the dog's information for editing
    function populateForm(dog) {
      const formInputs = dogForm.elements;
      formInputs.name.value = dog.name;
      formInputs.breed.value = dog.breed;
      formInputs.sex.value = dog.sex;
      dogForm.setAttribute('data-id', dog.id);
    }
  
    // Handles the form submission and sends a PATCH request to update the dog
    function handleFormSubmit(event) {
      event.preventDefault();
      const formInputs = dogForm.elements;
      const dogId = dogForm.getAttribute('data-id');
      const updatedDog = {
        name: formInputs.name.value,
        breed: formInputs.breed.value,
        sex: formInputs.sex.value,
      };
  
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDog),
      })
        .then(response => response.json())
        .then(() => {
          // Clear the form and fetch the updated list of dogs
          formInputs.name.value = '';
          formInputs.breed.value = '';
          formInputs.sex.value = '';
          dogForm.removeAttribute('data-id');
          fetchDogs();
        })
        .catch(error => console.log('Error updating dog:', error));
    }
  
    // Handles the edit button click and populates the form with the dog's information
    function handleEditButtonClick(event) {
      const dogId = event.target.getAttribute('data-id');
      fetch(`http://localhost:3000/dogs/${dogId}`)
        .then(response => response.json())
        .then(dog => populateForm(dog))
        .catch(error => console.log('Error fetching dog:', error));
    }
  
    // Event listeners
    dogForm.addEventListener('submit', handleFormSubmit);
    tableBody.addEventListener('click', event => {
      if (event.target.matches('.edit-button')) {
        handleEditButtonClick(event);
      }
    });
  
    // Initial fetch of dogs
    fetchDogs();
  });



