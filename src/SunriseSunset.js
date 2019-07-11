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
		console.log('component running')
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
			console.log('Geolocation not supported');
		}
		this.startTime();
	}
	convertTimeStamp()
	{
		console.log('timestamp running')
		let myweather = this.state.weatherData;
		const { weatherData } = this.state;
		let time1 = weatherData[0].sunrise;
		let startDate = new Date();
		startDate.setHours(time1.split(":")[0]);
		startDate.setMinutes(time1.split(" ")[0].split(':')[1]);
		let startStamp = startDate.getTime();

		let prevDate = new Date();
		let getPrevDate = this.state.weatherData[0].todayDate;
		prevDate.setDate(getPrevDate.split('-')[2] - 1);
		let prevDateStamp = prevDate.getTime() / 1000;

		console.log(prevDate, prevDateStamp)

		let time2 = weatherData[0].sunset;
		let hr = parseInt(time2.split(':')[0]) + 12;
		console.log(hr)
		let endDate = new Date();
		endDate.setHours(hr);
		endDate.setMinutes(time2.split(' ')[0].split(':')[1]);
		let endStamp = endDate.getTime();
		console.log(startStamp, endDate);

		let tomorrowtime1 = weatherData[0].tomorrowSunriseTime;
		let tomorrowDate = weatherData[0].tomorrowDate;
		let tstartDate = new Date();
		tstartDate.setHours(tomorrowtime1.split(":")[0]);
		tstartDate.setMinutes(tomorrowtime1.split(" ")[0].split(':')[1]);
		tstartDate.setDate(tomorrowDate.split('-')[2]);
		tstartDate.setMonth(tomorrowDate.split('-')[1] - 1);
		let tstartStamp = tstartDate.getTime();

		let tomorrowtime2 = weatherData[0].tomorrowSunsetTime;
		let changeFormat = parseInt(tomorrowtime2.split(':')[0]) + 12;
		console.log(hr)
		let tendDate = new Date();
		tendDate.setHours(changeFormat);
		tendDate.setMinutes(tomorrowtime2.split(' ')[0].split(':')[1]);
		tendDate.setDate(tomorrowDate.split('-')[2]);
		tendDate.setMonth(tomorrowDate.split('-')[1] - 1);
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
		let oneGarhi = timeDiff / 4 / 60 / 8;
		let onePal = timeDiff / 4 / 60 / 8 / 60;
		// console.log('------------------------------------------------------------------------------------------------------------------------');
		// console.log(onePahar, oneGarhi, onePal);
		let convertToPahar = parseInt(( timePahar / 60 ) / onePahar);
		let convertToGarhi = parseInt((( timePahar / 60 ) % onePahar ) / oneGarhi);
		let convertToPal = parseInt(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
		let paharTime = convertToPahar + ' Pahar ' + convertToGarhi + ' Garhi ' + convertToPal + ' Pal ';
		return paharTime;
	}
	convertToPaharNight(timePahar)
	{
		const { weatherData } = this.state;
		if ( weatherData[0].currentTimeStamp > weatherData[1].endStamp && weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp)
		{
			let timeDiff = (this.state.weatherData[1].tstartStamp - this.state.weatherData[1].endStamp) / 1000;
			let onePahar = timeDiff / 4 / 60;
			let oneGarhi = timeDiff / 4 / 60 / 8;
			let onePal = timeDiff / 4 / 60 / 8 / 60;
			let convertToPahar = parseInt(( timePahar / 60 ) / onePahar);
			let convertToGarhi = parseInt((( timePahar / 60 ) % onePahar ) / oneGarhi);
			let convertToPal = parseInt(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
			let paharTime = convertToPahar + ' Pahar ' + convertToGarhi + ' Garhi ' + convertToPal + ' Pal ';
			return paharTime;
		}
		else if ( weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp && weatherData[0].currentTimeStamp < weatherData[1].startStamp)
		{
			let timeDiff = (this.state.weatherData[1].startStamp - this.state.weatherData[4].prevStamp) / 1000;
			let onePahar = timeDiff / 4 / 60;
			let oneGarhi = timeDiff / 4 / 60 / 8;
			let onePal = timeDiff / 4 / 60 / 8 / 60;
			let convertToPahar = parseInt(( timePahar / 60 ) / onePahar);
			let convertToGarhi = parseInt((( timePahar / 60 ) % onePahar ) / oneGarhi);
			let convertToPal = parseInt(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
			let paharTime = convertToPahar + ' Pahar ' + convertToGarhi + ' Garhi ' + convertToPal + ' Pal ';
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
				const prevData = weatherData[2];
				console.log("executed", prevData.sunrisePahar, sunrisePahar);
				if (prevData.sunrisePahar !== sunrisePahar) {
					console.log("executed 2")
					weatherData[2] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunrisePahar: nextSunrisePahar };
					this.setState({ weatherData: weatherData });
				} 
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
				const prevData = weatherData[3];
				if (prevData.sunrisePahar !== sunrisePahar) {
					weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
					this.setState({ weatherData: weatherData });
				} 
			} else {
				weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
				this.setState({ weatherData: weatherData });
			}
		}
		else if ( weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp && weatherData[0].currentTimeStamp < weatherData[1].startStamp)
		{
			let weatherData = this.state.weatherData;
			let unixdt = weatherData[1].prevDateStamp;
			let latitude = weatherData[0].latitude;
			let longitude = weatherData[0].longitude;
			axios.get(`https://api.apixu.com/v1/history.json?key=4b4142a4fe3a4a3b81d104736191007&q=${latitude},${longitude}&unixdt=${unixdt}`)
			.then((response) => {
				console.log(response.data)
				let prevSunset = response.data.forecast.forecastday[0].astro.sunset;

				let hr = parseInt(prevSunset.split(':')[0]) + 12;
				console.log(hr)
				let prevDate = new Date();
				prevDate.setHours(hr);
				prevDate.setMinutes(prevSunset.split(' ')[0].split(':')[1]);
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
						const prevData = weatherData[3];
						if (prevData.sunrisePahar !== sunrisePahar) {
							weatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
							this.setState({ weatherData: weatherData });
						} 
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
		let realTime = h + ":" + m + ":" + s;
	  setTimeout(this.startTime, 500);
	  setTimeout(this.setState({ time: realTime }), 500);
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.time !== this.state.time) {
			try {
				this.convertTimeStamp();
				this.sunriseSunsetInPaharDay();
			} catch (e) {}
		}
	}
	render()
	{
		const { weatherData,time } = this.state;
		if ( weatherData[0] && weatherData[1] && weatherData[2] )
		{
			if ( weatherData[0].currentTimeStamp > weatherData[1].startStamp && weatherData[0].currentTimeStamp < weatherData[1].endStamp)
			{
				return (
					<div>
						<span> Today's Date : { weatherData[0].todayDate } </span> &nbsp; &nbsp; <span> Current Time: { weatherData[2].sunrisePahar } ({ time }) </span>
						<p> Place : { weatherData[0].place } </p>
						<p> Time since Sunrise happened :  { weatherData[2].sunrisePahar } </p>
						<p> Sunset will happen in { weatherData[2].sunsetPahar }  </p>
						<p> Time to next Sunrise : { weatherData[2].nextSunrisePahar } </p>
					</div>
				)
			}
			else if ( weatherData[3]
				&& (((weatherData[0].currentTimeStamp > weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp))
				|| ((weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp))) )
			{
				console.log('else running')
				return (
					<div>
						<span> Today's Date : { weatherData[0].todayDate } </span> &nbsp; &nbsp; <span> Current Time: { weatherData[3].sunsetPahar } ({ time }) </span>
						<p> Place : { weatherData[0].place } </p>
						<p> Time since Sunset happened :  { weatherData[3].sunsetPahar } </p>
						<p> Sunrise will happen in { weatherData[3].sunrisePahar }  </p>
						<p> Time to next Sunset : { weatherData[3].nextSunsetPahar } </p>
					</div>
				)
			}
			else
			{
				return <p> Oops... Error fetching data! </p>
			}
		}
		else
		{
			return <p> Wait Loading Data...</p>;
		}
	}
}
export default SunriseSunset;