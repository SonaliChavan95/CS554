import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, Button } from '@material-ui/core';
import Queries from '../Queries';
import ImageItem from './ImageItem';
import '../css/App.css';
import '../css/Cards.css';

function Home({ content }) {
  const [page, setPage] = useState(1);
  let query, options = {}, title;

  switch (content) {
    case "my-bin":
      title = "Binned Images"
      query = Queries.GET_BINNED_IMAGES;
      options = {
        pollInterval: 500
      }
      break;
    case "home":
      title = "Check out these EPIC Images!"
      query = Queries.GET_UNSPLASHED_IMAGES;
      options = { variables: { pageNum: page } };
      break;
    case "my-posts":
      title = "Your Posts"
      query = Queries.USER_POST_IMG
      options = {
        pollInterval: 500
      }
      break;
    default:
  }

  const { loading, error, data } = useQuery(query, {
    ...options,
    fetchPolicy: 'network-only',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const buildCards = () => {
    let images = data && ( data.unsplashImages || data.binnedImages || data.userPostedImages );
    let cards;
    if(images) {
      cards =
        images.map((img) => {
          return (
            <Grid container item xs={12} sm={6} md={4} xl={2} key={img.id}>
              <ImageItem img={img} content={content} />
            </Grid>
          )
        });
    } else {
      cards = 'No images found';
    }
    return cards;
  };

  const paginationUI = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <div>
            <Button
                variant="contained"
                onClick={() => setPage(page + 1)}
              >
                Get More
              </Button>
          </div>
        </Grid>
      </Grid>
    )
  }

  return (
    <div className='App-body'>
      <div className='cards'>
        <h1>{title}</h1>

        {content === 'my-posts' ? <Link to='/new-post'> New Post </Link> : '' }

        <ul className='cards__items'>
          <Grid container spacing={1}>
            { buildCards() }
          </Grid>
        </ul>

        { content === "home" ? paginationUI() : '' }

        <div dangerouslySetInnerHTML={{__html: "copyright"}} />
      </div>
    </div>
  );
}

export default Home;