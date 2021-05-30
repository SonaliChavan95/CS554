import React from 'react';
import TextField from '@material-ui/core/TextField';

const SearchCharacters = (props) => {
	const handleChange = (e) => {
		props.searchValue(e.target.value);
	};
	return (
    <form className='center' noValidate autoComplete="off" method='POST' name="searchForm" onSubmit={(e) => {e.preventDefault();}}>
      <TextField id="outlined-basic" name='searchTerm' label="Search By Name" variant="outlined" type='search' onChange={handleChange} />
    </form>
	);
};

export default SearchCharacters;
