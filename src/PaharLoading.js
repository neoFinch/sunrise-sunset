import React from 'react';
import loading from './assets/images/pahar-loading.svg';

class PaharLoading extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	render()
	{
		return (
			<div className="loading-wrapper">
				<img alt="loading" src={loading}/>
			</div>
		);
	}
}
export default PaharLoading;