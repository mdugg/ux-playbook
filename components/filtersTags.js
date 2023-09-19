import MainArticles from "../services/API.js";

export default class FiltersTags extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
		this.root.innerHTML = `<p>Loading ...</p>`;
		this.data = null;
		this.loadData = async () => {
			this.data = await MainArticles.fetchArticles();
		};
	}
	async connectedCallback() {
		await this.loadData();
		this.render();
	}
	render() {
		if (this.data) {
			const tagsCount = {};
			this.data.forEach((item) => {
				item.tags.forEach((tag) => {
					tagsCount[tag] = (tagsCount[tag] || 0) + 1;
				});
			});

			// Sort the tags alphabetically by their full string
			const sortedTags = Object.keys(tagsCount).sort();

			this.root.innerHTML = `
		    <link rel="stylesheet" href="./components/filtersTags.css">
            <ul class="toolkit-categories">
                ${sortedTags
					.map(
						(tag) => `
                    	<li class="toolkit-tag-item">
                            <button data-tag="${tag}" class="button-tags">
                                <span class="button-label">${tag}</span> 
                                <span class="button-count">(${tagsCount[tag]})</span>
                            </button>
                        </li>
                `
					)
					.join("")}
            </ul>
            `;
		} else {
			this.root.innerHTML = "<p>Data is not available</p>";
		}
	}
}
customElements.define("toolkit-filter-tags", FiltersTags);
