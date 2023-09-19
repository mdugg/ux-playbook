// "https://raw.githubusercontent.com/mdugg/ux-playbook/main/data/resources.json"
// "../../data/resources.json"

// GET MAIN RESOURCE
new Promise((resolve, reject) => {
	fetch(
		"https://raw.githubusercontent.com/mdugg/ux-playbook/main/data/resources.json"
	)
		.then((data) => data.json())
		.then((json) => {
			// resolve(resourceCard(json));
			// resolve(buildCategories(json));
			// resolve(buildTags(json));
		})
		.catch((error) => reject(error));
});

// MAIN RESULTS SECTION
// const resourceCard = (json) => {
// count resources in the JSON db
// let resourceCount = Object.entries(json);
// let resourceCountEl = document.getElementById("resourceCount");
// resourceCountEl.innerHTML += `${resourceCount.length}`;

// card
// 	const allResults2 = document.getElementById("searchResults2");
// 	allResults2.innerHTML = Object.entries(json)
// 		.reverse()
// 		.map(([key, value]) => {
// 			if (key !== "schema") {
// 				return `
// 				<li class="resource-item">
// 					<article class="resource-card">
// 						<h3 class="resource-card__content">
// 							<a class="resource-card__link"
// 								href="${value.resourceLink}"
// 								target="_blank">
// 								${value.resourceTitle}
// 							</a>
// 						</h3>
// 						<div class="resource-card__meta">
// 							<span class="resource-card__meta-value">
// 								${value.authors.join(", ")}
// 							</span>
// 							<span class="resource-card__meta-item media">
// 								${value.resourceType}
// 							</span>
// 							<span class="resource-card__count">
// 								# ${key}
// 							</span>
// 						</div>
// 						<div class="resource-card__meta">
// 							<span class="resource-card__meta-value">
// 								${value.category}
// 							</span>
// 							<span class="resource-card__meta-value">
// 								${value.tags.join(", ")}
// 							</span>
// 							<span class="resource-card__meta-item media">
// 								${value.resourceType}
// 							</span>
// 						</div>
// 						<ul>
// 							${
// 								value.notes.description
// 									? value.notes.bulletPoints
// 											.map((bullet) => {
// 												return `<li>${bullet}</li>`;
// 											})
// 											.join("")
// 									: ""
// 							}
// 						</ul>
// 					</article>
// 				</li>
// 				`;
// 			}
// 		})
// 		.join("");
// };

/* 
COUNT HOW MANY RESOURCES LOADED ON PAGE
https://dev.to/isabelxklee/how-to-loop-through-an-htmlcollection-379k
research Array.from (...nodelist / HTMLCollection)
window.addEventListener("DOMContentLoaded", (event) => {
	let resourceCountEl = document.getElementById("resourceCountLoaded");
	setTimeout(() => {
		let resourcesCount =
			document.getElementsByClassName("resource-item").length;
		resourceCountEl.innerHTML += `${resourcesCount}`;
	}, "1000");
});
*/

// CATEGORIES
/*
const buildCategories = (json) => {
	// DOM hooks
	let categoriesDOM = document.getElementById("categories2");
	// empty array to receive each category array, flatten later
	let categories = [];
	for (const obj in json) {
		categories.push(json[obj].category);
	}
	// flatten nested arrays
	let categoriesCombined = categories.flat();
	let categoriesCount = {};

	// Count occurrences of each category
	categoriesCombined.forEach((category) => {
		if (categoriesCount[category]) {
			categoriesCount[category]++;
		} else {
			categoriesCount[category] = 1;
		}
	});
	// unique categories only using new Set; remove duplicates
	let uniqueCategories = Array.from(new Set(categoriesCombined));
	// Sort unique categories alphabetically
	let sortedCategories = uniqueCategories.slice().sort();

	categoriesDOM.innerHTML = sortedCategories
		.map((category) => {
			return `
			<li class="item">
				<button data-category="${category}" class="button-category">
					<span class="label">${category}</span> 
					<span class="count">(${categoriesCount[category]})</span>
				</button>
			</li>
			`;
		})
		.join("");
};
*/

// TAGS
// const buildTags = (json) => {
// 	let tagsDOM = document.getElementById("tags");
// 	let categories = [];
// 	for (const obj in json) {
// 		categories.push(json[obj].tags);
// 	}
// 	let categoriesCombined = categories.flat();
// 	let categoriesCount = {};

// 	categoriesCombined.forEach((category) => {
// 		if (categoriesCount[category]) {
// 			categoriesCount[category]++;
// 		} else {
// 			categoriesCount[category] = 1;
// 		}
// 	});
// 	let uniqueCategories = Array.from(new Set(categoriesCombined));
// 	let sortedCategories = uniqueCategories.slice().sort();

// 	tagsDOM.innerHTML = sortedCategories
// 		.map((category) => {
// 			return `
// 			<li class="tag">
// 				<button data-category="${category}" class="button-tags">
// 					<span class="label">${category}</span>
// 					<span class="count">(${categoriesCount[category]})</span>
// 				</button>
// 			</li>
// 			`;
// 		})
// 		.join("");
// };
