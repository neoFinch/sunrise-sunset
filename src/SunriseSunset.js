import React from 'react';
import axios from 'axios';

class SunriseSunset extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = { weatherData: [], time: null };
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
		prevDate.setDate(getPrevDate.split('-')[2] - 1	);
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

		myweather[1] = { prevDateStamp: prevDateStamp, startStamp: startStamp, endStamp: endStamp, tstartStamp: tstartStamp, tendStamp: tendStamp, tomorrowMidNightStamp: tomorrowMidNightStamp, todayMidNightStamp: todayMidNightStamp };
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
		let paharTime = '\xa0\xa0' + convertToPahar + '\xa0\xa0\xa0' + ' | ' + '\xa0\xa0\xa0\xa0\xa0\xa0' + convertToGarhi + '\xa0\xa0\xa0\xa0\xa0' + ' | ' + '\xa0' + convertToPal + '\xa0' + ' | ' + '\xa0\xa0\xa0' + convertToLamha;
		return paharTime;
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
			let paharTime = '\xa0\xa0' + convertToPahar + '\xa0\xa0\xa0' + ' | ' + '\xa0\xa0\xa0\xa0\xa0\xa0' + convertToGarhi + '\xa0\xa0\xa0\xa0\xa0' + ' | ' + '\xa0' + convertToPal + '\xa0' + ' | ' + '\xa0\xa0\xa0' + convertToLamha;
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
			let paharTime = '\xa0\xa0' + convertToPahar + '\xa0\xa0\xa0' + ' | ' + '\xa0\xa0\xa0\xa0\xa0\xa0' + convertToGarhi + '\xa0\xa0\xa0\xa0\xa0' + ' | ' + '\xa0' + convertToPal + '\xa0' + ' | ' + '\xa0\xa0\xa0' + convertToLamha;
			return paharTime;
		}
	}
	sunriseSunsetInPaharDay()
	{
		let weatherData = this.state.weatherData;
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
				let prevSunset = response.data.forecast.forecastday[0].astro.sunset;
				let hr = parseInt(prevSunset.split(':')[0]) + 12;
				let prevDate = new Date();
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

		if ( weatherData[0] && weatherData[1] )
		{
			if ( weatherData[2] && (weatherData[0].currentTimeStamp > weatherData[1].startStamp && weatherData[0].currentTimeStamp < weatherData[1].endStamp))
			{
				return (
					<div align = 'center'>
						<center> <font size = '5' color = 'white' face = "verdana">Place : <b>{ weatherData[0].place }</b> </font></center><br/><br/>
						<div className = 'Div1Align'>
							<p></p><br/>
							<p align = 'right'> <font size = '2' color = 'white' face = 'Arial'> <i>Day Time : </i></font></p>
							<p align = 'right'> <font size = '2' color = 'white' fontStyle = 'Italic' face = 'Arial'> <i>Time to Sunset : </i></font></p>
							<p align = 'right'> <font size = '2' color = 'white' fontStyle = 'Italic' face = 'Arial'> <i>Time to next Sunrise :</i> </font></p>
						</div>
						<div className = 'Div2Align'>
							<p align = 'left'> <font size = '2' face = "verdana"><b>Pahar | Gharhi |  Pal | Lamha</b> </font></p>
							<p align = 'left'>	&nbsp; &nbsp; <font color = 'white'>{ weatherData[2].sunrisePahar } </font></p>
							<p align = 'left'> &nbsp; &nbsp; <font color = 'white'>{ weatherData[2].sunsetPahar } </font></p>
							<p align = 'left'> &nbsp; &nbsp; <font color = 'white'>{ weatherData[2].nextSunrisePahar } </font></p>
						</div>
					</div>
				)
			}
			else if ( weatherData[3]
				&& (((weatherData[0].currentTimeStamp > weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp))
				|| ((weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp))) )
			{
				return (
					<div align = 'center'>
						<center className = 'firstDiv'> <font size = '5' color = 'white' face = "verdana">Place : <b>{ weatherData[0].place }</b> </font></center><br/><br/>
						<div className = 'Div1Align'>
							<p></p><br/>
							<p align = 'right'> <font size = '2' color = 'white' face = 'Arial'> <i>Night Time : </i></font></p>
							<p align = 'right'> <font size = '2' color = 'white' fontStyle = 'Italic' face = 'Arial'> <i>Time to Sunrise : </i></font></p>
							<p align = 'right'> <font size = '2' color = 'white' fontStyle = 'Italic' face = 'Arial'> <i>Time to next Sunset :</i> </font></p>
						</div>
						<div className = 'Div2Align'>
							<p align = 'left'> <font size = '2' color = 'white' face = "verdana"><b>Pahar | Gharhi |  Pal | Lamha</b> </font></p>
							<p align = 'left'>	&nbsp; &nbsp; <font color = 'white'> { weatherData[3].sunsetPahar } </font></p>
							<p align = 'left'> &nbsp; &nbsp; <font color = 'white'> { weatherData[3].sunrisePahar } </font></p>
							<p align = 'left'> &nbsp; &nbsp; <font color = 'white'> { weatherData[3].nextSunsetPahar } </font></p>
						</div>
					</div>
				)
			}
			else
			{
				return <center className = 'center'> <font color = 'white' face = 'verdana'>Oops... Error fetching data!</font></center>;
			}
		}
		else
		{
			return <center className = 'center'> <font color = 'white' face = 'verdana'>Loading Data, Please Wait...</font></center>;
		}
	}
}
export default SunriseSunset;