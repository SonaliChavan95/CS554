import React, { useEffect, useState, useRef } from 'react';
import axios  from 'axios';
import './../Cards.css';
import { useParams, useHistory } from 'react-router-dom';
import SearchCharacters from './SearchCharacters';
import CardItem from './CardItem';
import NotFound from './NotFound';

import { Pagination } from '@material-ui/lab';
import { Grid } from '@material-ui/core';
import '../App.css';

const ShowCharacters = (props) => {
  let { contenttype } = useParams();
  let history = useHistory();
  const md5 = require('blueimp-md5');
  const publickey = '98945702c0d81859c509bc344b5b5d75';
  const privatekey = 'd9eedd3c84701833ed027b4e9f287fcc199186d5';
  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const domain = 'https://gateway.marvel.com:443';

  const [ loading, setLoading ] = useState(true);
  const [ charactersData, setCharactersData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
  const [ page, setPage] = useState(0);
  const [ notFound, setNotFound] = useState(false);
  const [copyrightText, setCopyrightText] = useState('');
  const [total, setTotal] = useState(0);

  const handleChange = (event, value) => {
    history.push(`/${contenttype}/page/${value}`);
  };

  useEffect(
    () => {
      // alert("request to api");
      console.log('on load useeffect');
      async function fetchData() {
        try {
          setLoading(true);
          setNotFound(false);

          let currentPage = parseInt(props.match.params.pagenum, 10);
          if(Number.isNaN(currentPage)) {
            setNotFound(true);
            return;
          }

          let offset = currentPage === 1 ? 0 : (currentPage-1)*20;
          let apiUrl = `${domain}/v1/public/${contenttype}?ts=${ts}&apikey=${publickey}&hash=${hash}`;
          apiUrl = `${apiUrl}&offset=${offset}`;

          const response = await axios.get(apiUrl);
          console.log(response);
          if(response.data.data.count > 0) {
            setCopyrightText(response.data.attributionHTML);
            setCharactersData(response.data.data.results);
          } else {
            console.log("count 0")
            setNotFound(true);
          }

          setTotal(response.data.data.total);
          setPage(parseInt(props.match.params.pagenum, 10));
        } catch (e) {
          console.log(e);
          setNotFound(true);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.match.params.pagenum, contenttype]
  );

  useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
        // alert("request to Search");
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
          let apiUrl = `${domain}/v1/public/${contenttype}?ts=${ts}&apikey=${publickey}&hash=${hash}`;
          let searchQuery = contenttype === 'characters' ? 'nameStartsWith' : 'titleStartsWith';
          apiUrl = `${apiUrl}&${searchQuery}=${searchTerm}`;
					const response = await axios.get(apiUrl);
          setCopyrightText(response.data.attributionHTML);
          setCharactersData(response.data.data.results);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set');
				fetchData();
			}
		},
		[ searchTerm ]
	);

  const searchValue = async (value) => {
		setSearchTerm(value);
	};

  const buildCards = () => {
    let cards =
      charactersData &&
      charactersData.map((character) => {
        return (
          <Grid container item xs={12} sm={6} md={4} xl={2} key={character.id}>
            <CardItem
            type={contenttype}
            item={character}
          />
          </Grid>
        )
      });

    return(
      <Grid container spacing={1}>
        {cards}
      </Grid>
    )
  };

  const paginationUI = () => {
    if (searchTerm) return;
    return (
      <div>
        <Pagination count={Math.ceil(total/20)} page={page} onChange={handleChange} />
      </div>
    )
  }

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
      <div className='cards'>
        <h1>Check out these EPIC {contenttype}!</h1>
        {/* <TextField inputRef={textRef} /> */}

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <SearchCharacters searchValue={searchValue} />
          </Grid>
          <Grid item xs={6}>
            {paginationUI()}
          </Grid>
        </Grid>


        <div className='cards__container'>
          <div className='cards__wrapper'>
            <ul className='cards__items'>
              { buildCards() }
            </ul>
          </div>
        </div>

        <div dangerouslySetInnerHTML={{__html: copyrightText}} />
      </div>
		);
	}

}

export default ShowCharacters;