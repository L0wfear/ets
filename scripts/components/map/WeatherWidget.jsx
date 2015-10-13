import React, { Component } from 'react';
import { getWeather } from '../../adapter.js';

class WeatherWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      icon: null,
      temp: null
    };
  }

  componentDidMount() {
    getWeather()
      .then(({ temp, icon }) => this.setState({ temp, icon, loaded: true }));
  }

  render() {
    const { loaded, temp, icon } = this.state;

    if (!loaded) {
      return null;
    }

    return (
      <div className="weather-widget">
        <img src={icon} style={{ width: 35, height: 35 }}/>
        <span>{temp > 0 ? '+' : '' + temp + ' °C'}</span>
      </div>
    );
  }

}


export default WeatherWidget;
