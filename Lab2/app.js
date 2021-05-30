const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const Handlebars = require('handlebars');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    anchorName: (name) => {
      return name.toLowerCase().split(" ").join("-");
    },
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    castList: (casts) => {
      let str = [];
      for(let i = 0; i < casts.length; i++) {
        str.push(`${casts[i].firstName} ${casts[i].lastName}`);
      }

      return str.join(", ");
    },
    truncate: (str) => {
      num = 150;
      // If the length of str is less than or equal to num
      // just return str--don't truncate it.
      if (str.length <= num) {
        return str
      }
      // Return str truncated with '...' concatenated to the end of str.
      return str.slice(0, num) + '...'
    }
  },
  partialsDir: ['views/partials/']
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.engine('handlebars', handlebarsInstance.engine);

app.set('view engine', 'handlebars');

app.use('/public', static);
app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
