import{
  FETCH_ITEMS_BEGIN,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_FAILURE,
  SET_SEARCH_QUERY
} from'./itemActions';

const initialState = {
  page: 0,
  items: [],
  loading: false,
  notFound: false,
  copyrightText: '',
  total: 0,
  searchTerm: '',
  error: null
}

function itemsReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_ITEMS_BEGIN:
      return{
        ...state,
        loading: true,
        notFound: false
      };
    case FETCH_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        copyrightText: action.payload.copyrightText,
        total: action.payload.total,
        notFound: action.payload.notFound,
        page: parseInt(action.payload.page, 10),
        query: action.payload.query
      };
    case FETCH_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        notFound: action.payload.notFound,
        items:[]
      };
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchTerm: action.payload.query
      }
    default:
      return state;
  }
}

export default itemsReducer;