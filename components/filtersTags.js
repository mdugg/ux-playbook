import MainArticles from "../services/API.js";

export default class FiltersTags extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
		this.root.innerHTML = `<p>Loading tags...</p>`;
		this.data = null;
		this.activeTags = new Set(); // Store active tags
		this.loadData = async () => {
			try {
				this.data = await MainArticles.fetchArticles();
			} catch (error) {
				console.error("Failed to fetch articles:", error);
				this.root.innerHTML = "<p>Failed to load data</p>";
			}
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
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					gap: .25rem;
					margin:0;
					padding:0;
				}
				.toolkit-tag-item {
					display: inline;
					list-style-type: none;
				}
				.button-tags {
					padding: .25rem .8rem;
					margin: 0;
					border-style: none;
					border-radius: 0.25rem;
					background-color: var(--tags-btn-back);
					transition: var(--transition-hover-color);
				}
				.button-tags:hover {
					cursor: pointer;
					background-color: var(--light-aquamarine);
				}
				.button-tags.active {
					background-color: var(--light-aquamarine);
					}
				.button-label {
					font-size: var(--font-size-small);
					color: var(--gray-700);
					line-height: 1;
					height: auto;
				}
				.button-count {
					font-size: 0.75rem;
				}
				@media (width <= 960px) {
					.toolkit-categories {
						padding:4rem 1rem;
					}
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
							isTrusted: true,
							bubbles: true,
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
