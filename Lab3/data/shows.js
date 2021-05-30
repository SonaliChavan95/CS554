const getData = require('./getData');

let exportedMethods = {
  async searchShows(searchTerm) {
    const searchCollection = await getData.searchApi(searchTerm);
    const shows = searchCollection.map((data) => data.show);
    return shows.slice(0, 20);
  },

  async getShowById(id) {
    if(Math.sign(id) != 1) throw "Enter a positive id"
    const show = await getData.getShowApi(id);

    if (show === undefined) throw 'Show not found';

    return {
      name: show.name,
      img: show.image && show.image.medium || "/public/img/no-image.jpeg",
      language: show.language,
      genres: show.genres,
      rating: show.rating && show.rating.average || 'N/A',
      network: show.network && show.network.name,
      summary: show.summary && show.summary.replace(/(<([^>]+)>)/gi, "")
    };
  },

  async getAllShows() {
    return await getData.getAllShowsApi();
  }
};

module.exports = exportedMethods;