import React from 'react';
import quote from './assets/images/quote-08.png';

class QuoteImage extends React.Component
{
	render()
	{
		return (
			<div className = 'about-image-style'>
				<img alt = 'about' src = { quote }/>
			</div>
		);
	}
}
export default QuoteImage;