import Navbar from './components/Navbar';
import './App.css';
import Home from './components/Home';
import Collection from './components/Collection';
import Show from './components/Show';
import NotFound from './components/NotFound';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/:contenttype(characters|comics|series)/page/:pagenum' component={Collection} />
          <Route exact path='/:contenttype(characters|comics|series)/:id' component={Show} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
