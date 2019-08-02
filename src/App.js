import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import About from './About';
import SunriseSunset from './SunriseSunset';

class App extends React.Component
{ 
  render()
  {
    return <Router>
      <Route exact path="/" render={() => <SunriseSunset />} />
      <Route exact path="/about" render={() => <About />} />
    </Router>
  }
}

export default App;
