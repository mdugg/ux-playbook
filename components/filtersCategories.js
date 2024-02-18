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
			<link rel="stylesheet" href="./components/filtersCategories.css">
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


*/
