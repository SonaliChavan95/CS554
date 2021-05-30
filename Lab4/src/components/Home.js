import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <div className='App-body'>
      <h1 className='App-title'>Welcome to the React.js Marvel API Example</h1>
      <Link to='/characters/page/1'>
        Characters
      </Link>
      <br />
      <Link to='/comics/page/1'>
        Comics
      </Link>
      <br />
      <Link to='/series/page/1'>
        Series
      </Link>
    </div>
  );
}

export default Home;