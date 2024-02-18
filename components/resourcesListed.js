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
			// console.log(this.dataFiltered);
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
			// Filter data based on the selected category
			let selectedCategory = event.detail.selectedCategory;
			this.filterDataByCategory(selectedCategory);
			console.log("Selected category:", selectedCategory);
		});
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
	// Function to re-render the component when data changes
	render() {
		if (this.dataFiltered) {
			this.root.innerHTML = `
		    <link rel="stylesheet" href="./components/resourcesListed.css">
            <ul class="toolkit-results-list">
                ${Object.entries(this.dataFiltered)
					.reverse()
					.map(
						([key, value]) => `
                    <li class="resource-item" id="${key}">
                        <article class="resource-card">
							<div class="row">
								<span class="media-type">
									${value.resourceType}
								</span>
								<span class="key">
									# ${key}
								</span>
							</div>
                            <h3 class="title">
                                <a class="link"
                                    href="${value.resourceLink}" 
                                    target="_blank">
                                    ${value.resourceTitle}
                                </a>
                            </h3>
                            <div class="meta">
                                <span class="author">
                                    ${value.authors.join(", ")}
                                </span>

                            </div>
                            <div class="meta">
								<span class="icon-block">
									<svg class="icon" viewBox="0 0 576 512">
										<path d="M416 128c-8.875 0-16 7.125-16 16s7.125 16 16 16s16-7.125 16-16S424.9 128 416 128zM547.5 4.125C541.4 1.375 534.8 0 528 0c-11.62 0-23.12 4.25-32.13 12.38L456.2 48h-16.5l-39.63-35.62c-14.13-12.75-34.37-15.88-51.63-8.25C331.1 11.88 320 29 320 48V160c0 4.25 .875 8.25 1.25 12.38l-47 7.125C206.8 189.8 149.6 225.9 112 277V184C112 135.5 72.5 96 24 96C10.75 96 0 106.8 0 120c0 13.35 10.87 24.13 24.16 24.01C46.69 143.8 64 164.4 64 186.9L64 399.2C64 472.8 103.4 512 152 512h184c8.875 0 16-7.125 16-15.1C352 478.4 337.6 464 320 464h-16.12c-.125-7.375-.75-14.62-1.876-21.75L384 394V464c0 26.4 21.6 48 48 48h32c26.4 0 48-21.6 48-48V270.2C550.1 248 576 207.1 576 160V48C576 29 564.9 11.88 547.5 4.125zM464 464h-32v-98c0-11.5-6.125-22.12-16.12-27.75c-9.876-5.75-22.12-5.625-32.12 .125L287.5 395.1c-12.12-25-30.25-46.88-53.5-63.13c-7.499-5.25-18.12-2.25-22.5 5.75L204 351.1c-4 7.25-2.5 16.5 4.125 21.38C237.3 393.6 255 427.5 255.8 464H152c-22 0-40-17.1-40-39.1c0-99.25 71.25-182.1 169.5-197l53.5-8.125C356.4 259.8 398.8 288 448 288c5.5 0 10.75-1 16-1.625V464zM528 160c0 44.12-35.88 80-80 80s-80-35.87-80-79.99V48L421.4 96h53.25L528 48V160zM464 144C464 152.9 471.1 160 480 160s16-7.125 16-15.1S488.9 128 480 128S464 135.1 464 144z"/>
									</svg>
								</span>
                                <span class="category">
                                    ${value.category}
                                </span>
								<span class="icon-block">
									<svg class="icon" viewBox="0 0 576 512">
										<path d="M173.1 63.1H126.1c-32.1 0-61.65 17.1-77.12 44.63L17.65 164.5C6.103 185.1 0 208.4 0 231.8v107.9c0 77.37 64.6 140.3 144 140.3H236c39.92 0 72.56-31.19 73.95-70.04c17.5-13.63 28.05-34.63 28.05-56.74v-13.53c0-3.557-.273-7.102-.814-10.61C346.8 316.6 352 301.4 352 285.5V271.1h87.1C479.7 271.1 512 239.7 512 199.1s-32.3-72-72-72h-169.7L241 95.43C224.5 75.46 199.8 63.1 173.1 63.1zM173.1 111.1c12.31 0 23.77 5.281 31.39 14.5L220.2 143.1L176 143.1c-8.844 0-16 7.162-16 16.01s7.156 16 16 16L439.1 175.1c13.23 0 24 10.78 24 24s-10.77 24-24 24h-142c-9.578 0-16.04 7.941-16.04 16.15c0 6.433 4.017 12.31 10.17 14.73C293.2 255.3 304 260.3 304 271.1v13.53c0 20.97-19.58 17.92-19.58 34.27c0 8.211 5.583 9.847 5.583 19.88v13.53c0 25.55-28.23 18.27-28.23 38.66c0 .1566 .0027 .3126 .0081 .4679l.2183 15.03c0 13.59-11.66 24.62-25.1 24.62H143.1c-52.94 0-95.1-41.41-95.1-92.31V231.8c0-15.25 3.984-30.41 11.52-43.88l31.34-55.78c6.984-12.44 20.5-20.16 35.27-20.16H173.1z"/>
									</svg>
								</span>
                                <span class="tags">
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
				`
					)
					.join("")}
            </ul>`;
		} else {
			this.root.innerHTML = `<p>Failed to load the resources</p>`;
		}
	}
}
customElements.define("toolkit-resources-listed", ResourcesListed);

/*

*/
