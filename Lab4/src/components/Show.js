import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { makeStyles,Grid,  Card, CardContent, CardMedia, Typography, CardHeader  } from '@material-ui/core';
import NotFound from './NotFound';
import CardItem from './CardItem';
import '../App.css';

const useStyles = makeStyles({
  card: {
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

const Show = (props) => {
  let { id, contenttype } = useParams();
  const md5 = require('blueimp-md5');
  const publickey = '98945702c0d81859c509bc344b5b5d75';
  const privatekey = 'd9eedd3c84701833ed027b4e9f287fcc199186d5';
  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const domain = 'https://gateway.marvel.com:443';
  const baseUrl = `${domain}/v1/public/${contenttype}/${id}`;
  const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

  const [ notFound, setNotFound] = useState(false);
  const [ showData, setShowData ] = useState(undefined);
  const [ loading, setLoading ] = useState(true);
  const [copyrightText, setCopyrightText] = useState('');

  const classes = useStyles();
  useEffect(
    () => {
      console.log ("useEffect fired")
      async function fetchData() {
        try {
          setNotFound(false);
          if(Number.isNaN(parseInt(id), 10)) {
            setNotFound(true);
            return;
          }

          const response = await axios.get(url);
          console.log(response);
          setCopyrightText(response.data.attributionHTML);
          setShowData(response.data.data.results[0]);
          setLoading(false);
        } catch (e) {
          console.log('Error Occurred: ' + e);
          setNotFound(true);
        } finally {
          setLoading(false);
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

    return (
      // <div className='cards__container'>
      //     <div className='cards__wrapper'>
      //       <ul className='cards__items'>
      //       <Grid container spacing={1}>
      //         <Grid container item xs={12} key={showData.id}>
      //           <CardItem
      //             type={contenttype}
      //             item={showData}
      //         />
      //         </Grid>
      //       </Grid>
      //       </ul>
      //     </div>
      //   </div>


      <Card className={classes.card} variant='outlined'>
      	<CardHeader className={classes.titleHead} title={showData.name || showData.title} />
      	<CardMedia
      		className={classes.media}
      		component='img'
      		image={showData.thumbnail && showData.thumbnail.path ? `${showData.thumbnail.path}/landscape_medium.${showData.thumbnail.extension}` : ''}
      		title='show image'
      	/>

      	<CardContent>
      		<Typography variant='body2' color='textSecondary' component='span'>
      			<dl>
      				<p>
      					<dt className='title'>Rating:</dt>
      					{showData && showData.rating ? (
      						<dd>
      							<a rel='noopener noreferrer' target='_blank' href={showData.rating}>
      								{showData.name || showData.title} Rating
      							</a>
      						</dd>
      					) : (
      						<dd>N/A</dd>
      					)}
      				</p>

      				<p>
      					<dt className='title'>Characters:</dt>
      					{showData && showData.characters && showData.characters.available >= 1 ? (
      						<span>
      							{showData.characters.items.map((item) => {
      								if (showData.characters.available > 1)
                        return <dd key={item.name}>{item.name},</dd>;
      								return <dd key={item.name}>{item.name}</dd>;
      							})}
      						</span>
      					) : (
      						<dd>N/A</dd>
      					)}
      				</p>
      				<p>
      					<dt className='title'>Description:</dt>
      					<dd>{showData.description || 'N/A'}</dd>
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
