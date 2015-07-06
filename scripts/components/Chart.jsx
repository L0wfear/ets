import React from 'react';
import Keen from 'keen-js';
import { getDataForChart } from '../adapter.js';

let ChartWrapper = React.createClass({

  shouldComponentUpdate() {
    return false;
  },

  render() {
    return <div/>;
  },

  componentDidMount() {
    let el = this.getDOMNode();

    let chart = this._chart = new Keen.Dataviz()
      .el(el)
      .height(180)
      .colors([this.props.color])//[Keen.Dataviz.defaults.colors[6]])
      .library('google')
      .chartType('areachart')
      .chartOptions({
        chartArea: { top: '5%', height: '80%', left: '10%', width: '85%' },
        legend: { position: 'none' }
      })
      .prepare();

    this.refresh(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.refresh(nextProps);
  },

  refresh(props) {

    let data = props.data;

    if (data.length < 2) return;

    this._chart.dataType('chronological')
        .parseRawData({ result: data })
        .render();
  },

  componentWillUnmount() {
    // TODO cleanup
  }

});

export default React.createClass({

  render: function() {
    return (
      <div className="chart-wrapper">
        <div className="chart-title">
          {this.props.title}
        </div>
        <div className="chart-stage">
          <ChartWrapper {...this.props}/>
        </div>
      </div>
    );
  }

});
