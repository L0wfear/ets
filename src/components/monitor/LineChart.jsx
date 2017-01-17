import React, { PropTypes, Component } from 'react';
import Highcharts from 'highcharts/highstock';
import { makeTime } from 'utils/dates';


export default class LineChart extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    name: PropTypes.string,
    data: PropTypes.array,
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillUnmount() {
    this.chart = null;
  }

  onClick(e) {
    this.props.onClick(e);
  }

  createChart() {
    this.chart = Highcharts.stockChart(this.props.name || 'lineChart', {

      rangeSelector: {
        enabled: false,
      },

      legend: {
        enabled: true,
        align: 'bottom',
        layout: 'vertical',
        verticalAlign: 'top',
        y: 220,
      },

      plotOptions: {
        line: {
          connectNulls: false,
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          events: {
            click: e => this.onClick(e),
          },
        },
      },

      chart: {
        height: 400,
        marginBottom: 120,
      },

      xAxis: {
        labels: {
          formatter() {
            return `${makeTime(new Date(this.value * 1000))}`;
          },
        },
      },

      yAxis: {
        opposite: false,
      },

      tooltip: {
        show: 'false',
        headerFormat: '<br/>',
        valueDecimals: 0,
      },

      series: this.props.data,
    });
  }

  render() {
    const { name } = this.props;
    return <div id={name || 'lineChart'} />;
  }
}
