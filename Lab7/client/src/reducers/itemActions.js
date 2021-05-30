import axios  from 'axios';
export const FETCH_ITEMS_BEGIN='FETCH_ITEMS_BEGIN';
export const FETCH_ITEMS_SUCCESS='FETCH_ITEMS_SUCCESS';
export const FETCH_ITEMS_FAILURE='FETCH_ITEMS_FAILURE';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';

export const fetchItemsBegin = () => {
  return {
    type: FETCH_ITEMS_BEGIN
  }
};

export const fetchItemsSuccess = (items, copyrightText, total, notFound, page, query) => {
  return {
    type: FETCH_ITEMS_SUCCESS,
    payload: { items, copyrightText, total, notFound, query, page }
  }
};

export const fetchItemsFailure = error => {
  return {
    type: FETCH_ITEMS_FAILURE, payload: { error, notFound: true }
  }
};

export const setSearchTerm = query => {
  return {
    type: SET_SEARCH_QUERY, payload: { query }
  }
};

export const fetchItems = (contenttype, currentPage, query) => {
  return async (dispatch) => {
    try {
      if(!query)
        dispatch( fetchItemsBegin() );
      const domain = 'http://localhost:4000';
      let apiUrl = `${domain}/${contenttype}/page/${currentPage}`;
      if(query)
        apiUrl = `${apiUrl}?query=${query}`;

      let response = await axios.get(apiUrl);
      dispatch(
        fetchItemsSuccess(
          response.data.data.data.results,
          response.data.data.attributionHTML,
          response.data.data.data.total,
          false,
          currentPage,
          query,
        )
      );
      return response.data;
    } catch (error) {
      dispatch( fetchItemsFailure(error))
    }
  };
}

export const fetchItem = (id, contenttype) => {
  return async (dispatch) => {
    try {
      dispatch( fetchItemsBegin() );
      const domain = 'http://localhost:4000';
      let apiUrl = `${domain}/${contenttype}/${id}`;
      let response = await axios.get(apiUrl);

      dispatch(
        fetchItemsSuccess(
          response.data.data.data.results,
          response.data.data.attributionHTML,
          response.data.data.data.total,
          false,
          null,
          null
        )
      );
      return response.data;
    } catch (error) {
      console.log(error);
      dispatch(fetchItemsFailure(error, true))
    }
  };
}
