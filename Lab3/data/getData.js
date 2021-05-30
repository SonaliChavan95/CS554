const axios = require('axios');

async function searchApi(query) {
  let { data } = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  return data;
}

async function getShowApi(id) {
  let { data } = await axios.get(`http://api.tvmaze.com/shows/${id}`);
  console.log(data)
  return data;
}

async function getAllShowsApi() {
  let { data } = await axios.get(`http://api.tvmaze.com/shows`);
  return data;
}

module.exports = { searchApi, getShowApi, getAllShowsApi };