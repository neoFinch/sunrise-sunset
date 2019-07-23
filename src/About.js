import React from 'react';
import { Link } from "react-router-dom";
import  './hamburger.scss';
import './UIDesigning.css';
import './App.css';
import QuoteImage from './QuoteImage';
import InvertedQuoteImage from './InvertedQuoteImage';

class About extends React.Component
{
	render()
	{	
		return (
			<div>
				<div className = 'about-div-wrapper'>
					<div className = 'home-link-wrapper' >
					  <Link className = 'link-wrapper' to="/"> HOME </Link>
					</div>
					<div className = 'shayari-wrapper'>
						<div> <QuoteImage /></div><br/><br/>
						<i>main pal do pal ka shayar hoon</i><br/><br/>

						<i>lamhon ne khata ki, sadiyon ne saza paayi</i><br/><br/>

						<i>gharhi do gharhi</i><br/><br/>

						<i>do pahar</i><br/><br/>
						<div> <InvertedQuoteImage /></div>
					</div><br/><br/>

					We all have heard these terminologies in our songs, proverbs, and in everyday usage. Pahar, Gharhi, and Pal, etc..have survived in our languages even though only a few of us know that these words are technical terms that denote specific lengths of time.<br/><br/>

					Ubiquitousness of hours, minutes, and seconds meant that this artificial measurement of time is the only timekeeping methods we have known since last few generations. However, civilizations that produced their own calendars (based on lunar, solar, or lunisolar) also came up with  systems of measurement of time duringday and night.<br/><br/>


					<div className = 'about-heading-wrapper'><b>TIMEKEEPING METHOD:</b></div><br/>

					India had many different ways of time keeping going all the way back to the Vedic era. The colonization project, removed traces of those time keeping methods from living memories. All we have now is bits and pieces of information mentioned in some historical work. <br/><br/>

					From some of these sources and especially Baburnama which gives a detailed description of the timekeeping in medieval India, we were able to reverse engineer to figure out the calculations.<br/><br/>

					The team at QED42 did a fantastic job of coding that and deploying it as a web app. Based on interest and usefulness we may develop it as a proper app for smart phones in the future.<br/><br/>

					The beautiful work of QED42 ensures that you don't have to refresh the page to get the new time. Time is auto calculated based on your location. Location determines the sunrise and sunset at your location which is our input parameter for the time calculation.<br/><br/>

					Once we have the sunrise and sunset we divide both day and night into 4 pahars each. Day and night pahars will vary in length. Pahars are divided into 8 gharhis and each gharhi is further divided into 60 pals. <br/><br/>

					We had to introduce another term lamha, which from references seems to be interchangeable with pal, however we made one pal equal to 60 lamha. The reason we did was to make the display more animated and user will know at a glance that time is being constantly moving forward. Since pal is not equivalent to second it wasn't changing fast enough for a user to know that a page refresh is not needed to get new time.<br/><br/>


					<div className = 'about-heading-wrapper'><b>UTILITY:</b></div><br/>

					Why do we need this medieval time when the whole world has adapted Hours: Minutes: Seconds format of time keeping? Since this European time is based on physical measurement a second is same everywhere in the world. Same goes for minutes and hours. While duration of time for pahar, gharhi, and pal will change depending on the length of the day.<br/><br/>

					So how can this time be useful if it is not consistent from day to day and place to place? Pahar is closely aligned to nature. E.g. you have heard the term "dopahar" which is actually do pahar or two pahars. In current usage in the language it means afternoon but 2 pahars corresponds to the time when sun is at it's zenith i.e. solar noon. Interestingly, this is also the time when Muslim prayer of Zuhar starts.<br/><br/>

					And if you get to three pahar this is the time for start of Islamic prayer of Asr. The next Muslim prayer maghrib is after sunset which is after the completion of 4th pahar of the day.<br/><br/>

					The last prayer of the day Isha starts when the first pahar of the night is clocked. Similarly, the Fajr, or dawn prayer is between third and fourth pahar of the night.<br/><br/>

					Currently, Muslim prayer app does this calculation and converts prayer times to hours and minutes which changes everyday. But the beauty of this app is that a user can tell which prayer is in by just looking at the pahar. He or she will not need to first look at the time and then prayer app to figure out which prayer is in.<br/><br/>

					So we have established that there is a utility for Muslims but what about the rest? It is a harder question since our modern life is run by artificial time rather than anything to do with nature. The fact that the date changes at 12 O'clock at night tells us that this whole system is unnatural. May this be the reason that some cultures have difficulty showing up on time?<br/><br/>

					Knowing the pahar, even if we don't change our business and school timings to this, will make us more attuned to nature around us. We will begin to pay more attention to length of day and night, tweeting and migration of birds, blossoming of flowers and harvesting seasons. <br/><br/>

					<div className = 'about-heading-wrapper'><b>LIMITATIONS:</b></div><br/>

					We are not proposing changing the current hours time to pahar time. It will not work if you setup a conference call with your business partner in a different city at say 3 pahar of the day. His 3 pahar will be different than yours. <br/><br/>

					However, this is not much different than now in setting up meetings at different time zones. Technology provides a solution by converting a particular time to participants' local time zones. Something similar can be done here too if this idea takes off.<br/><br/>

					Until then enjoy this fun project and know that there are many alternate ways of thinking about the problems of humanity. In our rush to standardize things let's not forget the wisdom behind those alternate systems.<br/><br/>
				</div>
					
			</div>
		)
	}
}
export default About;