const data = require('../data');
const movieData = data.movies;

const constructorMethod = (app) => {
  app.get('/', async (req, res) => {
    try {
      const movies = await movieData.getAll();
      res.render('movies/index', {
        movieList: movies,
        pageTitle: "Movies"
      });
    } catch (e) {
      console.log(e);
    }
  });

  app.use('*', (req, res) => {
    console.log("wrong path");
    res.status(404).render('error', {
      message: 'Not found',
      title: "404 Not found"
    });
  });
}

module.exports = constructorMethod;