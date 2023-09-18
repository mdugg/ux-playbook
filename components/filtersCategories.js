import MainArticles from "../services/API.js";

export default class FiltersCategories extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
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

		// Create an HTML list container using template literals
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

// Define the custom HTML element
customElements.define("toolkit-filter-categories", FiltersCategories);

/*
pseudo code
create the Web Component again with the following edits:
1. import JSON data: "import MainArticles from "../services/API.js";"
2. create a custom HTML element "customElements.define("toolkit-filter-catergories", FiltersCategories);"
3. attach the ShadowDOM this.root = this.attachShadow({ mode: "open" });
4. loop through the JSON data that has the following schema:
{        
    "key": {   
        "resourceLink": "url",
        "resourceTitle": "string",
        "resourceType": [],
        "authors": [],
        "notes": {
                    "description": "",
                    "bulletPoints": []
                },
        "category": [],
        "tags": []
    },  
}
5. collect all "category" string values into an array and count occurrences of each category
6. output an HTML list container: <ul id="categories" class="uxtk-categories">
7. output each category with the occurance count with the HTML :
    <li class="item">
        <button data-category="${category}" class="button-category">
            <span class="label">${category}</span> 
            <span class="count">(${categoriesCount[category]})</span>
        </button>
    </li>
8. use template literals to render all HTML
9. the result should be a Web Component that renders the category values with an occurance count as an HTML list on an HTML page

*/
