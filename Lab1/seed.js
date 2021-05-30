// READY?! Let's go!
const dbConnection = require("./config/mongoConnection");
const data = require('./data');
const movieData = data.movies;
const { movies } = require('./dump');

async function createMovies() {
  let createdMovies = 0;
  for(let i = 0; i < movies.length; i++) {
    await movieData.create(
      movies[i].title,
      movies[i].cast,
      movies[i].info,
      movies[i].plot,
      movies[i].rating
    );
    createdMovies++;
  }
  console.log(`${createdMovies} movies created !!`);
}

async function dumpDatabase() {
  // create new db and new collections with data
  const db = await dbConnection();
  await db.dropDatabase();
  await createMovies();
  await db.serverConfig.close();
}

dumpDatabase();
