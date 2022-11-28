// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
// https://raw.githubusercontent.com/mdugg/ux-playbook/main/data/resources.json
// ../../data/resources.json

// async function populate() {
// 	const requestURL =
// 		"https://raw.githubusercontent.com/mdugg/ux-playbook/main/data/resources.json";
// 	const request = new Request(requestURL);
// 	const response = await fetch(request);
// 	const playbook = await response.json();

// 	populatePlaybook(playbook);
// }
// (function populatePlaybook(data) {
// 	console.log(data);
// })();

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
const buildResultCard = (json) => {
	const allResults = document.getElementById("searchResults");
	allResults.innerHTML = Object.values(json)
		.map((data) => {
			return `
				<li class="search-card">
					<div class="search-card__tag">
						${data.resourceType[0]}
 					</div>
					<div class="search-card__content">
						<ul class="search-card__categories">
							<li>${data.category[0]}<li>
							<li>${data.category[1]}<li>
						</ul>
						<a href="${data.resourceLink}" target="_blank">
							${data.resourceTitle}
						</a>
					</div>
				</li>
				`;
		})
		.join("");
};
const buildCategories = () => {};
const buildTags = () => {};
const resultCounter = () => {};

// ${data.category.map((item) => {
// 	return `
// 	<li class="item">
// 		${item}
// 	</li>`;
// })
