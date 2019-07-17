import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import About from './About';

import SunriseSunset from './SunriseSunset';

class App extends React.Component
{ 
  constructor(props) {
    super(props);
    this.state = {
      isHamburgerContentVisible: false,
    }
    this.handleHamburgerClick = this.handleHamburgerClick.bind(this);
  }

  handleHamburgerClick() {
    this.setState({
      isHamburgerContentVisible: !this.state.isHamburgerContentVisible,
    })
  }
  
  render()
  {
    const { isHamburgerContentVisible } = this.state;
    return <Router>
      <Route exact path="/" render={() => <SunriseSunset isHamburgerContentVisible={isHamburgerContentVisible} handleHamburgerClick={this.handleHamburgerClick} />} />
        <br />
        <br />
        <br />
      <Route exact path="/about" component={About} />
    </Router>
  }
}

export default App;
// <SunriseSunset isHamburgerContentVisible={isHamburgerContentVisible} handleHamburgerClick={this.handleHamburgerClick} />}