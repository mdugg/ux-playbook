// "https://raw.githubusercontent.com/mdugg/ux-playbook/main/data/resources.json"
// "../data/resources.json"

const MainArticles = {
	url: "../data/resources.json",
	fetchArticles: async () => {
		try {
			const result = await fetch(MainArticles.url);
			const data = await result.json();
			// console.log(data);
			return data;
		} catch (error) {
			console.error("Error fetching data: ", error);
			throw error;
		}
	},
};

export default MainArticles;
