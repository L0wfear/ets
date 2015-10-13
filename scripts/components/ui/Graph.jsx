import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from '../../vendor/Sparklines.js';
import { getFuelData } from '../../adapter.js';
import Panel from '../Panel.jsx';
import Preloader from './Preloader.jsx'

export default class Graph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.fetch();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.to !== this.props.to || nextProps.from !== this.props.from || nextProps.id !== this.props.id;
  }

  fetch() {
    let {from, to, type, id} = this.props;

    switch (type) {
      case 'fuel':
        getFuelData(from, to, id).then(data => this.setState({
            data: data
          }))

    }
  }

  render() {
    let data = this.state.data;
    let from = this.props.from;
    let to = this.props.to;

    console.log('rendering graph')

    let rendered = <div> Нет данных </div>;

    if (data === null) {
      rendered = <Preloader type="graph" style={{
        height: 103
      }}/>;
    } else if (data.length > 0) {
      rendered = <div style={{
        fontSize: '10px'
      }}>
      <Sparklines data={data} width={400} height={90} margin={6} style={{
        marginBottom: '10px'
      }}>
	      <SparklinesLine style={{
        strokeWidth: 1,
        stroke: 'orange',
        fill: 'orange',
        fillOpacity: '0.25'
      }}/>
      </Sparklines>
      <span style={{
        position: 'absolute',
        left: '10px',
        transform: 'rotate(-90deg)',
        top: '46px'
      }}>% топлива</span>
      <span style={{
        position: 'absolute',
        left: '47px',
        bottom: '5px'
      }}>{from}</span>
      <span style={{
        position: 'absolute',
        right: '42px',
        bottom: '5px'
      }}>{to}</span>
      </div>
    }

    return (
      <Panel title="График уровня топлива">
          {rendered}
        </Panel>
      )
  }

}