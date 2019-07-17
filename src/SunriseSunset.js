import React from 'react';
import axios from 'axios';
import  './App.css';
import  './hamburger.scss';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class SunriseSunset extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = { weatherData: [], time: null, errorMsg: '' };
		this.startTime = this.startTime.bind(this);
		this.convertToPaharDay = this.convertToPaharDay.bind(this);
		this.convertToPaharNight = this.convertToPaharNight.bind(this);
		this.sunriseSunsetInPaharDay = this.sunriseSunsetInPaharDay.bind(this);
		this.convertTimeStamp = this.convertTimeStamp.bind(this);
	}
	componentDidMount()
	{
		let weatherData = this.state.weatherData;
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition((position) => {
				let latitude = position.coords.latitude;
				let longitude = position.coords.longitude;
				axios.get(`https://api.apixu.com/v1/forecast.json?key=4b4142a4fe3a4a3b81d104736191007&q=${latitude},${longitude}&days=2`)
				.then((response) => {
					console.log(response.data)
					let placename = response.data.location.name;
					const sunriseTime = response.data.forecast.forecastday[0].astro.sunrise;
					const sunsetTime = response.data.forecast.forecastday[0].astro.sunset;
					const todayDate = response.data.forecast.forecastday[0].date;
					const tomorrowDate = response.data.forecast.forecastday[1].date;
					const tomorrowSunriseTime = response.data.forecast.forecastday[1].astro.sunrise;
					const tomorrowSunsetTime = response.data.forecast.forecastday[1].astro.sunset;
					weatherData[0] = { latitude: latitude, longitude: longitude, currentTimeStamp: (new Date()).getTime(), tomorrowDate: tomorrowDate, sunrise: sunriseTime, todayDate: todayDate, place: placename, sunset: sunsetTime, tomorrowSunriseTime: tomorrowSunriseTime, tomorrowSunsetTime: tomorrowSunsetTime };
					this.setState({ weatherData: weatherData },() => {
						this.convertTimeStamp();
						this.sunriseSunsetInPaharDay(); });
				})
				.catch((error) => error);
			})
		}
		else
		{
			this.setState({ errorMsg: 'Please Allow Location to Serve you Better! Thank you.' });
		}
		this.startTime();
	}
	convertTimeStamp()
	{
		let myweather = this.state.weatherData;
		const { weatherData } = this.state;
		let time1 = weatherData[0].sunrise;
		let startDate = new Date();
		startDate.setHours(time1.split(":")[0]);
		startDate.setMinutes(time1.split(" ")[0].split(':')[1]);
		startDate.setSeconds(0);
		let startStamp = startDate.getTime();

		let prevDate = new Date();
		let getPrevDate = this.state.weatherData[0].todayDate;
		prevDate.setDate(getPrevDate.split('-')[2]);
		let prevDateStamp = prevDate.getTime();

		let time2 = weatherData[0].sunset;
		let hr = parseInt(time2.split(':')[0]) + 12;
		let endDate = new Date();
		endDate.setHours(hr);
		endDate.setMinutes(time2.split(' ')[0].split(':')[1]);
		endDate.setSeconds(0);
		// endDate.setSeconds(0);
		let endStamp = endDate.getTime();
		let tomorrowtime1 = weatherData[0].tomorrowSunriseTime;
		let tomorrowDate = weatherData[0].tomorrowDate;
		let tstartDate = new Date();
		tstartDate.setHours(tomorrowtime1.split(":")[0]);
		tstartDate.setMinutes(tomorrowtime1.split(" ")[0].split(':')[1]);
		tstartDate.setDate(tomorrowDate.split('-')[2]);
		tstartDate.setMonth(tomorrowDate.split('-')[1] - 1);
		tstartDate.setSeconds(0);
		let tstartStamp = tstartDate.getTime();

		let tomorrowtime2 = weatherData[0].tomorrowSunsetTime;
		let changeFormat = parseInt(tomorrowtime2.split(':')[0]) + 12;
		let tendDate = new Date();
		tendDate.setHours(changeFormat);
		tendDate.setMinutes(tomorrowtime2.split(' ')[0].split(':')[1]);
		tendDate.setDate(tomorrowDate.split('-')[2]);
		tendDate.setMonth(tomorrowDate.split('-')[1] - 1);
		tendDate.setSeconds(0);
		let tendStamp = tendDate.getTime();

		let todayMidNight = new Date();
		todayMidNight.setHours(0,0,0,0);
		let todayMidNightStamp = todayMidNight.getTime();

		let tomorrowMidNight = new Date();
		tomorrowMidNight.setHours(24,0,0,0);
		let tomorrowMidNightStamp = tomorrowMidNight.getTime();

		let elevenFiftyNine = new Date();
		elevenFiftyNine.setHours(11);
		elevenFiftyNine.setMinutes(59);
		elevenFiftyNine.setSeconds(0);
		let elevenFiftyNineStamp = elevenFiftyNine.getTime();

		myweather[1] = { elevenFiftyNineStamp: elevenFiftyNineStamp, prevDateStamp: prevDateStamp, startStamp: startStamp, endStamp: endStamp, tstartStamp: tstartStamp, tendStamp: tendStamp, tomorrowMidNightStamp: tomorrowMidNightStamp, todayMidNightStamp: todayMidNightStamp };
		myweather[0].currentTimeStamp = (new Date()).getTime();
		this.setState({ weatherData: myweather });
	}
	convertToPaharDay(timePahar)
	{
		let timeDiff = (this.state.weatherData[1].endStamp - this.state.weatherData[1].startStamp) / 1000;

		let onePahar = timeDiff / 4 / 60;
		let oneGarhi = onePahar / 8;
		let onePal = oneGarhi / 60;
		let oneLamha = onePal / 60;
		let convertToPahar = Math.floor(( timePahar / 60 ) / onePahar);
		let convertToGarhi = Math.floor((( timePahar / 60 ) % onePahar ) / oneGarhi);
		let convertToPal = Math.floor(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
		let convertToLamha = Math.round((((( timePahar / 60 ) % onePahar ) % oneGarhi ) % onePal) / oneLamha);
		let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
		return (
			<span>
				<span>{`\u00A0\u00A0\u00A0${convertToPahar}\u00A0\u00A0\u00A0\u00A0`} |</span>
				<span>{ `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${convertToGarhi}\u00A0\u00A0\u00A0\u00A0\u00A0`} |</span>
				<span>{ `\u00A0\u00A0\u00A0${convertToPal}\u00A0`} |</span>
				<span>{`\u00A0\u00A0\u00A0${convertToLamha}\u00A0\u00A0\u00A0`} </span>
			</span>
		);
	}
	convertToPaharNight(timePahar)
	{
		const { weatherData } = this.state;
		if ( (weatherData[0].currentTimeStamp > weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp))
		{
			let timeDiff = (this.state.weatherData[1].tstartStamp - this.state.weatherData[1].endStamp) / 1000;
			let onePahar = timeDiff / 4 / 60;
			let oneGarhi = onePahar/ 8;
			let onePal = oneGarhi / 60;
			let oneLamha = onePal / 60;
			let convertToPahar = Math.floor(( timePahar / 60 ) / onePahar);
			let convertToGarhi = Math.floor((( timePahar / 60 ) % onePahar ) / oneGarhi);
			let convertToPal = Math.floor(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
			let convertToLamha = Math.round((((( timePahar / 60 ) % onePahar ) % oneGarhi ) % onePal) / oneLamha);
			let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
			return paharTime;
		}
		else if ( (weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp))
		{
			let timeDiff = (this.state.weatherData[1].startStamp - this.state.weatherData[4].prevStamp) / 1000;
			let onePahar = timeDiff / 4 / 60;
			let oneGarhi = onePahar / 8;
			let onePal = oneGarhi / 60;
			let oneLamha = onePal / 60;
			let convertToPahar = Math.floor(( timePahar / 60 ) / onePahar);
			let convertToGarhi = Math.floor((( timePahar / 60 ) % onePahar ) / oneGarhi);
			let convertToPal = Math.floor(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
			let convertToLamha = Math.round((((( timePahar / 60 ) % onePahar ) % oneGarhi ) % onePal) / oneLamha);
			let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
			return paharTime;
		}
	}
	sunriseSunsetInPaharDay()
	{
		let weatherData = this.state.weatherData;
		if ( weatherData[0].currentTimeStamp === weatherData[1].elevenFiftyNineStamp)
		{
			const latitude = weatherData[0].latitude;
			const longitude = weatherData[0].longitude;
			axios.get(`https://api.apixu.com/v1/forecast.json?key=4b4142a4fe3a4a3b81d104736191007&q=${latitude},${longitude}&days=2`)
			.then((response) => {
				console.log(response.data)
				const placename = response.data.location.name;
				const sunriseTime = response.data.forecast.forecastday[0].astro.sunrise;
				const sunsetTime = response.data.forecast.forecastday[0].astro.sunset;
				const todayDate = response.data.forecast.forecastday[0].date;
				const tomorrowDate = response.data.forecast.forecastday[1].date;
				const tomorrowSunriseTime = response.data.forecast.forecastday[1].astro.sunrise;
				const tomorrowSunsetTime = response.data.forecast.forecastday[1].astro.sunset;
				weatherData[0] = { latitude: latitude, longitude: longitude, currentTimeStamp: (new Date()).getTime(), tomorrowDate: tomorrowDate, sunrise: sunriseTime, todayDate: todayDate, place: placename, sunset: sunsetTime, tomorrowSunriseTime: tomorrowSunriseTime, tomorrowSunsetTime: tomorrowSunsetTime };
				this.setState({ weatherData: weatherData })
			})
			.catch((error) => error);
		}
		if ( weatherData[0].currentTimeStamp > weatherData[1].startStamp && weatherData[0].currentTimeStamp < weatherData[1].endStamp)
		{
			let sunrisePaharDiff = ( weatherData[0].currentTimeStamp - weatherData[1].startStamp ) / 1000;
			let sunsetPaharDiff = ( weatherData[1].endStamp - weatherData[0].currentTimeStamp ) / 1000;
			let nextSunrisePaharDiff = ( weatherData[1].tstartStamp - weatherData[0].currentTimeStamp ) / 1000;
			let sunrisePahar = this.convertToPaharDay(sunrisePaharDiff);
			let sunsetPahar = this.convertToPaharDay(sunsetPaharDiff);
			let nextSunrisePahar = this.convertToPaharDay(nextSunrisePaharDiff);
			if ( weatherData[2] ) {
				weatherData[2] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunrisePahar: nextSunrisePahar };
				this.setState({ weatherData: weatherData });
			} else {
				weatherData[2] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunrisePahar: nextSunrisePahar };
				this.setState({ weatherData: weatherData });
			}
		}
		else if ( weatherData[0].currentTimeStamp > weatherData[1].endStamp && weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp)
		{
			let weatherData = this.state.weatherData;
			let sunsetPaharDiff = ( weatherData[0].currentTimeStamp - weatherData[1].endStamp ) / 1000;
			let sunrisePaharDiff = ( weatherData[1].tstartStamp - weatherData[0].currentTimeStamp ) / 1000;
			let nextSunsetPaharDiff = ( weatherData[1].tendStamp - weatherData[0].currentTimeStamp ) / 1000;
			let sunsetPahar = this.convertToPaharNight(sunsetPaharDiff);
			let sunrisePahar = this.convertToPaharNight(sunrisePaharDiff);
			let nextSunsetPahar = this.convertToPaharNight(nextSunsetPaharDiff);
			if ( weatherData[3] ) {
				weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
				this.setState({ weatherData: weatherData });
			} else {
				weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
				this.setState({ weatherData: weatherData });
			}
		}
		else if ( weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp && weatherData[0].currentTimeStamp < weatherData[1].startStamp)
		{
			let weatherData = this.state.weatherData;
			let unixdt = weatherData[1].prevDateStamp / 1000;
			let latitude = weatherData[0].latitude;
			let longitude = weatherData[0].longitude;
			axios.get(`https://api.apixu.com/v1/history.json?key=4b4142a4fe3a4a3b81d104736191007&q=${latitude},${longitude}&unixdt=${unixdt}`)
			.then((response) => {
				console.log(response.data)
				let prevSunset = response.data.forecast.forecastday[0].astro.sunset;
				let preDate = response.data.forecast.forecastday[0].date;
				let hr = parseInt(prevSunset.split(':')[0]) + 12;
				let prevDate = new Date();
				prevDate.setDate(preDate.split('-')[2]);
				prevDate.setHours(hr);
				prevDate.setMinutes(prevSunset.split(' ')[0].split(':')[1]);
				prevDate.setSeconds(0);
				let prevStamp = prevDate.getTime();
				weatherData[4] = { prevStamp: prevStamp };
				this.setState({ weatherData: weatherData },() => {
					let sunsetPaharDiff = ( weatherData[0].currentTimeStamp - weatherData[4].prevStamp ) / 1000;
					let sunrisePaharDiff = ( weatherData[1].startStamp - weatherData[0].currentTimeStamp ) / 1000;
					let nextSunsetPaharDiff = ( weatherData[1].endStamp - weatherData[0].currentTimeStamp ) / 1000;
					let sunsetPahar = this.convertToPaharNight(sunsetPaharDiff);
					let sunrisePahar = this.convertToPaharNight(sunrisePaharDiff);
					let nextSunsetPahar = this.convertToPaharNight(nextSunsetPaharDiff);
					if ( weatherData[3] ) {
						weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
						this.setState({ weatherData: weatherData });
					} else {
						weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
						this.setState({ weatherData: weatherData });
					}
				});
			})
			.catch((error) => error);
		}
	}
	startTime() 
	{
	  let currentTime = new Date();
	  let h = (currentTime.getHours() < 10 ? '0' : '') + currentTime.getHours();
	  let m = (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes();
	  let s = (currentTime.getSeconds() < 10 ? '0' : '') + currentTime.getSeconds();
	  let ms = (currentTime.getMilliseconds() < 10 ? '0' : '') + currentTime.getMilliseconds();
		let realTime = h + ":" + m + ":" + s + ':' + ms;
	  setTimeout(this.startTime, 300);
	  setTimeout(this.setState({ time: realTime }), 400);
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.time !== this.state.time) {
			try {
				this.state.weatherData[0].currentTimeStamp = (new Date()).getTime();
				this.sunriseSunsetInPaharDay();
			} catch (e) {}
		}
	}

	render()
	{
		const { weatherData } = this.state;
		const { handleHamburgerClick, isHamburgerContentVisible } = this.props;
		if ( weatherData[0] && weatherData[1] )
		{
			if ( weatherData[2] && (weatherData[0].currentTimeStamp >= weatherData[1].startStamp && weatherData[0].currentTimeStamp < weatherData[1].endStamp))
			{
				return (
					<div className = 'sunset-sunrise-day-wrapper' align = 'center'>
						<div className = 'div-wrapper'>
							<center className = 'place-alignment'> <font size = '5' face = "verdana">Place : { weatherData[0].place } </font></center><br/><br/>
							<center className = 'time-wrapper'>
								<div className = 'Div-1'>
									<p></p><br/>
									<p align = 'right'> <font size = '2' face = 'Arial'> <i>Day Time : </i></font></p>
									<p align = 'right'> <font size = '2' fontStyle = 'Italic' face = 'Arial'> <i>Time to Sunset : </i></font></p>
								</div>
								<div className = 'Div-2'>
									<p className = 'para-day'> <font size = '2' face = "verdana">Prahara | Gharhi |  Pal | Lamha</font></p>
									<p align = 'left'>	&nbsp; &nbsp; { weatherData[2].sunrisePahar } </p>
									<p align = 'left'> &nbsp; &nbsp; { weatherData[2].sunsetPahar } </p>
								</div>
							</center><br/><br/><br/>
							<div className = 'info-div-day'> 
								<b>Pahar:</b> A day and night consists of 4 pahars each. Day begins at sunrise and ends at sunset and Night is exactly opposite. Since length of day and night changes from season to season, pahars of the day and night are not of equal length of time.<br/><br/>

								<b>Gharhi:</b> Each pahar is divided into 8 equal parts called Gharhi.<br/><br/>

								<b>Pal:</b> 60 pals make one gharhi.<br/><br/>

								<b>Lamha:</b> Lamha and pal are considered interchangeable however in this app we have set 60 lamhas for each pal. Explanation on why this was done can be found in the about page.<br/><br/>

								The format of time in this app is displayed as:<br/><br/>

								Pahar | Gharhi | Pal | Lamha<br/><br/>
								1 | 5 | 27 | 52<br/><br/>

								This app was conceptualized by Kashif-ul-Huda (@kaaashif) and designed by QED42 Team (@QED42).
							</div>
						</div>
						<div className = {`menu btn14Day ${isHamburgerContentVisible && 'open'}`} data-menu = "14" onClick = {handleHamburgerClick}>
			        <div className = "icon"></div>
			      </div>
			      <div className = {`hamburger-content ${(isHamburgerContentVisible && 'visible') || 'hidden'}`}>
			      	<Link to="/about"><p className = 'hamburger-visible-content'><font face = 'verdana' color = 'black'>About us</font></p></Link>
						</div>
					</div>
				)
			}
			else if ( weatherData[3]
				&& (((weatherData[0].currentTimeStamp >= weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp))
				|| ((weatherData[0].currentTimeStamp >= weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp))) )
			{
				return (
					<div className = 'sunset-sunrise-night-wrapper' align = 'center'>
						<div className = 'div-wrapper'>
							<center className = 'center-wrapper-night'> <font size = '5' face = "verdana">Place : { weatherData[0].place } </font></center><br/><br/>
							<center className = 'time-wrapper'>
								<div className = 'Div-1'>
									<p></p><br/>
									<p className = 'center-wrapper-night' align = 'right'> <font size = '2' face = 'Arial'> <i>Night Time : </i></font></p>
									<p className = 'center-wrapper-night' align = 'right'> <font size = '2' fontStyle = 'Italic' face = 'Arial'> <i>Time to Sunrise : </i></font></p>
								</div>
								<div className = 'Div-2'>
									<p className = 'para-night'> <font size = '2' face = "verdana">Prahara | Gharhi |  Pal | Lamha</font></p>
									<p className = 'center-wrapper-night' align = 'left'>	&nbsp; &nbsp;<font color = 'white'> { weatherData[3].sunsetPahar } </font></p>
									<p className = 'center-wrapper-night' align = 'left'> &nbsp; &nbsp; <font color = 'white'> { weatherData[3].sunrisePahar } </font></p>
								</div>
							</center><br/><br/><br/>
							<div className = 'info-div-night'> 
								<b>Pahar:</b> A day and night consists of 4 pahars each. Day begins at sunrise and ends at sunset and Night is exactly opposite. Since length of day and night changes from season to season, pahars of the day and night are not of equal length of time.<br/><br/>

								<b>Gharhi:</b> Each pahar is divided into 8 equal parts called Gharhi.<br/><br/>

								<b>Pal:</b> 60 pals make one gharhi.<br/><br/>

								<b>Lamha:</b> Lamha and pal are considered interchangeable however in this app we have set 60 lamhas for each pal. Explanation on why this was done can be found in the about page.<br/><br/>

								The format of time in this app is displayed as:<br/><br/>

								Pahar | Gharhi | Pal | Lamha<br/><br/>
								1 | 5 | 27 | 52<br/><br/>

								This app was conceptualized by Kashif-ul-Huda (@kaaashif) and designed by QED42 Team (@QED42).
							</div>
						</div>
						<div className = {`menu btn14Night ${isHamburgerContentVisible && 'open'}`} data-menu = "14" onClick = {handleHamburgerClick}>
			        <div className = "icon"></div>
			      </div>
			      <div className = {`hamburger-content ${(isHamburgerContentVisible && 'visible') || 'hidden'}`}>
			      	<Link to="/about"><p className = 'hamburger-visible-content'><font face = 'verdana' color = 'black'>About us</font></p></Link>
						</div>
					</div>
				)
			}
			else
			{
				return <center className = 'center'> <font face = 'verdana'>Loading Data, Please Wait...!</font></center>;
			}
		}
		else
		{
			return <center className = 'center'> <font face = 'verdana'>Loading Data, Please Wait...!</font></center>;
		}
	}
}
export default SunriseSunset;