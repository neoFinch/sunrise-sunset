import React, { useEffect, useRef, useState } from 'react';
import  '../hamburger.scss';
import SunsetImageUpload from '../SunsetImageUpload';
import SunriseImageUpload from '../SunriseImageUpload';
import { Link } from "react-router-dom";
import '../UIDesigning.css';
import '../App.css';
import DownArrow from '../DownArrow';
import Constants from '../constants';
import { ToastContainer } from 'react-toastify';


export function RenderSunsetLocationData({ location, sunTime, nightTime, scrollDiv, returnDiv, latitude, longitude, fetchDataByPlaceName, getSunriseDataByLocation}) {

  // console.log('RenderSunsetLocationData', JSON.stringify(nightTime))
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [nightLamha, setNightLamha] = useState(nightTime.convertToLamha);
  // let API_KEY = 'AIzaSyAsLC4glXRid8OUIU6FVcV5TwCGrZeDPHg';
  
  const searchByPlaceName = (e) => {
    // if (e.key === 'Enter') {
      // search by place name
      // console.log('search  : ', query);
      if (query.length < 3) {
        setSuggestions([]);
        return
      };
      let url = Constants.BASE_URL + '/search/' + query;
      fetch(url, {
        method: 'GET',
      }).then(res => res.json())
      .then(res => {
        // console.log('res : ', res);
        setSuggestions(res.places);
      })
    // }
  }

  // useEffect(() => {
  //   // console.log('--------- value changes -------');
  //   // console.log(JSON.stringify(sunTime));
  //   // console.log({nightTime});
  // }, [nightTime])
  
	return (
		<div className = 'main-content-wrapper'>

			<div id = 'main-div'className = 'sunrise-sunset-night-wrapper' >
				<div className = 'about-link-wrapper' >
					<Link className = 'link-wrapper' to="/about"> ABOUT </Link>
				</div>
				<div className = 'location-wrapper'>
					<div className = 'location-text-wrapper'>CURRENT TIME AT</div>
					<div className = 'location-night'> 
            { location } 
            <span className='text-sm'>
              {'(' + parseFloat(latitude).toFixed(4) + ', ' + parseFloat(longitude).toFixed(4) + ')'}
            </span>
          </div>
				</div>
        <div className='search-by-location-name-wrapper'>
          <div className='search-by-location-name'>
            <input 
              ref={autoCompleteRef} 
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Type a location'
              value={query}
              onKeyUp={searchByPlaceName}
            />
            <button
              onClick={getSunriseDataByLocation}
              type='button'
              className='location-btn'>
              <img src={require('../assets/images/location.svg')}/>
            </button>
            {
              suggestions.length ?
              <div className='place-suggestion'>
                {
                  suggestions.map( suggest => 
                    <div 
                      key={suggest.id} 
                      onClick={() => {
                        fetchDataByPlaceName(suggest.coord.lat, suggest.coord.lon, suggest.name);
                        setSuggestions([])
                        setQuery('')
                        }}>
                      {suggest.name + '(' + suggest.country + ')'}
                    </div> 
                  )
                }
              </div>
              : null
            }
            </div>
        </div>
				<center>
					<div className = 'nighttime-container'>
						<div className = 'nighttime-image-wrapper'>
							<span> <SunsetImageUpload /> </span>	
							<span className = 'nighttime-text-container'>Night-time</span>
						</div>
						<div className = 'time-container'>
								{ nightTime }
								<span className = 'time-text-wrapper'>
									<span className = 'pahar-text-wrapper'>PAHAR</span>
									<span className = 'garhi-text-wrapper'>GHARHI</span>
									<span className = 'pal-text-wrapper'>PAL</span>
									<span className = 'lamha-text-wrapper'>LAMHA</span>
								</span>
						</div>
					</div>
				</center>

				<center>
					<div className = 'nighttime-sunrise-container'>
						<div className = 'nighttime-image-wrapper'>
							<span> <SunriseImageUpload /> </span>	
							<span className = 'nighttime-sunrise-text-container'>Time to sunrise</span>
						</div>
						<div className = 'time-container'>
								{ sunTime }
								<span className = 'time-text-wrapper'>
									<span className = 'pahar-text-wrapper'>PAHAR</span>
									<span className = 'garhi-text-wrapper'>GHARHI</span>
									<span className = 'pal-text-wrapper'>PAL</span>
									<span className = 'lamha-text-wrapper'>LAMHA</span>
								</span>
						</div>
					</div>
				</center>
				<div id = 'read-more' className = 'read-more-wrapper' onClick = { scrollDiv }>
					<div className = 'link-wrapper'>READ MORE</div>
					<DownArrow />
				</div>
			</div>
			<div id = 'scrollUp' className = 'info-div-wrapper'> 
				<div className = 'pahar-heading'><b>PAHAR</b></div> A day and night consists of 4 pahars each. Day begins at sunrise and ends at sunset and Night is exactly opposite. Since length of day and night changes from season to season, pahars of the day and night are not of equal length of time.<br/><br/>

				<div className = 'garhi-heading'><b>GHARHI</b></div>Each pahar is divided into 8 equal parts called Gharhi.<br/><br/>

				<div className = 'pal-heading'><b>PAL</b></div>60 pals make one gharhi.<br/><br/>

				<div className = 'lamha-heading'><b>LAMHA</b></div>Lamha and pal are considered interchangeable however in this app we have set 60 lamhas for each pal. Explanation on why this was done can be found in the about page.<br/><br/>

				The format of time in this app is displayed as:<br/><br/>

				Pahar | Gharhi | Pal | Lamha<br/><br/>
				1 | 5 | 27 | 52<br/><br/>

				This app was conceptualized by Kashif-ul-Huda (<a target='_blank' href='https://twitter.com/kaaashif'>@kaaashif</a>) and developed by QED42 Team (<a target='_blank' href='https://twitter.com/qed42'>@QED42</a>).
				<div id = 'go-up' className = 'go-up-wrapper' onClick = { returnDiv }>
					<span className = 'link-wrapper'>GO UP</span>
				</div>	
			</div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover 
      />
		</div>
	)
}