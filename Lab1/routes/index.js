const movieRoutes = require('./api/movies');

const constructorMethod = (app) => {
  app.use('/api/movies', movieRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
