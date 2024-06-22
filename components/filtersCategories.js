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
					display: flex;
					flex-direction: row;
					gap: .25rem;
					margin: 0;
					padding: 0;
				}
				.toolkit-categories-item {
					display: flex;
					margin: 0;
					list-style-type: none;
				}
				.button {
					height: 2rem;
					padding: 0 1rem;
					border-style: none;
					border-radius: var(--border-radius-sm);
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
					color: var(--gray-800);
					font-size: var(--font-size-small);
					font-weight: var(--font-weight-medium);
					line-height: var(--lineheight-regular);
					font-optical-sizing: auto;
				}
				.button-count {
					font-size: var(--font-size-small);
				}
				.button.active {
					background-color: var(--blue);
				}
				.button.active .button-label {
					color: var(--white);
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
			// Check if the clicked category button is already active
			const isActive = this.activeCategory === category;
			// Toggle the active state
			if (isActive) {
				// Deactivate the category
				this.setActiveCategory(null);
			} else {
				// Activate the category
				this.setActiveCategory(category);
			}
			// Create a custom event with the selected category
			let categoryChangeEvent = new CustomEvent("CategoryFilterChanged", {
				isTrusted: true,
				bubbles: true,
				detail: {
					selectedCategory: isActive ? null : category, // If already active, pass null to deselect
				},
			});
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
