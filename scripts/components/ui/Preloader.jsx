import React, {Component} from 'react';

export default class Preloader extends Component {
	constructor(props) {
		super(props)
	}

  render() {

  	switch (this.props.type) {
  		case 'mainpage': 
	  		return (
		      <div className="cssload-loader"></div>
		    )

	    case 'graph': 
	    	return ( // TODO заменить .svg
		      <img src="images/infinity.gif" style={this.props.style} alt="Идет загрузка графика топлива"/>
		      /* <svg width='120px' height='120px' viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" xmlns:xlink="http://www.w3.org/1999/xlink" class="uil-inf"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><path id="uil-inf-path" d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z" fill="none" stroke="#c0bb9c" stroke-width="1px" stroke-dasharray="5px"></path><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="0s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="0.33s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="0.66s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="1s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle><circle cx="0" cy="0" r="5" fill="#00b8ff"><animateMotion begin="1.33s" dur="4s" repeatCount="indefinite"><mpath xlink:href="#uil-inf-path"></mpath></animateMotion></circle>
		       </svg>*/
	      )	
  	}

  }
}
