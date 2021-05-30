const express = require('express');
const router = express.Router();
const data = require('../../data');
const movieData = data.movies;
const deepEqual = require('deep-equal');

router.get('/', async (req, res) => {
  try {
    let movieList = await movieData.getAll(
      parseInt(req.query.take),
      parseInt(req.query.skip));
    res.json(movieList);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.get('/:id', async (req, res) => {
  try {
    let movie = await movieData.getById(req.params.id);
    res.json(movie);
  } catch (e) {
    res.status(404).json({ error: 'Movie not found' });
  }
});

router.post('/', async (req, res) => {
  let movieInfo = req.body;

  if (!movieInfo) {
    res.status(400).json({ error: 'You must provide data to create a movie' });
    return;
  }

  if (!movieInfo.title) {
    res.status(400).json({ error: 'You must provide a title' });
    return;
  }

  if (!movieInfo.cast) {
    res.status(400).json({ error: 'You must provide an cast' });
    return;
  }

  if (!movieInfo.info) {
    res.status(400).json({ error: 'You must provide a info' });
    return;
  }

  if (!movieInfo.plot) {
    res.status(400).json({ error: 'You must provide a plot' });
    return;
  }

  if (!movieInfo.rating) {
    res.status(400).json({ error: 'You must provide a rating' });
    return;
  }

  try {
    const newMovie = await movieData.create(
      movieInfo.title,
      movieInfo.cast,
      movieInfo.info,
      movieInfo.plot,
      movieInfo.rating
    );
    res.json(newMovie);
  } catch (e) {
    console.log(e)
    res.status(500).json({error: e});
  }
});

router.put('/:id', async (req, res) => {
  let movieInfo = req.body;

  if (!movieInfo) {
    res.status(400).json({ error: 'You must provide data to create a movie' });
    return;
  }

  if (!movieInfo.title) {
    res.status(400).json({ error: 'You must provide a title' });
    return;
  }

  if (!movieInfo.cast && movieInfo.cast.length < 1) {
    res.status(400).json({ error: 'You must provide a cast' });
    return;
  }

  if (!movieInfo.info) {
    res.status(400).json({ error: 'You must provide a info' });
    return;
  }

  if (!movieInfo.plot) {
    res.status(400).json({ error: 'You must provide a plot' });
    return;
  }

  if (!movieInfo.rating) {
    res.status(400).json({ error: 'You must provide a rating' });
    return;
  }

  try {
    await movieData.getById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
  try {
    const updatedMovie = await movieData.update(req.params.id, movieInfo, "put");
    res.json(updatedMovie);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.patch('/:id', async (req, res) => {
  const requestBody = req.body;
  let updatedObject = {};
  try {
    const oldMovie = await movieData.getById(req.params.id);
    if (requestBody.title && requestBody.title !== oldMovie.title)
      updatedObject.title = requestBody.title;

    if (requestBody.cast && !deepEqual(requestBody.cast, oldMovie.cast))
      updatedObject.cast = requestBody.cast;

    if (requestBody.info && !deepEqual(requestBody.info, oldMovie.info))
      updatedObject.info = requestBody.info;

    if (requestBody.plot && requestBody.plot !== oldMovie.plot)
      updatedObject.plot = requestBody.plot;

    if (requestBody.rating && requestBody.rating !== oldMovie.rating)
      updatedObject.rating = requestBody.rating;

  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }

  if (Object.keys(updatedObject).length > 0) {
    try {
      const updatedMovie = await movieData.update(
        req.params.id,
        updatedObject,
        "patch"
      );
      res.json(updatedMovie);
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e });
    }
  } else {
    res
      .status(400)
      .json({
        error:
          'No fields have been changed from their inital values, so no update has occurred'
      });
  }
});

router.post('/:id/comments', async (req, res) =>{
  let commentInfo = req.body;

  if (!commentInfo) {
    res.status(400).json({ error: 'You must provide data to add a comment in the movie' });
    return;
  }

  if (!commentInfo.name) {
    res.status(400).json({ error: 'You must provide a name' });
    return;
  }

  if (!commentInfo.comment) {
    res.status(400).json({ error: 'You must provide a comment' });
    return;
  }

  try {
    await movieData.getById(req.params.id);
  } catch (error) {
    res.status(400).json({ error: error });
  }

  try {
    const newComment = await movieData.addComment(
      req.params.id,
      commentInfo
    );
    res.json(newComment);
  } catch (e) {
    console.log(e);
    res.status(500).json({error: e});
  }
});

router.delete('/:movieId/:commentId', async (req, res) => {
  if (!req.params.movieId) throw 'You must specify an ID to delete';
  let movie;
  try {
    movie = await movieData.getById(req.params.movieId);
    console.log(movie)
    if (!movie.comments.some(comment => comment._id === req.params.commentId))
      throw 'Comment does not exist in the movie';
  } catch (e) {
    console.log(e)
    res.status(404).json({ error: e });
    return;
  }

  try {
    await movieData.removeComment(req.params.movieId, req.params.commentId);
    res.status(200).json({movieId: movie._id.toString(), commentId: req.params.commentId, deleted: true});
  } catch (e) {
    console.log(e);
    res.status(500).json({error: e});
  }
});

module.exports = router;
