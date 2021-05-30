import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import NewForm from './NewForm';
import NotFound from './NotFound';
import '../css/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='App'>
        <Switch>
          <Route exact path='/'
            render={() => (
              <Home content="home" />
            )}
            key = "home"
          />
          <Route exact
            path='/my-bin'
            render={() => (
              <Home content="my-bin" />
            )}
            key="bin"
          />
          <Route exact
            path='/my-posts'
            render={() => (
              <Home content="my-posts" />
            )}
            key = "posts"
          />
          <Route exact path='/new-post' component={ NewForm } />
          <Route component={ NotFound } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
