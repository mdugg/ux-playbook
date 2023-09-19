import MainArticles from "../services/API.js";

export default class FiltersCategories extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
		this.root.innerHTML = `<p>Loading ...</p>`;
	}

	async connectedCallback() {
		const jsonData = await MainArticles.fetchArticles();

		// Process JSON data to collect category values and count occurrences
		const categoriesCount = {};
		jsonData.forEach((item) => {
			item.category.forEach((category) => {
				categoriesCount[category] =
					(categoriesCount[category] || 0) + 1;
			});
		});

		this.root.innerHTML = `
		<link rel="stylesheet" href="./components/filtersCategories.css">
        <ul id="categories" class="toolkit-categories">
          ${Object.entries(categoriesCount)
				.map(
					([category, count]) => `
                <li class="toolkit-categories-item">
                	<button data-category="${category}" class="button">
                		<span class="button-label">${category}</span> 
                		<span class="button-count">(${count})</span>
                	</button>
                </li>
              `
				)
				.join("")}
        </ul>
      `;
	}
}
customElements.define("toolkit-filter-categories", FiltersCategories);

/*
I want this custom component to have a click event which will filter the JSON data and return an array of objects that have the category matching the button label.

The matching array needs to be rendered on the HTML page, replacing the existing rendered search results; which is another custom element.

If clicked, the button should have a selected state. If clicked again it should be deselected, and the search results revert to show all of the objects in the JSON data.

Only one category button can have a selected state at a time; multi-select is not permitted. If a different category button is selected, any existing selected state will be cleared and applied to the most recently clicked button.

Each new button click event will filter the JSON data accordingly and update the search results.

Advise if it's better to include this functionality within this web component or if it should be accessibile as a separate service.




*/
