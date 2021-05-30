const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const { v4: uuidv4 } = require('uuid');

module.exports = {
  getById: async function(id) {
    if (!id) throw 'You must provide a movie id to search for';
    if (typeof id != "string" || id.trim().length === 0) throw 'You must provide a valid movie id to search for';

    const movieCollection = await movies();
    const movie = await movieCollection.findOne({ _id: id });
    if (movie === null) throw 'No movie with that id';
    return movie;
  },

  getAll: async function(take, skip) {
    if(take == null || isNaN(take)) take = 20
    if(skip == null || isNaN(skip)) skip = 0
    if(take < 0) throw 'take must have positive value';
    if(skip < 0) throw 'skip must have positive value';
    take = (take > 100) ? 100 : (take < 20 ? 20 : take)
    console.log(take)

    const movieCollection = await movies();

    return await movieCollection
      .find({})
      .limit(take)
      .skip(skip)
      .toArray();
  },

  create: async function(title, cast, info, plot, rating) {
    if (!title || typeof title !== 'string' || title.trim().length === 0)
      throw 'You must provide a title for your movie';

    if (!cast || typeof cast !== 'object' || !Array.isArray(cast))
      throw 'You must provide a cast for your movie';
    for(let i = 0; i < cast.length; i++) {
      if(typeof cast[i] !== 'object')
        throw 'You must provide info for your movie';
      if(!cast[i].firstName || typeof cast[i].firstName !== 'string' || cast[i].firstName.trim().length === 0)
        throw 'You must provide a firstName for your movie cast';
      if(!cast[i].lastName || typeof cast[i].lastName !== 'string' || cast[i].lastName.trim().length === 0)
        throw 'You must provide a lastName for your movie cast';
    }

    if(!info || typeof info !== 'object')
      throw 'You must provide info for your movie';
    if(!info.director || typeof info.director !== 'string' || info.director.trim().length === 0)
      throw 'You must provide a director for your movie';
    if(!info.yearReleased || typeof info.yearReleased !== 'number' || info.yearReleased < 1800 || info.yearReleased > 2021)
      throw 'You must provide a yearReleased for your movie';

    if (!plot || typeof plot !== 'string' || plot.trim().length === 0)
      throw 'You must provide a plot for your movie';

    if(rating == null || typeof rating !== 'number' || rating < 0 || rating > 5)
      throw 'You must provide a rating for your movie between 0 to 5';

    const movieCollection = await movies();

    let newMovie = {
      _id: uuidv4(),
      title: title,
      cast: cast,
      info: info,
      comments: [],
      plot: plot,
      rating: rating
    };

    const insertInfo = await movieCollection.insertOne(newMovie);
    if (insertInfo.insertedCount === 0) throw 'Could not add movie';

    const newId = insertInfo.insertedId;
    const movie = await this.getById(`${newId}`);
    return movie;
  },

  update: async function(id, newMovieData, requestType = "put") {
    const{ title, cast, info, plot, rating } = newMovieData;

    if (!id) throw 'You must provide an movie id to search for';
    if (typeof id != "string" || id.trim().length === 0)
      throw 'You must provide a valid movie id to search for';

    if (title)
      if (typeof title != 'string' || title.trim().length === 0)
        throw 'You must provide a title for your movie';

    if (cast) {
      if (typeof cast !== 'object' || !Array.isArray(cast))
      throw 'You must provide a cast for your movie';

      for(let i = 0; i < cast.length; i++) {
        if(typeof cast[i] !== 'object')
          throw 'You must provide info for your movie';
        if(!cast[i].firstName || typeof cast[i].firstName !== 'string' || cast[i].firstName.trim().length === 0)
          throw 'You must provide a firstName for your movie cast';
        if(!cast[i].lastName || typeof cast[i].lastName !== 'string' || cast[i].lastName.trim().length === 0)
          throw 'You must provide a lastName for your movie cast';
      }
    }

    if(info) {
      if(typeof info != 'object')
        throw 'You must provide valid info for your movie';
      if(!info.director || typeof info.director != 'string' || info.director.trim().length === 0)
        throw 'You must provide a director for your movie';
      if(!info.yearReleased || typeof info.yearReleased != 'number' || info.yearReleased < 1800 || info.yearReleased > 2021)
        throw 'You must provide a released year for your movie between 1800 and 2021';
    }

    if (plot)
      if (typeof plot != 'string' || plot.trim().length === 0)
        throw 'You must provide a plot for your movie';

    if (rating != null)
      if(typeof rating != 'number' || rating < 0 || rating > 5)
        throw 'You must provide a rating for your movie between 0 to 5';

    const movieCollection = await movies();
    let updatedMovie = {
      title: title,
      cast: cast,
      info: info,
      plot: plot,
      rating: rating
    };
    let updatedInfo, query;
    if(requestType == "patch") {
      Object.keys(updatedMovie).forEach(key => updatedMovie[key] === undefined ? delete updatedMovie[key] : {});
      delete updatedMovie.comments;
      query = (Object.keys(updatedMovie).length !== 0) ? { $set: updatedMovie } : {} ;
    } else {
      query = { $set: updatedMovie };
    }

    updatedInfo = await movieCollection.updateOne(
      { _id: id },
      query
    );

    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update movie successfully';
    }

    return await this.getById(id);
  },

  addComment: async function(id, newComment) {
    if (!id) throw 'You must provide an movie id to search for';
    const{ name, comment } = newComment;

    if (!name || typeof name != 'string' || name.trim().length === 0)
      throw 'You must provide a name for your movie';

    if (!comment || typeof comment != 'string' || comment.trim().length === 0)
      throw 'You must provide a comment for your movie';

    const movieCollection = await movies();

    newComment = {
      _id: uuidv4(),
      name: name,
      comment: comment
    };

    let updatedInfo = await movieCollection.update(
      { _id: id },
      { $push: { comments: { $each: [ newComment ] } } }
    )

    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update movie successfully';
    }

    return await this.getById(id);
  },

  removeComment: async function (id, commentId) {
    if (!id) throw 'You must provide an movie id to search for';
    if (!commentId) throw 'You must provide an comment id to search for';
    const movieCollection = await movies();
    let deletedInfo = await movieCollection
      .updateOne({ _id: id }, { $pull: { comments: { _id: commentId } } });

    if (deletedInfo.deletedCount === 0) {
      throw 'could not delete movie comment successfully';
    }

    return await this.getById(id);
  }
};
