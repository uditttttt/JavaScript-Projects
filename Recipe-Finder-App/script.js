document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");
    const loader = document.getElementById("loader");

    // API endpoint
    const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    // Event listener for the form submission
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            searchRecipes(searchQuery);
        }
    });

    // Function to fetch recipes from the API
    async function searchRecipes(query) {
        loader.classList.remove("hidden"); // Show loader
        resultsContainer.innerHTML = ""; // Clear previous results

        try {
            const response = await fetch(API_URL + query);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            displayRecipes(data.meals);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            resultsContainer.innerHTML = "<p>Sorry, we couldn't fetch recipes. Please try again later.</p>";
        } finally {
            loader.classList.add("hidden"); // Hide loader
        }
    }

    // Function to display recipes on the page
    function displayRecipes(meals) {
        if (!meals) {
            resultsContainer.innerHTML = "<p>No recipes found for your search. Please try another ingredient.</p>";
            return;
        }

        meals.forEach((meal) => {
            const recipeCardHTML = `
                <div class="recipe-card">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            `;
            resultsContainer.insertAdjacentHTML("beforeend", recipeCardHTML);
        });
    }
});