import MainArticles from "./API.js";
// import FiltersCategories from "../componentsfiltersCategories.js";

export let resultsList = [];

let dataState = async () => {
	let result = await fetch(MainArticles.url);
	let data = await result.json();
	for (let obj in data) {
		resultsList.push(data[obj]);
	}
	return resultsList;
};
dataState();

// Listen for the custom category filter event
document.addEventListener("CategoryFilterChanged", (event) => {
	// Handle the event when the category filter changes
	let selectedCategory = event.detail.selectedCategory;
	console.log(selectedCategory);
	// filter data based on the selected category and update resultsList
	resultsList = resultsList.filter(
		(item) => item.category === selectedCategory
	);
});

export default resultsList;

/*
- get a custom event dispatching from Categories and being listened for and handled in results
- update the data state based on dispatched event
- have resources grab the data from results
- have categories change the data in results
*/
