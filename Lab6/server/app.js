const { ApolloServer } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const Redis = require('ioredis');
const uuid = require('uuid');
const typeDefs = require('./src/schema');
const redis = new Redis();

class UnsplashAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.unsplash.com/';
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `Client-ID ${this.context.token}`);
  }

  async getPhotos(pageNum = 1, limit = 12) {
    const response = await this.get('photos', {
      per_page: limit,
      page: pageNum
    });

    const binnedImages = await redis.smembers('binnedImages');

    return Array.isArray(response)
      ? response.map(photo => this.photoReducer(photo, binnedImages))
      : [];
  }

  photoReducer(photo, binnedImages) {
    return {
      id: photo.id,
      url: photo.urls && photo.urls.small,
      posterName: photo.user && photo.user.name,
      description: photo.description || photo.alt_description,
      userPosted: false,
      binned: binnedImages.includes(photo.id),
      numBinned: photo.likes
    };
  }
}

const resolvers = {
  Query: {
    unsplashImages: async (_source, { pageNum }, { dataSources }) => {
      return dataSources.photosAPI.getPhotos(pageNum);
    },
    binnedImages: async (_source, { }, {}) => {
      const binnedImages = await redis.smembers('binnedImages');
      if(binnedImages.length === 0) return;
      const binned = await redis.mget(binnedImages);
      return binned.map(post => JSON.parse(post));
    },
    userPostedImages: async (_source, { }, { dataSources }) => {
      const postedImages = await redis.smembers('postedImages');
      if(postedImages.length === 0) return;
      const posts = await redis.mget(postedImages);
      return posts.map(post => JSON.parse(post));
    },
    // getTopTenBinnedPosts: async(_source, { }, { dataSources }) => {

    // }
  },
  Mutation: {
    uploadImage: async (_, {url, description, posterName}, {}) => {
      if (!url || typeof url !== 'string' || url.trim().length < 1) {
        throw new UserInputError('Invalid argument value', {
          argumentName: 'url'
        });
      }

      if (!description || typeof description !== 'string' || description.trim().length < 1) {
        throw new UserInputError('Invalid argument value', {
          argumentName: 'description'
        });
      }

      if (!posterName || typeof posterName !== 'string' || posterName.trim().length < 1) {
        throw new UserInputError('Invalid argument value', {
          argumentName: 'posterName'
        });
      }

      const newImgPost = {
        id: uuid.v4(),
        url,
        description,
        posterName,
        binned: false,
        userPosted: true,
        numBinned: 0
      };

      await redis.sadd('postedImages', newImgPost.id);
      await redis.set(newImgPost.id, JSON.stringify(newImgPost));
      return newImgPost;
    },
    updateImage: async (_, {id, url, posterName, description, userPosted, binned}, {}) => {
      let img = await redis.get(id);
      if (img) {
        img = JSON.parse(img);

        if (!img.userPosted && binned === false) {
          await redis.del(img.id);
          await redis.srem('binnedImages', img.id);
        } else {
          if(url) img.url = url;
          if(description) img.description = description;
          if(posterName) img.posterName = posterName;
          if(binned !== undefined) img.binned = binned;
          if(userPosted !== undefined) img.userPosted = userPosted;

          await redis.set(img.id, JSON.stringify(img));
          binned ? await redis.sadd('binnedImages', img.id) : await redis.srem('binnedImages', img.id);
        };
      } else {
        if(!binned) return;
        img = {
          id: id,
          url,
          description,
          posterName,
          binned: true,
          userPosted: false,
          numBinned: 1 // need to think
        };

        await redis.set(img.id, JSON.stringify(img));
        await redis.sadd('binnedImages', img.id)
      }
      return img;
    },
    deleteImage: async (_, { id }, {}) => {
      let img = await redis.get(id);
      if(!img) return;
      img = JSON.parse(img);
      if(!img.userPosted) return;
      await redis.del(id);
      await redis.srem('postedImages', id);
      await redis.srem('binnedImages', id);
      return img;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      photosAPI: new UnsplashAPI(),
    };
  },
  context: () => {
    return {
      token: '4wmspz7b6kn0gPjOYxXEeRkVVuO8xaoLPzvZl-e09RE',
    };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
