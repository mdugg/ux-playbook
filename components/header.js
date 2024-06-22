import MainArticles from "../services/API.js";

export default class ToolkitHeader extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
		this.root.innerHTML = `<p>Loading ...</p>`;
	}
	connectedCallback() {
		// get the data first, then build the UI
		this.getModel().then((data) => {
			this.render();
			this.compareResources(data);
		});
	}
	async getModel() {
		try {
			const data = await MainArticles.fetchArticles();
			return data;
		} catch (error) {
			console.error("Error fetching data: ", error);
			throw error;
		}
	}
	compareResources(data) {
		// compare resource count in JSON data with UI
		// JSON count
		let resourceCount = Object.entries(data);
		let resourceCountEl = this.root.querySelector("#resourceCount");
		resourceCountEl.innerHTML += `${resourceCount.length}`;
		// UI count
		let resourcesUI =
			document.getElementsByClassName("resource-item").length;
		let resourceCountUI = this.root.querySelector("#resourceCountLoaded");
		resourceCountUI.innerHTML += `${resourcesUI}`;
	}
	render(data) {
		this.root.innerHTML = `
			<style>
				.header {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				.title {
					color: var(--pale-cyan);
					font-family: var(--font-display);
					font-weight: var(--font-light);
					font-size: var(--font-size-display);
					line-height: 1.3;
					margin: 0;
				}
				.resource-count {
					font-size: var(--font-size-small);
				}
			</style>
			<header class="header">
				<h1 class="title">UX Toolkit</h1>
				<div class="resource-count">
					Loaded: 
					<span id="resourceCountLoaded">
					</span> of 
					<span id="resourceCount">
					</span>
				</div>	
			</header>
		`;
	}
}

customElements.define("toolkit-header", ToolkitHeader);

/*
observe when all the resources are loaded to UI
	let resourceListUI = document.querySelector(".toolkit-results-list");
	let resourceObserver = new MutationObserver(this.compareResources);
	resourceObserver.observe(resourceListUI, { childList: true });
	
*/
