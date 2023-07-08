// "https://raw.githubusercontent.com/mdugg/ux-playbook/main/data/resources.json"
// "../../data/resources.json"

// GET MAIN RESOURCE
new Promise((resolve, reject) => {
	fetch(
		"https://raw.githubusercontent.com/mdugg/ux-playbook/main/data/resources.json"
	)
		.then((data) => data.json())
		.then((json) => {
			resolve(buildResultCard(json));
		})
		.catch((error) => reject(error));
});

// MAIN RESULTS SECTION
const buildResultCard = (json) => {
	// count resources in the JSON db
	let resourceCount = Object.entries(json);
	let resourceCountEl = document.getElementById("resourceCount");
	resourceCountEl.innerHTML += `${resourceCount.length}`;

	// card
	const allResults = document.getElementById("searchResults");
	allResults.innerHTML = Object.entries(json)
		.map(([key, value]) => {
			return `
				<li class="resource-item">
					<article class="resource-card">
						<h3 class="resource-card__content">
							<a class="resource-card__link"
								href="${value.resourceLink}" 
								target="_blank">
								${value.resourceTitle}
							</a>
						</h3>
						<div class="resource-card__categories mt-1">
							${value.category}
						</div>
						<div class="resource-card__tags">
							<span class="tag"># ${key}</span>
							<span class="tag">${value.resourceType}</span>
						</div>
					</article>
				</li>
				`;
		})
		.join("");
};
// COUNT HOW MANY RESOURCES LOADED ON PAGE
// https://dev.to/isabelxklee/how-to-loop-through-an-htmlcollection-379k
window.addEventListener("load", (event) => {
	let resourceCountEl = document.getElementById("resourceCountLoaded");
	setTimeout(() => {
		let resourcesCount =
			document.getElementsByClassName("resource-item").length;
		resourceCountEl.innerHTML += `${resourcesCount}`;
		console.log(resourcesCount);
	}, "1000");
});

const buildCategories = () => {};
const buildTags = () => {};
const resultCounter = () => {};
