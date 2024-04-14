import MainArticles from "../services/API.js";

export default class FiltersTags extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
		this.root.innerHTML = `<p>Loading ...</p>`;
		this.data = null;
		this.activeTags = new Set(); // Store active tags
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
			<style>
				.toolkit-categories {
					margin:0;
					padding:0;
				}
				.toolkit-tag-item {
					display: inline;
					list-style-type: none;
				}

				.button-tags {
					padding: 0.25rem;
					margin: 0 0.25rem 0.25rem 0;
					border-style: none;
					border-radius: 0.25rem;
					background-color: transparent;
					transition: var(--transition-all);
				}
				.button-tags:hover {
					cursor: pointer;
					background-color: var(--light-aquamarine);
				}
				.button-tags.active {
					background-color: var(--light-aquamarine);
					}
				.button-label {
					font-size: var(--font-size-text);
					color: var(--gray-800);
					line-height: 1;
					height: auto;
				}
				.button-count {
					font-size: 0.75rem;
				}
			</style>
            <ul class="toolkit-categories">
                ${sortedTags
					.map(
						(tag) => `
                    	<li class="toolkit-tag-item">
                          <button 	data-tag="${tag}" 
						  			class="button-tags 
									${this.activeTags.has(tag) ? "active" : ""}" >
                                <span class="button-label">${tag}</span> 
                                <span class="button-count">(${
									tagsCount[tag]
								})</span>
                            </button>
                        </li>
                `
					)
					.join("")}
            </ul>
            `;
			// Add event listeners to tag buttons
			this.root.querySelectorAll(".button-tags").forEach((button) => {
				button.addEventListener("click", () => {
					const tag = button.dataset.tag;
					this.toggleActiveTag(tag);
					button.classList.toggle("active");
					this.dispatchEvent(
						new CustomEvent("TagsFilterChanged", {
							detail: {
								selectedTags: Array.from(this.activeTags),
							},
						})
					);
				});
			});
		} else {
			this.root.innerHTML = "<p>Data is not available</p>";
		}
	}
	// Method to toggle active tag
	toggleActiveTag(tag) {
		if (this.activeTags.has(tag)) {
			this.activeTags.delete(tag);
		} else {
			this.activeTags.add(tag);
		}
		console.log(this.activeTags);
	}
}
customElements.define("toolkit-filter-tags", FiltersTags);
