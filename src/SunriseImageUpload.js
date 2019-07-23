import React from 'react';
import path from './assets/images/Path 2.svg';
import shape from './assets/images/Shape 2.svg';

class SunriseImageUpload extends React.Component
{
	render()
	{
		return (
			<div className = 'sunrise-image-wrapper'>
				<div><img alt="path" src={path}/></div>
				<div><img alt="shape" src={shape}/></div>
			</div>
		);
	}
}
export default SunriseImageUpload;