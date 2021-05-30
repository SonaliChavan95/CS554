const axios = require('axios');
const Redis = require('ioredis');
const redis = new Redis();
const md5 = require('blueimp-md5');
const publickey = '98945702c0d81859c509bc344b5b5d75';
const privatekey = 'd9eedd3c84701833ed027b4e9f287fcc199186d5';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/';

module.exports = {
  async index(req, res) {
    try {
      let { page } =  req.params;
      if (isNaN(parseInt(page))) throw new Error("Page must be an integer")
      let { query } = req.query;
      let cacheKey = query ? `comics:${query}` : `comics:${page}`;
      let cache = await redis.get(cacheKey);

      if(cache) {
        res.json({ data: JSON.parse(cache) });
        return;
      }

      page = query ? 1 : parseInt(page);

      const { data: data } = await axios.get(`${baseUrl}comics`, {
        params: {
          ts: ts,
          apikey: publickey,
          hash: hash,
          limit: 21,
          offset: page === 1 ? 0 : (page-1) * 20,
          titleStartsWith: query
        }
      });

      redis.set(cacheKey, JSON.stringify(data));
      res.json({ data: data });
    } catch (error) {
      res.status(404).json({ message: error });
      console.error(error);
    }
  },

  async show(req, res) {
    try {
      let cache = await redis.get(req.path);
      if(cache) {
        res.json({ data: JSON.parse(cache) });
        return;
      }

      let { id } =  req.params;
      if (isNaN(parseInt(id))) throw new Error("Id must be an integer")
      const { data } = await axios.get(`${baseUrl}comics/${id}`, {
        params: {
          ts: ts,
          apikey: publickey,
          hash: hash
        }
      });

      redis.set(req.path, JSON.stringify(data));

      res.json({ data: data });
    } catch (error) {
      res.status(404).json({ message: error });
      console.error(error);
    }
  },
}