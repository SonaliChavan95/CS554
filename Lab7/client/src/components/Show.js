import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import{ fetchItem } from "../reducers/itemActions";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles,  Card, CardContent, CardMedia, Typography, CardHeader  } from '@material-ui/core';
import NotFound from './NotFound';
import '../App.css';

const useStyles = makeStyles({
  card: {
    textAlign: 'left',
    maxWidth: 550,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});

const Show = () => {
  let { id, contenttype } = useParams();
  const dispatch = useDispatch();
  const { notFound, loading, items, copyrightText } = useSelector(state => state.items);

  const classes = useStyles();
  useEffect(
    () => {
      async function fetchData() {
        try {
          dispatch(fetchItem(id, contenttype));
        } catch (e) {
          console.log('Error Occurred: ' + e);
        }
      }
      fetchData();
    },
    []
  );

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    if(notFound)
      return (<NotFound />);

    if(items.length === 0 ) return (<div></div>);

    return (
      <Card className={classes.card} variant='outlined'>
        <CardHeader className={classes.titleHead} title={items[0].name || items[0].title} />
        <CardMedia
          className={classes.media}
          component='img'
          image={items[0].thumbnail && items[0].thumbnail.path ? `${items[0].thumbnail.path}/landscape_medium.${items[0].thumbnail.extension}` : ''}
          title='show image'
        />

        <CardContent>
          <Typography variant='body2' color='textSecondary' component='span'>
            <dl>
              <p>
                <dt className='title'>Rating:</dt>
                {(items[0] && items[0].rating) && (
                  <dd>
                    {items[0].rating}
                  </dd>
                )}
              </p>

              <p>
                {(items[0] && items[0].characters && items[0].characters.available >= 1) && (
                  <>
                    <dt className='title'>Characters: </dt>
                    <span>
                      {items[0].characters.items.map((item, index) => {
                        if (items[0].characters.available > 1)
                          return <dd key={'characters'+'[' + index +']'}>{item.name},</dd>;
                        return <dd key={item.name}>{item.name}</dd>;
                      })}
                    </span>
                  </>
                )}
              </p>

              <p>
                {(items[0] && items[0].comics && items[0].comics.available >= 1) && (
                  <>
                    <dt className='title'>Comics: </dt>
                    <span>
                      {items[0].comics.items.map((item, index) => {
                        if (items[0].comics.available > 1)
                          return <dd key={'comics'+'[' + index +']'}>{item.name},</dd>;
                        return <dd key={item.name}>{item.name}</dd>;
                      })}
                    </span>
                  </>
                )}
              </p>

              <p>
                {(items[0] && items[0].series && items[0].series.available >= 1) && (
                  <>
                    <dt className='title'>Series: </dt>
                    <span>
                      {items[0].series.items.map((item, index) => {
                        if (items[0].series.available > 1)
                          return <dd key={'series'+'[' + index +']'}>{item.name},</dd>;
                        return <dd key={item.name}>{item.name}</dd>;
                      })}
                    </span>
                  </>
                )}
              </p>

              <p>
                <dt className='title'>Description:</dt>
                <dd>{items[0].description || 'N/A'}</dd>
              </p>
            </dl>
            <Link to={`/${contenttype}/page/1`}>Back to all {contenttype}...</Link>
            <div dangerouslySetInnerHTML={{__html: copyrightText}} />
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Show;
