import React from 'react';
import ReactDOM from 'react-dom';
import SunriseSunset from './SunriseSunset';

class Root extends React.Component
{
	render()
	{
		return <SunriseSunset />
	}
}
ReactDOM.render(<Root />, document.getElementById('root'));


