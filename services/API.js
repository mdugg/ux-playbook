// "https://mdugg.github.io/ux-playbook/data/resources.json"
// "../data/resources.json"

const MainArticles = {
	url: "https://mdugg.github.io/ux-playbook/data/resources.json",
	fetchArticles: async () => {
		try {
			const result = await fetch(MainArticles.url);
			const data = await result.json();
			// data is an object with nested objects
			// convert data to array of objects
			const dataArray = [];
			for (const obj in data) {
				dataArray.push(data[obj]);
			}
			console.log(dataArray);
			console.log(data);
			return dataArray;
		} catch (error) {
			console.error("Error fetching resources.json - ", error);
			throw error;
		}
	},
};

export default MainArticles;
