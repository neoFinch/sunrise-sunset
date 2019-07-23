import React from 'react';
import quote from './assets/images/quote-08.png';

class InvertedQuoteImage extends React.Component
{
	render()
	{
		return (
			<div className = 'about-invertedimage-style'>
				<img alt = 'about-inverted' src = { quote }/>
			</div>
		);
	}
}
export default InvertedQuoteImage;