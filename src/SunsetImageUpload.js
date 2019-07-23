import React from 'react';
import path from './assets/images/Path.svg';
import shape from './assets/images/Shape.svg';

class SunsetImageUpload extends React.Component
{
	render()
	{
		return (
			<div className = 'sunset-image-wrapper'>
				<div><img alt="path" src={path}/></div>
				<div><img alt="shape" src={shape}/></div>
			</div>
		);
	}
}
export default SunsetImageUpload;