const tryAgainButton = document.getElementById('btn-tryAgain');

let pokemonGeneration;
let pokemonPokedexEntry;
let pokemonGenus;
let pokemonFlavorText;
let pokemonSprite;
let pokemonData;
const loadingAnimation = document.getElementById('loadingScreen');

async function getRandomPokemon() {
  try {
    loadingAnimation.style.display = 'block';

    const selectedGenerations = getSelectedGenerations();
    // Fetch a list of Pokémon names based on selected generations
    const pokemonNames = await fetchPokemonNames(selectedGenerations);

    const filteredResults = pokemonNames.filter(
      (pokemon) => !pokemon.includes('-')
    );

    if (filteredResults.length === 0) {
      console.log('No Pokémon found for selected generations');
      return;
    }

    let randomPokemonName;
    pokemonData = null; // Initialize to null

    while (!pokemonData) {
      const randomIndex = Math.floor(Math.random() * filteredResults.length);
      randomPokemonName = filteredResults[randomIndex];

      const pokemonResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemonName}`
      );

      if (pokemonResponse.status === 404) {
        console.log(`Pokémon ${randomPokemonName} not found, retrying...`);
      } else if (!pokemonResponse.ok) {
        throw new Error('Failed to fetch Pokémon data');
      } else {
        pokemonData = await pokemonResponse.json();
      }
    }

    const pokemonName = pokemonData.name;
    pokemonSprite = pokemonData.sprites.front_default;

    const pokemonImageHtml = document.getElementById('pokemonImage');
    pokemonImageHtml.innerHTML = `<img id="pokeSprite" class="sprite" src="${pokemonSprite}" draggable="false">`;
    loadingAnimation.style.display = 'none';

    const submitButton = document.getElementById('submit');
    let pokemonInput = document.getElementById('pokemonInput');

    // Remove previous event listener before adding a new one
    submitButton.addEventListener('click', handleClick);

    function handleClick() {
      const enteredPokemonName = pokemonInput.value.trim().toLowerCase();

      if (enteredPokemonName === '') {
        alert('Please enter a Pokémon name');
        return; // Don't proceed further
      }

      submitButton.removeEventListener('click', handleClick);

      // Check if enteredPokemonName contains the core name of the fetched Pokémon
      if (pokemonName.toLowerCase().includes(enteredPokemonName)) {
        displayResult(pokemonName, true);
      } else {
        displayResult(pokemonName, false);
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

// Declare the checkboxes variable in the outer scope
const checkboxes = document.querySelectorAll(
  '.pokemon__filter input[type="checkbox"]'
);
const noticeMessage = document.getElementById('noticeMessage');

function getSelectedGenerations() {
  const selectedGenerations = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedGenerations.push(parseInt(checkbox.value));
    }
  });

  return selectedGenerations;
}

// Add an event listener to the checkboxes to detect changes
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    // Display a notice or message
    noticeMessage.style.display = 'grid';
  });
});

// Function to fetch Pokémon names based on selected generations
async function fetchPokemonNames(selectedGenerations) {
  const pokemonNames = [];

  for (const generation of selectedGenerations) {
    try {
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/generation/${generation}`
      );
      const speciesData = await speciesResponse.json();
      const { pokemon_species } = speciesData;

      for (const species of pokemon_species) {
        pokemonNames.push(species.name);
      }
    } catch (error) {
      // Handle any errors here (optional)
      console.error('Error fetching Pokémon data:', error.message);
    }
  }

  return pokemonNames;
}

function resetPokemonInformation() {
  let pokemonImageHtml = document.getElementById('pokemonImage');
  let result = document.getElementById('pokemonResult');
  let pokemonInput = document.getElementById('pokemonInput');
  
  pokemonImageHtml.innerHTML = ''; // Clear the Pokémon image
  result.innerHTML = ''; // Clear the result message
  pokemonInput.value = '';
  tryAgainButton.style.display = 'none';
  pokemonImageHtml.classList.add('sprite-silhouette');
  noticeMessage.style.display = 'none';
  
  // Check if the loadingAnimation element exists before modifying its style
  loadingAnimation.style.display = 'block'; // Hide the loading animation when resetting
}


// Get the modal element and buttons
const modal = document.getElementById('myModal');
const modalResultMessage = document.getElementById('pokemonResult');
const tryAgainModalButton = document.getElementById('btn-tryAgain');

// Display the modal with the result message
function showModal(resultMessage) {
  modal.style.display = 'block';
  modalResultMessage.innerHTML = `
    <img class="modal-sprite" src="${pokemonSprite}">
    <h2 class="pokemon-name">${resultMessage}</h2>
  `;
  tryAgainModalButton.style.display = 'block';
}

async function displayResult(pokemonName, isCorrect) {
  let resultMessage = '';
  let pokemonImageHtml = document.getElementById('pokemonImage');

  if (isCorrect) {
    resultMessage = `You're right! It's <span>${pokemonName}</span>!`;
  } else {
    resultMessage = `Aww... It's <span>${pokemonName}</span>!`;
  }

  pokemonImageHtml.classList.remove('sprite-silhouette');

  // Show the modal with the result message
  showModal(resultMessage);
}

// Function to close the modal, reset the quiz, and get a new random Pokémon
function closeModalAndRestart() {
  modal.style.display = 'none'; // Close the modal
  resetPokemonInformation(); // Restart the quiz
  getRandomPokemon(); // Get a new random Pokémon
}

// Event listener for both the close button and "Try Again" button inside the modal
const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closeModalAndRestart);

// Event listener for the "Try Again" button inside the modal
tryAgainModalButton.addEventListener('click', closeModalAndRestart);

getRandomPokemon();

function absorbEvent_(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function preventLongPressMenu(node) {
  node.ontouchstart = absorbEvent_;
  node.ontouchmove = absorbEvent_;
  node.ontouchend = absorbEvent_;
  node.ontouchcancel = absorbEvent_;
}

function init() {
  preventLongPressMenu(document.getElementById('pokeSprite'));
}
