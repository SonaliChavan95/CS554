import React, { useEffect } from 'react';
import{ fetchItems, setSearchTerm } from "../reducers/itemActions";
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Pagination } from '@material-ui/lab';
import { Grid } from '@material-ui/core';
import '../App.css';
import './../Cards.css';
import SearchCharacters from './SearchCharacters';
import CardItem from './CardItem';
import NotFound from './NotFound';


const ShowItems = () => {
  let { contenttype, pagenum } = useParams();
  let history = useHistory();
  const dispatch = useDispatch();
  const { notFound, loading, items, copyrightText, page, searchTerm, total } = useSelector(state => state.items);

  const handleChange = (event, value) => {
    history.push(`/${contenttype}/page/${value}`);
  };

  useEffect(
    () => {
      console.log('on load useeffect');

      async function fetchData() {
        try {
          dispatch(await fetchItems(contenttype, pagenum, searchTerm));
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagenum, contenttype, searchTerm]
  );

  const searchValue = async (value) => {
    dispatch(setSearchTerm(value));
  };

  const buildCards = () => {
    let cards =
      items.length > 0 &&
      items.map((item) => {
        return (
          <Grid container item xs={12} sm={6} md={4} xl={2} key={item.id}>
            <CardItem
            type={contenttype}
            item={item}
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
    if(searchTerm) return;
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

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <SearchCharacters searchValue={searchValue} query = {searchTerm} />
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

export default ShowItems;