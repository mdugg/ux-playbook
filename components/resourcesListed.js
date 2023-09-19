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
