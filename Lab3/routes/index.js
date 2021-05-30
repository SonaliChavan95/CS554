const data = require('../data');
const showData = data.shows;

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//log error to the console if any occurs
client.on("error", (err) => {
  console.log(err);
});

const constructorMethod = (app) => {
  // list of shows
  app.get('/', async (req, res) => {
    console.log(req.url);

    try {
      client.get('homePage', async (err, shows) => {
        if (err) throw err;

        if (shows) {
          res.status(200).send(shows);
        } else {
          const shows = await showData.getAllShows();

          res.render('shows/index', {
            shows: shows,
            title: 'Shows Found'
          }, async function(err, html) {
            await client.setAsync(`homePage`, html);
            res.send(html);
          });
        }
      });
    } catch (e) {
      res.status(500).render('error', {
        message: e,
        title: "500 Internal Server Error"
      });
    }
  });

  app.get('/show/:id', async (req, res) => {
    console.log(req.url);
    let cachedPageExists = await client.existsAsync(`${req.url}`);
    if (cachedPageExists){
      let cachedHTML = await client.getAsync(`${req.url}`);
      res.send(cachedHTML);
    } else {
      try {
        const show = await showData.getShowById(req.params.id);
        console.log(show);
        res.render('shows/single', {
          show: show,
          title: show.name
        }, async function(err, html) {
          await client.setAsync(req.url, html);
          res.send(html);
        });
      } catch (e) {
        res.status(404).render('error', {
          message: e || "TV Show is not found for given id",
          title: "404 Not Found"
        });
      }
    }
  })

  app.post('/search', async (req, res) => {
    let searchData = req.body;
    let errors = [];

    if (!searchData.searchTerm || searchData.searchTerm.trim().length < 1) {
      errors.push('No search term provided');
    }

    if (errors.length > 0) {
      res.status(400).render('error', {
        message: "Enter search term",
        title: "400 Bad Request"
      });
      return
    }

    try {
      client.zincrby('popular-search', 1, searchData.searchTerm);

      let cachedPageExists = await client.existsAsync(`${req.url}-${searchData.searchTerm}`);
      if (cachedPageExists){
        const cachedHTML = await client.getAsync(`${req.url}-${searchData.searchTerm}`);
        res.send(cachedHTML);
      } else {
        const searchResult = await showData.searchShows(
          searchData.searchTerm
        );

        res.render('shows/index', {
          shows: searchResult,
          title: 'Shows Found',
          query: searchData.searchTerm
        }, async function(err, html){
          await client.setAsync(`${req.url}`, html);
          res.send(html);
        });
      }
    } catch (e) {
      res.status(500).render('error', {
        message: e,
        title: "500 Internal Server Error"
      });
    }
  });

  app.get('/popularsearches', async (req, res) => {
    try {
      let searchCount = await client.zrevrangeAsync('popular-search', 0, 9, 'withscores');
      let hsh = {};
      for(let i = 0; i <  searchCount.length; i += 2) {
        hsh[searchCount[i]] = searchCount[i + 1]
      }
      res.render("shows/popular", {
        count: Object.keys(hsh).length,
        searchCount: hsh,
        title: 'Popular Shows'
      });
    } catch(e){
      res.status(500).render('error', {
        message: e,
        title: "500 Internal Server Error"
      });
    }
  });

  app.use('*', (req, res) => {
    console.log("wrong path");
    res.status(404).render('error', {
      message: 'Not found',
      title: "404 Not found"
    });
  });
};

module.exports = constructorMethod;