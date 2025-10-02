// document.addEventListener("DOMContentLoaded", () => {
//     // Select DOM elements
//     const searchForm = document.getElementById("search-form");
//     const searchInput = document.getElementById("search-input");
//     const resultsContainer = document.getElementById("results-container");
//     const loader = document.getElementById("loader");

//     // API endpoint
//     const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

//     // Event listener for the form submission
//     searchForm.addEventListener("submit", (e) => {
//         e.preventDefault(); // Prevent page reload
//         const searchQuery = searchInput.value.trim();
//         if (searchQuery) {
//             searchRecipes(searchQuery);
//         }
//     });

//     // Function to fetch recipes from the API
//     async function searchRecipes(query) {
//         loader.classList.remove("hidden"); // Show loader
//         resultsContainer.innerHTML = ""; // Clear previous results

//         try {
//             const response = await fetch(API_URL + query);
//             if (!response.ok) {
//                 throw new Error("Network response was not ok.");
//             }
//             const data = await response.json();
//             displayRecipes(data.meals);
//         } catch (error) {
//             console.error("Error fetching recipes:", error);
//             resultsContainer.innerHTML = "<p>Sorry, we couldn't fetch recipes. Please try again later.</p>";
//         } finally {
//             loader.classList.add("hidden"); // Hide loader
//         }
//     }

//     // Function to display recipes on the page
//     function displayRecipes(meals) {
//         if (!meals) {
//             resultsContainer.innerHTML = "<p>No recipes found for your search. Please try another ingredient.</p>";
//             return;
//         }

//         meals.forEach((meal) => {
//             const recipeCardHTML = `
//                 <div class="recipe-card">
//                     <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
//                     <h3>${meal.strMeal}</h3>
//                 </div>
//             `;
//             resultsContainer.insertAdjacentHTML("beforeend", recipeCardHTML);
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");
    const loader = document.getElementById("loader");

    // --- NEW: Select Modal Elements ---
    const recipeModal = document.getElementById("recipe-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalBody = document.getElementById("modal-body");

    // API endpoint
    const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    // --- NEW: Variable to store current search results ---
    let latestResults = [];

    // Event listener for the form submission
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            searchRecipes(searchQuery);
        }
    });

    // Function to fetch recipes from the API
    async function searchRecipes(query) {
        loader.classList.remove("hidden");
        resultsContainer.innerHTML = "";

        try {
            const response = await fetch(API_URL + query);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            
            // --- MODIFIED: Store results and call display function ---
            latestResults = data.meals || [];
            displayRecipes(latestResults);

        } catch (error) {
            console.error("Error fetching recipes:", error);
            resultsContainer.innerHTML = "<p>Sorry, we couldn't fetch recipes. Please try again later.</p>";
        } finally {
            loader.classList.add("hidden");
        }
    }

    // Function to display recipes on the page
    function displayRecipes(meals) {
        if (meals.length === 0) {
            resultsContainer.innerHTML = "<p>No recipes found for your search. Please try another ingredient.</p>";
            return;
        }

        meals.forEach((meal) => {
            // --- MODIFIED: Added data-meal-id attribute ---
            const recipeCardHTML = `
                <div class="recipe-card" data-meal-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            `;
            resultsContainer.insertAdjacentHTML("beforeend", recipeCardHTML);
        });
    }

    // --- NEW: Function to display recipe details in the modal ---
    function showRecipeDetails(meal) {
        let ingredientsHTML = "<ul>";
        // The API returns up to 20 ingredients
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient) {
                ingredientsHTML += `<li>${measure} ${ingredient}</li>`;
            } else {
                // Stop the loop if there are no more ingredients
                break;
            }
        }
        ingredientsHTML += "</ul>";

        modalBody.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strInstructions}</p>
            <h3>Ingredients:</h3>
            ${ingredientsHTML}
        `;
        recipeModal.classList.add("show-modal");
    }

    // --- NEW: Event listener to open the modal ---
    resultsContainer.addEventListener("click", (e) => {
        const card = e.target.closest(".recipe-card");
        if (card) {
            const mealId = card.getAttribute("data-meal-id");
            const meal = latestResults.find((m) => m.idMeal === mealId);
            if (meal) {
                showRecipeDetails(meal);
            }
        }
    });

    // --- NEW: Event listeners to close the modal ---
    modalCloseBtn.addEventListener("click", () => {
        recipeModal.classList.remove("show-modal");
    });

    recipeModal.addEventListener("click", (e) => {
        if (e.target === recipeModal) {
            recipeModal.classList.remove("show-modal");
        }
    });
});