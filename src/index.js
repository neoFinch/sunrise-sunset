import React from 'react';
import ReactDOM from 'react-dom';
import SunriseSunset from './SunriseSunset';
import App from './App';

class Root extends React.Component
{	
	render()
	{
		return <App />
	}
}
ReactDOM.render(<Root />, document.getElementById('root'));


