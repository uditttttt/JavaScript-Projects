document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");
    const loader = document.getElementById("loader");
    const recipeModal = document.getElementById("recipe-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalBody = document.getElementById("modal-body");

    // API endpoint
    const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    // Variable to store current search results
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
            const recipeCardHTML = `
                <div class="recipe-card" data-meal-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            `;
            resultsContainer.insertAdjacentHTML("beforeend", recipeCardHTML);
        });
    }

    // --- THIS IS THE UPDATED FUNCTION ---
    function showRecipeDetails(meal) {
        // Format ingredients list
        let ingredientsHTML = "<ul>";
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                ingredientsHTML += `<li>${measure} ${ingredient}</li>`;
            } else {
                break;
            }
        }
        ingredientsHTML += "</ul>";

        // --- NEW: Format instructions into a numbered list ---
        const instructionsHTML = meal.strInstructions
            .split('.') // Split the string into an array of sentences
            .filter(sentence => sentence.trim() !== "") // Remove any empty sentences
            .map(sentence => `<li>${sentence.trim()}.</li>`) // Wrap each sentence in <li> tags
            .join(""); // Join them back into a single string

        // Populate the modal body with the formatted content
        modalBody.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>Instructions:</h3>
            <ol>${instructionsHTML}</ol> 
            <h3>Ingredients:</h3>
            ${ingredientsHTML}
        `;
        recipeModal.classList.add("show-modal");
    }

    // Event listener to open the modal
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

    // Event listeners to close the modal
    modalCloseBtn.addEventListener("click", () => {
        recipeModal.classList.remove("show-modal");
    });

    recipeModal.addEventListener("click", (e) => {
        if (e.target === recipeModal) {
            recipeModal.classList.remove("show-modal");
        }
    });
});