import React, {Component} from 'react';
import Chart from './BaseChart.jsx';
import { makeDate, makeTime } from 'utils/dates';

const LEGEND = '% топлива';

export default class FuelChart extends Chart {

  constructor(props) {
    super(props)
    this.type = 'fuel';
  }

  componentWillReceiveProps(nextProps) {

    //console.log('fuel chart received props', nextProps);

    if (nextProps.to !== this.props.to ||
        nextProps.from !== this.props.from ||
        nextProps.id !== this.props.id) {
         this.fetch()
      }
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.to !== this.props.to ||
      nextProps.from !== this.props.from ||
      nextProps.id !== this.props.id) {
       this.fetch()
     	 return true;
    }
    return false;
  }*/

  renderLegend() {
  	let {from, to} = this.props;

    return (<div><span style={{
        position: 'absolute',
        left: '10px',
        transform: 'rotate(-90deg)',
        top: '46px'
      }}>{LEGEND}</span>
      <span style={{
        position: 'absolute',
        left: '47px',
        bottom: '5px'
      }}>{makeDate(from) + ' ' + makeTime(from)}</span>
      <span style={{
        position: 'absolute',
        right: '42px',
        bottom: '5px'
      }}>{makeDate(to) + ' ' + makeTime(to)}</span></div>)
  }

  fetch() {
  	let {from, to, id} = this.props;

    this.setState({loaded: false})

    // getFuelData(from, to, id)
    //   .then(data => {
    //     this.setState({
    //       data: data,
    //       loaded: true
    //     })
    //   })

  }
}
