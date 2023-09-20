import MainArticles from "../services/API.js";

export default class ResourcesListed extends HTMLElement {
	constructor() {
		super();
		let configShadow = {
			mode: "open",
		};
		this.root = this.attachShadow(configShadow);
		this.root.innerHTML = `<p>Loading ...</p>`;
		// initialize the data property
		this.data = null;
		this.loadData = async () => {
			this.data = await MainArticles.fetchArticles();
		};
	}
	connectedCallback() {
		// Call render() after the data is loaded
		this.loadData().then(() => {
			this.render();
		});
	}
	render() {
		if (this.data) {
			this.root.innerHTML = `
		    <link rel="stylesheet" href="./components/resourcesListed.css">
            <ul class="toolkit-results-list">
                ${Object.entries(this.data)
					.reverse()
					.map(
						([key, value]) => `
                    <li class="resource-item">
                        <article class="resource-card">
                            <h3 class="resource-card__content">
                                <a class="resource-card__link"
                                    href="${value.resourceLink}" 
                                    target="_blank">
                                    ${value.resourceTitle}
                                </a>
                            </h3>
                            <div class="resource-card__meta">
                                <span class="resource-card__meta-value">
                                    ${value.authors.join(", ")}
                                </span>
                                <span class="resource-card__meta-item media">
                                    ${value.resourceType}
                                </span>
                                <span class="resource-card__count">
                                    # ${key}
                                </span>
                            </div>
                            <div class="resource-card__meta">
                                <span class="resource-card__meta-value">
                                    ${value.category}
                                </span>
                                <span class="resource-card__meta-value">
                                    ${value.tags.join(", ")}
                                </span>
                                <span class="resource-card__meta-item media">
                                    ${value.resourceType}
                                </span>
                            </div>
                            <ul>
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
				`
					)
					.join("")}
            </ul>`;
		} else {
			// fail notification in UI
		}
	}
}
customElements.define("toolkit-resources-listed", ResourcesListed);

/*
- I want to change where this component gets its data
- I want it to 'react' to a separate Javascript file called 'Results.js'
- Results.js will have the initial state of including all the data as currently imported by 'import MainArticles from "../services/API.js";'
- this data will be controlled by category and tag filters included in this application
- the category and tag filters will act in combination to only show the objects that contain the selected category and tags
- this component, ReourcesListed will react to category and tag filters and render the new results using the HTML within the template literal



*/
