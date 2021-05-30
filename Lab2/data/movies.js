const { movies } = require('../movies');

module.exports = {
  async getAll() {
    return movies;
  }
}
