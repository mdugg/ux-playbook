import MainArticles from "../services/API.js";

export default class ResourcesListed extends HTMLElement {
	constructor() {
		super();
		let configShadow = {
			mode: "open",
		};
		this.root = this.attachShadow(configShadow);
		this.root.innerHTML = `<p>Loading resources...</p>`;
		// initialize the dataFiltered property
		this.loadData = async () => {
			this.dataFiltered = await MainArticles.fetchArticles();
			console.log(this.dataFiltered);
		};
		this.dataFiltered = null;
	}
	connectedCallback() {
		// Call render() after the dataFiltered is loaded
		this.loadData().then(() => {
			this.render();
		});

		// Listen for the CategoryFilterChanged event
		document.addEventListener("CategoryFilterChanged", (event) => {
			// Get the clicked category
			let selectedCategory = event.detail.selectedCategory;
			// Toggle the active state of the clicked category button
			const categoryButton = this.root.querySelector(
				`button[data-category="${selectedCategory}"]`
			);
			if (categoryButton) {
				categoryButton.classList.toggle("active");
			}
			// Filter data based on the selected category
			if (selectedCategory === null) {
				// Reset the filter to show all data
				this.resetFilter();
			} else {
				// Filter data by the selected category
				this.filterDataByCategory(selectedCategory);
			}
			console.log("Selected category:", selectedCategory);
		});
		// Inside connectedCallback method
		document.addEventListener("TagsFilterChanged", (event) => {
			let selectedTags = event.detail.selectedTags;
			this.filterDataByTags(selectedTags);
			console.log("TagsFilterChanged event received", this.selectedTags);
			this.render();
		});
	}
	disconnectedCallback() {
		// Clean up event listener when component is removed
		this.removeEventListener("DataFiltered", this.onDataFiltered);
	}
	// Function to filter the data based on the selected category
	async filterDataByCategory(category) {
		// Fetch articles and wait for the promise to resolve
		const articles = await MainArticles.fetchArticles();
		// Filter the fetched data based on the selected category
		this.dataFiltered = articles.filter((item) =>
			item.category.includes(category)
		);
		console.log(this.dataFiltered);

		// Render the updated data
		this.render();
	}
	// Add a method to reset the filter
	resetFilter() {
		this.dataFiltered = null; // Reset the filtered data
		this.loadData().then(() => {
			this.render(); // Render all the data
		});
	}
	async filterDataByTags(tags) {
		const articles = await MainArticles.fetchArticles();
		this.dataFiltered = articles.filter((item) =>
			tags.every((tag) => item.tags.includes(tag))
		);
		this.render();
	}
	// Function to re-render the component when data changes
	render() {
		if (this.dataFiltered) {
			this.root.innerHTML = `
					<style>
						.toolkit-results-list {
							margin:0;
							padding:0;
						}
						.resource-item {
							border-bottom: 1px solid var(--gray-200);
							padding: 0.25rem 0;
							list-style-type: none;
						}
						.resource-card {
							display: flex;
							flex-direction: column;
							margin-top: 1rem;
							position: relative;
						}
						.row {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
						}
						.media-type {
							font-size: var(--font-size-small);
							font-weight: var(--font-semibold);
							color: var(--teal);
							text-transform: uppercase;
							letter-spacing: .05rem;
						}
						.key {
							color: var(--gray-500);
							font-size: var(--font-size-small);
							margin-right: .5rem;
						}
						.title {
							display: flex;
							flex-direction: column;
							margin-top: 0;
							margin-bottom: 0;
						}
						.link {
							font-family: var(--font-display);
							font-weight: var(--font-regular);
							font-style: regular;
							font-size: 2rem;
							color: var(--gray-600);
							text-decoration: none;
							transition: var(--transition-all);
						}
						.link:hover {
							color: var(--teal);
						}
						.meta {
							display: flex;
							flex-direction: row;
							width: 100%;
							padding-top: 0.25rem;
						}
						.meta-item {
							display: flex;
							flex-direction: row;
							align-items: center;
							margin-right: 1rem;
						}
						.icon {
							height: 1rem;
							fill: var(--teal);
							margin-right: .5rem;
						}
						.category {
							margin-right: 1rem;
						}
						.tags {
							font-size: 1rem;
						}
					</style>
    <ul class="toolkit-results-list">
        ${Object.keys(this.dataFiltered) // Use Object.keys() to iterate over keys
			.reverse()
			.map((key) => {
				// Iterate over keys directly
				const value = this.dataFiltered[key]; // Access the value corresponding to the key
				return `
                    <li class="resource-item" id="${key}">
                        <article class="resource-card">
                            <div class="row">
                                <span class="media-type">
                                    ${value.resourceType}
                                </span>
                                <span class="key"># ${key}</span> <!-- Display the key here -->
                            </div>
                            <h3 class="title">
                                <a class="link"
                                    href="${value.resourceLink}" 
                                    target="_blank">
                                    ${value.resourceTitle}
                                </a>
                            </h3>
                            <div class="meta">
                                <span class="meta-item">
									<span class="icon-block">
										<svg class="icon" width="17" height="16" viewBox="0 0 17 16" >
											<path d="M14.625 7.53459L10.9998 9.00027H13.9481C13.7071 9.46435 13.439 9.91531 13.1396 10.3444L8.99882 12.0004H11.6755C9.82104 13.6476 7.17219 14.5111 3.40954 13.6511L1.2804 15.7802C0.987264 16.0734 0.512871 16.0732 0.219735 15.7802C-0.073245 15.4872 -0.073245 15.0127 0.219735 14.7196L8.13879 6.8005C8.29023 6.6044 8.28389 6.32579 8.10401 6.14579C7.90869 5.95047 7.59211 5.95047 7.3971 6.14579L2.12815 11.4147C0.795069 1.8125 11.4936 0.253624 14.9937 0.00257088C15.5834 -0.0397432 16.0691 0.446025 16.0266 1.03542C15.925 2.45408 15.6063 5.05637 14.625 7.53459Z" />
										</svg>
									</span>
                                    ${value.authors.join(", ")}
                                </span>
                                <span class="category">
									<span class="icon-block">
										<svg class="icon" width="18" height="16" viewBox="0 0 18 16" >
											<path d="M13 4C12.7227 4 12.5 4.22266 12.5 4.5C12.5 4.77734 12.7227 5 13 5C13.2773 5 13.5 4.77734 13.5 4.5C13.5 4.22266 13.2781 4 13 4ZM17.1094 0.128906C16.9188 0.0429688 16.7125 0 16.5 0C16.1369 0 15.7775 0.132812 15.4959 0.386875L14.2563 1.5H13.7406L12.5022 0.386875C12.0606 -0.0115625 11.4281 -0.109375 10.8888 0.129063C10.3469 0.37125 10 0.90625 10 1.5V5C10 5.13281 10.0273 5.25781 10.0391 5.38688L8.57031 5.60953C6.4625 5.93125 4.675 7.05938 3.5 8.65625V5.75C3.5 4.23438 2.26562 3 0.75 3C0.335938 3 0 3.3375 0 3.75C0 4.16719 0.339687 4.50406 0.755 4.50031C1.45906 4.49375 2 5.1375 2 5.84062V12.475C2 14.775 3.23125 16 4.75 16H10.5C10.7773 16 11 15.7773 11 15.5281C11 14.95 10.55 14.5 10 14.5H9.49625C9.49234 14.2695 9.47281 14.0431 9.43762 13.8203L12 12.3125V14.5C12 15.325 12.675 16 13.5 16H14.5C15.325 16 16 15.325 16 14.5V8.44375C17.1906 7.75 18 6.47187 18 5V1.5C18 0.90625 17.6531 0.37125 17.1094 0.128906ZM14.5 14.5H13.5V11.4375C13.5 11.0781 13.3086 10.7463 12.9963 10.5703C12.6876 10.3906 12.305 10.3945 11.9925 10.5742L8.98438 12.3469C8.60563 11.5656 8.03906 10.8819 7.3125 10.3741C7.07816 10.21 6.74625 10.3038 6.60938 10.5538L6.375 10.9719C6.25 11.1984 6.29688 11.4875 6.50391 11.64C7.41562 12.3 7.96875 13.3594 7.99375 14.5H4.75C4.0625 14.5 3.5 13.9656 3.5 13.2781C3.5 10.1766 5.72656 7.5875 8.79688 7.12187L10.4688 6.86797C11.1375 8.11875 12.4625 9 14 9C14.1719 9 14.3359 8.96875 14.5 8.94922V14.5ZM16.5 5C16.5 6.37875 15.3787 7.5 14 7.5C12.6213 7.5 11.5 6.37906 11.5 5.00031V1.5L13.1687 3H14.8328L16.5 1.5V5ZM14.5 4.5C14.5 4.77812 14.7219 5 15 5C15.2781 5 15.5 4.77734 15.5 4.52812C15.5 4.27891 15.2781 4 15 4C14.7219 4 14.5 4.22188 14.5 4.5Z" />
										</svg>
									</span>
                                    ${value.category}
                                </span>
                                <span class="tags">
									<span class="icon-block">
										<svg class="icon" width="20" height="16" viewBox="0 0 20 16" >
											<path d="M6.64332 0H4.83953C3.60758 0 2.47349 0.656273 1.87978 1.71283L0.677381 3.89158C0.234224 4.68218 0 5.5764 0 6.47445V10.6155C0 13.5848 2.47925 16 5.5265 16H9.05733C10.5894 16 11.8421 14.803 11.8954 13.312C12.567 12.7889 12.9719 11.9829 12.9719 11.1344V10.6151C12.9719 10.4786 12.9615 10.3425 12.9407 10.2079C13.3097 9.72895 13.5092 9.1456 13.5092 8.53538V7.98273H16.852C18.4102 7.98273 19.6498 6.77764 19.6498 5.21948C19.6498 3.66131 18.4102 2.45622 16.8865 2.45622H10.3737L9.24922 1.24078C8.61597 0.474358 7.66803 0 6.64332 0ZM6.64332 1.84217C7.11576 1.84217 7.55558 2.04485 7.84802 2.39866L8.45095 3.07028H6.75462C6.4152 3.07028 6.14056 3.34515 6.14056 3.68472C6.14056 4.02429 6.4152 4.29878 6.75462 4.29878L16.852 4.29839C17.3598 4.29839 17.7731 4.71211 17.7731 5.21948C17.7731 5.72684 17.3598 6.14056 16.852 6.14056H11.4023C11.0347 6.14056 10.7867 6.44532 10.7867 6.76037C10.7867 7.00726 10.9408 7.23281 11.177 7.32569C11.2526 7.37635 11.6671 7.56824 11.6671 7.98273V8.50199C11.6671 9.30679 10.9156 9.18973 10.9156 9.81722C10.9156 10.1323 11.1299 10.1951 11.1299 10.5802V11.0994C11.1299 12.08 10.0465 11.8006 10.0465 12.5832C10.0465 12.5892 10.0466 12.5952 10.0468 12.6011L10.0551 13.1779C10.0551 13.6995 9.60765 14.1228 9.09185 14.1228H5.49196C3.46021 14.1228 1.84217 12.5336 1.84217 10.5801V6.47445C1.84217 5.88918 1.99507 5.30736 2.28429 4.79041L3.48707 2.64965C3.75511 2.17222 4.27383 1.87594 4.84068 1.87594H6.64332V1.84217Z" />
											</svg>
									</span>
                                    ${value.tags.join(", ")}
                                </span>
                            </div>
                            <ul class="bullets">
                                ${
									value.notes.description
										? value.notes.bulletPoints
												.map((bullet) => {
													return `<li>${bullet}</li>`;
												})
												.join("")
										: ""
								}
                            </ul>
                        </article>
                    </li>
                `;
			})
			.join("")}
            </ul>`;
		} else {
			this.root.innerHTML = `<p>Failed to load the resources</p>`;
		}
	}
}
customElements.define("toolkit-resources-listed", ResourcesListed);

/*
- The ResourcesListed class extends HTMLElement.
- In the constructor, it sets up the shadow DOM and initializes the dataFiltered property to null. It also defines an asynchronous function loadData to fetch article data from an API.
- The connectedCallback method is called when the element is inserted into the DOM. It loads the data and then renders the list of resources.
- It listens for the CategoryFilterChanged event, which is dispatched when a category filter is changed. Upon receiving this event, it filters the data based on the selected category and then re-renders the list with the filtered data.
- The filterDataByCategory method filters the fetched data based on the selected category.
- The render method dynamically generates HTML for each resource based on the filtered data. It displays information such as resource type, title, authors, category, tags, and description bullet points.
*/
