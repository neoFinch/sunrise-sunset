import React from 'react';
import downarrow from './assets/images/Down Arrow.svg';

class DownArrow extends React.Component
{
	render()
	{
		return (
			<div className = 'downarrow'>
				<img alt = 'downarrow' src = { downarrow }/>
			</div>
		);
	}
}
export default DownArrow;