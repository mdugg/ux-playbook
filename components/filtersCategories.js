import MainArticles from "../services/API.js";

export default class FiltersCategories extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
		this.root.innerHTML = "<p>Loading categories ...</p>";
		this.dataUI = null; // Store the fetched dataUI
		this.loadDataUI();
		this.activeCategory = null; // Track the active category
	}

	connectedCallback() {}

	async loadDataUI() {
		this.dataUI = await MainArticles.fetchArticles();
		this.render();
	}

	render() {
		if (!this.dataUI) {
			this.root.innerHTML = "<p>Failed to load the Category filters</p>";
			return;
		}
		// Process JSON dataUI to collect category values and count occurrences
		const categoriesCount = {};
		this.dataUI.forEach((item) => {
			item.category.forEach((category) => {
				categoriesCount[category] =
					(categoriesCount[category] || 0) + 1;
			});
		});

		this.root.innerHTML = `
			<style>
				.toolkit-categories {
					margin-top: 2rem;
					margin-bottom: 2rem;
					padding: 0;
				}
				.toolkit-categories-item {
					display: inline;
					margin-right: 0.5rem;
					margin-bottom: 0.5rem;
					list-style-type: none;
				}
				.button {
					height: 2rem;
					padding: 0 1rem;
					border-style: none;
					border-radius: 0.4rem;
					background-color: var(--tint-categories);
					transition-property: background-color;
					transition-duration: 300ms;
					transition-timing-function: ease-out;
				}
				.button:hover {
				cursor: pointer;
				background-color: var(--light-aquamarine);
				}
				.button-label {
					font-size: var(--font-size-text);
					line-height: 1;
				}
				.button-count {
					font-size: var(--font-size-small);
				}
				.button.active {
					color: white;
					background-color: var(--blue);
				}
			</style>
			<ul id="categories" class="toolkit-categories">
			</ul>
      `;
		// event handlers are not accessible in the template literal
		// create buttons dynamically instead:
		const categoriesList = this.root.querySelector("#categories");

		// Define the event handler function
		let handleCategoryClick = (category) => {
			this.setActiveCategory(category); // Update active category
			// Create a custom event with the selected category
			let categoryChangeEvent = new CustomEvent("CategoryFilterChanged", {
				isTrusted: true,
				bubbles: true,
				detail: {
					selectedCategory: category,
				},
			});
			// console.log(categoryChangeEvent);
			// Dispatch the custom event
			this.dispatchEvent(categoryChangeEvent);
		};

		// Dynamically create and attach buttons with event listeners
		Object.entries(categoriesCount).forEach(([category, count]) => {
			const button = document.createElement("button");
			button.dataset.category = category;
			button.className = "button";
			button.innerHTML = `
				<span class="button-label">${category}</span> 
				<span class="button-count">(${count})</span>
			`;

			// Add the "active" class to the active button
			if (category === this.activeCategory) {
				button.classList.add("active");
			}

			button.addEventListener("click", () => {
				handleCategoryClick(category);
			});

			const listItem = document.createElement("li");
			listItem.className = "toolkit-categories-item";
			listItem.appendChild(button);

			categoriesList.appendChild(listItem);
		});
	}

	// Function to set the active category without full re-render
	setActiveCategory(category) {
		if (this.activeCategory) {
			// Remove "active" class from the previously active button
			const activeButton = this.root.querySelector(
				`button[data-category="${this.activeCategory}"]`
			);
			if (activeButton) {
				activeButton.classList.remove("active");
			}
		}

		// Add "active" class to the newly active button
		const newActiveButton = this.root.querySelector(
			`button[data-category="${category}"]`
		);
		if (newActiveButton) {
			newActiveButton.classList.add("active");
		}

		// Update the active category
		this.activeCategory = category;
	}
}
customElements.define("toolkit-filter-categories", FiltersCategories);

/*
- It defines a custom web component FiltersCategories extending HTMLElement.
- In the constructor, it initializes properties such as root, dataUI, and activeCategory.
- It fetches article data from an API asynchronously in the loadDataUI method and then renders the categories using the render method.
- The render method dynamically creates HTML elements for each category, with buttons representing each category and their respective counts.
- Event listeners are attached to each button to handle clicks and update the active category accordingly.
- The setActiveCategory method updates the active category and ensures that only one category is active at a time.
*/
