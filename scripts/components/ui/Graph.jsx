import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from '../../vendor/Sparklines.js';
import { getFuelData } from '../../adapter.js';
import Panel from '../Panel.jsx';
import Preloader from './Preloader.jsx'
import { makeDate, makeTime } from '../../utils/dates.js';

export default class Graph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loaded: false
    }

    this.headers = {
      fuel: 'График уровня топлива'
    }
  }

  componentDidMount() {
    this.fetch();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loaded !== nextState.loaded;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.to !== this.props.to || nextProps.from !== this.props.from || nextProps.id !== this.props.id) {
      this.fetch()
    }
  }

  fetch() {
    let {from, to, type, id} = this.props;

    this.setState({loaded: false})

    switch (type) {
      case 'fuel':
        getFuelData(from, to, id).then(data => {
          this.setState({
            data: data,
            loaded: true
          })
        })
    }
  }

  render() {
    let data = this.state.data;
    let from = this.props.from;
    let to = this.props.to;

    console.log('rendering graph')
    let rendered = <div> Нет данных </div>;

    if (!this.state.loaded) {
      rendered = <Preloader type="graph" style={{height: 103}}/>;
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
      }}>{makeDate(from) + ' ' +makeTime(from)}</span>
      <span style={{
        position: 'absolute',
        right: '42px',
        bottom: '5px'
      }}>{makeDate(to) + ' ' + makeTime(to)}</span>
      </div>
    }

    return (
      <Panel title={this.headers[this.props.type]}>
          {rendered}
        </Panel>
      )
  }

}