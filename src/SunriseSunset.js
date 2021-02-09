import React from 'react';
import axios from 'axios';	
import  './hamburger.scss';
import PaharLoading from './PaharLoading';
import './UIDesigning.css';
import './App.css';
import RenderSunriseLocationData from './RenderData/renderSunriseLocationData';
import { renderSunriseData } from './RenderData/renderSunriseData';
import { RenderSunsetLocationData } from './RenderData/renderSunsetLocationData';
import { RenderSunsetData } from './RenderData/renderSunsetData';
import Constants from './constants';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SunriseSunset extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = { 
      weatherData: [], 
      time: null, 
      errorMsg: '',
      // latitude: '40.7128',
      // longitude: '-74.0060',
      // placeName: 'New York',
      latitude: '26.8467',
      longitude: '80.9462',
      placeName: 'Lucknow',
      locationPermission: false,
      calledOnce: false
    };
		this.startTime = this.startTime.bind(this);
		this.convertToPaharDay = this.convertToPaharDay.bind(this);
		this.convertToPaharNight = this.convertToPaharNight.bind(this);
		this.sunriseSunsetInPaharDay = this.sunriseSunsetInPaharDay.bind(this);
		this.convertTimeStamp = this.convertTimeStamp.bind(this);
		this.scrollInfoDiv = this.scrollInfoDiv.bind(this);
		this.returningMainDiv = this.returningMainDiv.bind(this);
  }
  
  getSunriseDataByLocation = () => {
    if (navigator.permissions) {
      navigator.permissions.query({name:'geolocation'})
      .then(result => {

        let tempState = {...this.state};
        
        if (result.state === 'granted') {
          tempState.locationPermission = true;
        }
        if (result.state === 'denied' || result.state === 'prompt') {
          tempState.locationPermission = false;
          toast("Enable Location", {
            position: toast.POSITION.TOP_CENTER
          });
        }
        this.setState(tempState);
        // console.log('result : ', result);
      });
    }
    if (navigator.geolocation) {
      // console.log('iffffs');
      let opt = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('position : ', position);
        let tempState = {...this.state};
        tempState.latitude = position.coords.latitude;
        tempState.longitude = position.coords.longitude;
        this.setState(tempState, () => { 
          this.fetchData();
        });
      }, 
      () => { 
        console.log('ERR getting locationsss');
        toast("You might need to enable location.", {
          position: toast.POSITION.TOP_CENTER
        });
      }, opt);
    } else {
      // console.log('ELSEEEEEEE');
      toast("You might need to enable location.", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  fetchDataByPlaceName = (lat, long, placeName) => {
    let tempState = {...this.state};
    tempState.latitude = lat;
    tempState.longitude = long;
    tempState.placeName = placeName
    this.setState(tempState, () => {
      this.fetchData(true);
    });
  }

  getPlaceNameFromCoord = (latt, longg) => {
    let url = Constants.BASE_URL + '/search/' + latt + '/' + longg;
    axios.get(url).then(data => {
      // console.log('getPlaceNameFromCoord : ', data);
      // console.log('asdasd : ', data.data.place.name);
      // return data.data.place.name;
      let tempState = {...this.state};
      tempState.placeName = data.data.place.name;
      this.setState(tempState, () => {
        // console.log(this.state);
      });
    });
  }

  fetchData = (fetchByName = false) => {
    let { latitude, longitude, weatherData, placeName } = this.state;
    let url = `${Constants.OPEN_WEATHER_API}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${Constants.OPEN_WEATHER_API_KEY}&exclude=hourly,minutely`;

    axios.get(url)
    .then((response) => {
      // console.log('response : ', response);
      const sunriseTime = response.data.current.sunrise * 1000;
      const sunsetTime = response.data.current.sunset * 1000;
      const todayDate = response.data.current.dt * 1000;
      const tomorrowDate = response.data.daily[1].dt * 1000;
      const tomorrowSunriseTime = response.data.daily[1].sunrise * 1000;
      const tomorrowSunsetTime = response.data.daily[1].sunset * 1000;
      weatherData[0] = { latitude: latitude, longitude: longitude, currentTimeStamp: (new Date()).getTime(), tomorrowDate: tomorrowDate, sunrise: sunriseTime, todayDate: todayDate, place: this.state.placeName, sunset: sunsetTime, tomorrowSunriseTime: tomorrowSunriseTime, tomorrowSunsetTime: tomorrowSunsetTime };

      // let cities = CityList.default;
      //   cities.map(city => {
      //     if (
      //       parseFloat(city.coord.lat).toString().substring(0,4) === parseFloat(this.state.latitude).toString().substring(0,4) 
      //       && parseFloat(city.coord.lon).toString().substring(0,4) === parseFloat(this.state.longitude).toString().substring(0,4)
      //     ) {
      //       // if (fetchByName) {
      //         weatherData[0].place = city.name;
      //       // }
      //     } });
      if (!fetchByName) {
        this.getPlaceNameFromCoord(latitude, longitude);
      }

      this.setState({ weatherData: weatherData },() => {
        this.convertTimeStamp();
        this.sunriseSunsetInPaharDay(); 
      });
    });
  }

	componentDidMount()
	{
    let { latitude, longitude } = this.state;
    let weatherData = this.state.weatherData;
    // console.log('CALLED');
    ( async () => {
      if (navigator.permissions) {
        let permissionState = await navigator.permissions.query({name:'geolocation'});
        // console.log('permission state : ', permissionState);
        if (permissionState.state === 'denied') {
          // call api with default location lat & long
          this.fetchData();
        } else {
          this.getSunriseDataByLocation();
        }
      } else {
        // alert('FAILs');
        this.fetchData();
      }
    })();
    
		navigator.geolocation.watchPosition(() => {}, (error) => {
			if (error.code === error.PERMISSION_DENIED){
				this.setState({ errorMsg: 'Please Allow Location to Serve you Better! Thank you.' });
			}
		});

		this.startTime();
  }
  
	scrollInfoDiv()
	{
		let container = document.getElementById('scrollUp');
		container.scrollIntoView({block: 'start', behaviour: 'smooth'});
	}
	returningMainDiv()
	{
		let container = document.getElementById('main-div');
		container.scrollIntoView({block: 'start', behaviour: 'smooth'});
	}
	convertTimeStamp()
	{
		// -------------------converting today's sunrise time to timestamp--------------------------

		let myweather = this.state.weatherData;
		const { weatherData } = this.state;
		let time1 = weatherData[0].sunrise;
		let startDate = new Date();
		// startDate.setHours(time1.split(":")[0]);
		// startDate.setMinutes(time1.split(" ")[0].split(':')[1]);
		// startDate.setSeconds(0);
    // let startStamp = startDate.getTime();
    let startStamp = time1;

		// --------------------converting today's sunset time to timestamp----------------------------

		let time2 = weatherData[0].sunset;
		// let hr = parseInt(time2.split(':')[0]) + 12;
		// let endDate = new Date();
		// endDate.setHours(hr);
		// endDate.setMinutes(time2.split(' ')[0].split(':')[1]);
		// endDate.setSeconds(0);
		let endStamp = time2;
		// let endStamp = endDate.getTime();

		// -----------------------------getting timestamp of previous date-----------------------------

		let prevDate = new Date();
		let getPrevDate = this.state.weatherData[0].todayDate;
		// prevDate.setDate(getPrevDate.split('-')[2] - 1);
		// prevDate.setHours(12);
		let prevDateStamp = getPrevDate;

		// --------------------converting tomorrow sunrise time to timestamp-------------------------

		let tomorrowtime1 = weatherData[0].tomorrowSunriseTime;
		let tomorrowDate = weatherData[0].tomorrowDate;
		// let tstartDate = new Date();
		// tstartDate.setHours(tomorrowtime1.split(":")[0]);
		// tstartDate.setMinutes(tomorrowtime1.split(" ")[0].split(':')[1]);
		// tstartDate.setDate(tomorrowDate.split('-')[2]);
		// tstartDate.setMonth(tomorrowDate.split('-')[1] - 1);
		// tstartDate.setSeconds(0);
		let tstartStamp = tomorrowtime1;

		// --------------------converting tomorrow sunset time to timestamp---------------------------

		let tomorrowtime2 = weatherData[0].tomorrowSunsetTime;
		// let changeFormat = parseInt(tomorrowtime2.split(':')[0]) + 12;
		// let tendDate = new Date();
		// tendDate.setHours(changeFormat);
		// tendDate.setMinutes(tomorrowtime2.split(' ')[0].split(':')[1]);
		// tendDate.setDate(tomorrowDate.split('-')[2]);
		// tendDate.setMonth(tomorrowDate.split('-')[1] - 1);
		// tendDate.setSeconds(0);
		let tendStamp = tomorrowtime2;

		// ---------------------getting today's midnight timestamp-----------------------------

		let todayMidNight = new Date();
		todayMidNight.setHours(0,0,0,0);
    let todayMidNightStamp = todayMidNight.getTime();
    // console.log('TODAY MIGNIGHT TIMESTAMP : ', todayMidNightStamp)

		// -----------------------getting tomorrow's midnight timestamp----------------------------

		let tomorrowMidNight = new Date();
		tomorrowMidNight.setHours(24,0,0,0);
		let tomorrowMidNightStamp = tomorrowMidNight.getTime();

		// ----------------11:59 pm timestamp for sending API request ---------------------------

		let elevenFiftyNine = new Date();
		elevenFiftyNine.setHours(23);
		elevenFiftyNine.setMinutes(59);
		elevenFiftyNine.setSeconds(0);
		let elevenFiftyNineStamp = elevenFiftyNine.getTime();

		myweather[1] = { elevenFiftyNineStamp: elevenFiftyNineStamp, prevDateStamp: prevDateStamp, startStamp: startStamp, endStamp: endStamp, tstartStamp: tstartStamp, tendStamp: tendStamp, tomorrowMidNightStamp: tomorrowMidNightStamp, todayMidNightStamp: todayMidNightStamp };
		myweather[0].currentTimeStamp = (new Date()).getTime();
		this.setState({ weatherData: myweather });
	}
	// -----------------calculating pahar, garhi, pal, lamha and getting time for day time---------------------------------

	convertToPaharDay(timePahar)
	{
    // console.log('CONVERSION');
    // console.log('this.state.weatherData[1] : ', this.state.weatherData[1]);

		let timeDiff = (this.state.weatherData[1].endStamp - this.state.weatherData[1].startStamp) / 1000;
    // console.log('TIME DIFF : ', timeDiff);
		let onePahar = timeDiff / 4 / 60;
		let oneGarhi = onePahar / 8;
		let onePal = oneGarhi / 60;
		let oneLamha = onePal / 60;
		let convertToPahar = Math.floor(( timePahar / 60 ) / onePahar);
		let convertToGarhi = Math.floor((( timePahar / 60 ) % onePahar ) / oneGarhi);
		let convertToPal = Math.floor(((( timePahar / 60 ) % onePahar ) % oneGarhi ) / onePal);
		let convertToLamha = Math.round((((( timePahar / 60 ) % onePahar ) % oneGarhi ) % onePal) / oneLamha);
		//let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
		return (
			<span className = 'time-values-wrapper'>
				<span className='pahar-time-wrapper'>{`${convertToPahar}`}</span>
				<span className='garhi-time-wrapper'>{ `${convertToGarhi}`}</span>
				<span className='pal-time-wrapper'>{ `${convertToPal}`}</span>
				<span className='lamha-time-wrapper'>{`${convertToLamha}`}</span>
			</span>
		);
	}

	// ------------------------calculating pahar, garhi, pal, lamha and getting time for night time--------------------------

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
			//let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
			return (
				<span className='time-values-wrapper'>
					<span className='pahar-time-wrapper'>{`${convertToPahar}`}</span>
					<span className='garhi-time-wrapper'>{ `${convertToGarhi}`}</span>
					<span className='pal-time-wrapper'>{ `${convertToPal}`}</span>
					<span className='lamha-time-wrapper'>{`${convertToLamha}`} </span>
				</span>
			);
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
			//let paharTime = `\u00A0\u00A0\u00A0${convertToPahar} \u00A0\u00A0\u00A0 | \u00A0\u00A0\u00A0\u00A0 ${convertToGarhi} \u00A0\u00A0\u00A0 | \u00A0  ${convertToPal} | \u00A0\u00A0\u00A0  ${convertToLamha}`;
			return (
				<span className='time-values-wrapper'>
					<span className='pahar-time-wrapper'>{`${convertToPahar}`}</span>
					<span className='garhi-time-wrapper'>{ `${convertToGarhi}`}</span>
					<span className='pal-time-wrapper'>{ `${convertToPal}`}</span>
					<span className='lamha-time-wrapper'>{`${convertToLamha}`} </span>
				</span>
			);
		}
	}
	sunriseSunsetInPaharDay()
	{
    // console.log('sunriseSunsetInPaharDay called');
		let weatherData = this.state.weatherData;
		
		// -------------------------------sending API request at 11:59 pm-----------------------------------------

		if ( weatherData[0].currentTimeStamp === weatherData[1].elevenFiftyNineStamp)
		{
      // console.log('One');
			const latitude = weatherData[0].latitude;
      const longitude = weatherData[0].longitude;
      
      let url = `${Constants.OPEN_WEATHER_API}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${Constants.OPEN_WEATHER_API_KEY}&exclude=hourly,minutely`;

			axios.get(url)
			.then((response) => {
				// console.log(response.data)
				const placeName = response.data.location.name;
				const sunriseTime = response.data.forecast.forecastday[0].astro.sunrise;
				const sunsetTime = response.data.forecast.forecastday[0].astro.sunset;
				const todayDate = response.data.forecast.forecastday[0].date;
				const tomorrowDate = response.data.forecast.forecastday[1].date;
				const tomorrowSunriseTime = response.data.forecast.forecastday[1].astro.sunrise;
				const tomorrowSunsetTime = response.data.forecast.forecastday[1].astro.sunset;
				weatherData[0] = { latitude: latitude, longitude: longitude, currentTimeStamp: (new Date()).getTime(), tomorrowDate: tomorrowDate, sunrise: sunriseTime, todayDate: todayDate, place: placeName, sunset: sunsetTime, tomorrowSunriseTime: tomorrowSunriseTime, tomorrowSunsetTime: tomorrowSunsetTime };
				this.setState({ weatherData: weatherData })
			})
			.catch((error) => error);
		}

		//-----------sending sunrise-sunset time difference to be converted in pahar time for day time----------------

		if ( (weatherData[0].currentTimeStamp > weatherData[1].startStamp) && (weatherData[0].currentTimeStamp < weatherData[1].endStamp) )
		{
      // console.log('Two');
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

		//-----------sending sunset-midnight time difference to be converted in pahar time for night time----------------

		else if ( (weatherData[0].currentTimeStamp > weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp) )
		{
      // console.log('Three');
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

		//-----------sending midnight-sunrise time difference to be converted in pahar time for night time----------------

		else if ( (weatherData[0].currentTimeStamp > weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp) )
		{
      // console.log('Four');
			let weatherData = this.state.weatherData;
			let unixdt = weatherData[1].prevDateStamp / 1000;
			let latt = weatherData[0].latitude;
      let longg = weatherData[0].longitude;
      // console.log('STATE : ', this.state.weatherData);
			if (!weatherData[4] && this.state.calledOnce === false) {
        let url = `${Constants.OPEN_WEATHER_API}/data/2.5/onecall?lat=${latt}&lon=${longg}&appid=${Constants.OPEN_WEATHER_API_KEY}&exclude=hourly,minutely`;
				axios.get(url)
				.then((response) => { 
          let tempState = {...this.state};
          tempState.calledOnce = true;
          this.setState(tempState)
					// console.log('sunset response : ', response.data)
					let prevSunset = response.data.current.sunset * 1000;
					let preDate = response.data.daily[0].dt * 1000;
					let hr = parseInt(prevSunset.split(':')[0]) + 12;
					let prevDate = new Date();
					prevDate.setDate(preDate.split('-')[2]);
					prevDate.setHours(hr);
					prevDate.setMinutes(prevSunset.split(' ')[0].split(':')[1]);
					prevDate.setSeconds(0);
					// console.log(prevDate)
					let prevStamp = prevDate.getTime();
          weatherData[4] = { prevStamp: prevStamp };
          // console.log('weather data : ', weatherData);
            // this.setState({ weatherData: weatherData },
              // () => {
              // let sunsetPaharDiff = ( weatherData[0].currentTimeStamp - weatherData[4].prevStamp ) / 1000;
              // let sunrisePaharDiff = ( weatherData[1].startStamp - weatherData[0].currentTimeStamp ) / 1000;
              // let nextSunsetPaharDiff = ( weatherData[1].endStamp - weatherData[0].currentTimeStamp ) / 1000;
              // let sunsetPahar = this.convertToPaharNight(sunsetPaharDiff);
              // let sunrisePahar = this.convertToPaharNight(sunrisePaharDiff);
              // let nextSunsetPahar = this.convertToPaharNight(nextSunsetPaharDiff);
              // let tempWeatherData = [...this.state.weatherData];
              // if ( weatherData[3] ) {
              //   tempWeatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
              //   this.setState({ weatherData: tempWeatherData });
              // } else {
              //   tempWeatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
              //   this.setState({ weatherData: tempWeatherData });
              // }
            // }
            // );
				})
				.catch((error) => error);
			}
			else if (weatherData[4])
			{
        // console.log('Five');
				let sunsetPaharDiff = ( weatherData[0].currentTimeStamp - weatherData[4].prevStamp ) / 1000;
				let sunrisePaharDiff = ( weatherData[1].startStamp - weatherData[0].currentTimeStamp ) / 1000;
				let nextSunsetPaharDiff = ( weatherData[1].endStamp - weatherData[0].currentTimeStamp ) / 1000;
				let sunsetPahar = this.convertToPaharNight(sunsetPaharDiff);
				let sunrisePahar = this.convertToPaharNight(sunrisePaharDiff);
        let nextSunsetPahar = this.convertToPaharNight(nextSunsetPaharDiff);
        let tempWeatherData = [...this.state.weatherData];
				if ( weatherData[3] ) {
					tempWeatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
					this.setState({ weatherData: weatherData });
				} else {
          // console.log('BADA ELSE');
					tempWeatherData[3] = { sunrisePahar: sunrisePahar , sunsetPahar: sunsetPahar, nextSunsetPahar: nextSunsetPahar };
					this.setState({ weatherData: weatherData });
				}
			}
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
	  this.timer = setTimeout(this.startTime, 300);
	  this.stateTimer = setTimeout(this.setState({ time: realTime }), 400);
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.time !== this.state.time) {
			try {
				const currentTimeStamp = (new Date()).getTime();
				const currentWeatherData = Object.assign({}, this.state.weatherData);
				currentWeatherData[0].currentTimeStamp = currentTimeStamp;
				this.setState({
					weatherData: currentWeatherData,
				})
				this.sunriseSunsetInPaharDay();
			} catch (e) {}
		}
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
		this.stateTimer && clearTimeout(this.stateTimer);
	}

	render()
	{
		const { weatherData } = this.state;
		if ( weatherData[0] && weatherData[1] )
		{
			//-----------------------------code for day time-------------------------------------

			if ( weatherData[2] && (weatherData[0].currentTimeStamp >= weatherData[1].startStamp && weatherData[0].currentTimeStamp < weatherData[1].endStamp))
			{
				let location = weatherData[0].place;
				let sunTime = weatherData[2].sunrisePahar;
				let nightTime = weatherData[2].sunsetPahar;
				let scrollDiv = this.scrollInfoDiv;
				let returnDiv = this.returningMainDiv;

				if(location)
				{
           return <RenderSunriseLocationData
            fetchDataByPlaceName={this.fetchDataByPlaceName}
            location={this.state.placeName}
            sunTime={sunTime} 
            nightTime={nightTime}
            scrollDiv={scrollDiv}
            returnDiv={returnDiv}
            latitude={ this.state.latitude}
            longitude={ this.state.longitude }
            getSunriseDataByLocation={this.getSunriseDataByLocation} />
				}
				else {
					return renderSunriseData({ sunTime, nightTime, scrollDiv, returnDiv });
				}
			}
			else if ( weatherData[3]
				&& (((weatherData[0].currentTimeStamp >= weatherData[1].endStamp) && (weatherData[0].currentTimeStamp < weatherData[1].tomorrowMidNightStamp))
				|| ((weatherData[0].currentTimeStamp >= weatherData[1].todayMidNightStamp) && (weatherData[0].currentTimeStamp < weatherData[1].startStamp))) )
			{
				let location = weatherData[0].place;
				let sunTime = weatherData[3].sunrisePahar;
				let nightTime = weatherData[3].sunsetPahar;
				let scrollDiv = this.scrollInfoDiv;
				let returnDiv = this.returningMainDiv;

				if ( location ) {
          return <RenderSunsetLocationData 
            fetchDataByPlaceName={this.fetchDataByPlaceName}
            location={this.state.placeName}
            sunTime={sunTime} 
            nightTime={nightTime}
            scrollDiv={scrollDiv}
            returnDiv={returnDiv}
            latitude={ this.state.latitude}
            longitude={ this.state.longitude }
            getSunriseDataByLocation={this.getSunriseDataByLocation}
            />;
				}
				else {
          return <RenderSunsetData 
          sunTime={sunTime}
          nightTime={nightTime}
          scrollDiv={scrollDiv}
          returnDiv={returnDiv} />;
				}
			}		
			else 
			{
				return <center className = 'center'> <PaharLoading /> </center>;
			}
		}
		// else if (this.state.errorMsg) {
		// 	return (
		// 		<center className = 'center'>
		// 			<span>
		// 				{this.state.errorMsg}
		// 			</span>
		// 		</center>
		// 	);
		// }
		else
		{
			return <center className = 'center'> <PaharLoading /> </center>;	
		}
	} 
}
export default SunriseSunset;