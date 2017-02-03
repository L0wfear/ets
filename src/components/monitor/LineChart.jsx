import React, { PropTypes, Component } from 'react';
import Highcharts from 'highcharts/highstock';
import { makeTime, makeDate } from 'utils/dates';


export default class LineChart extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    name: PropTypes.string,
    data: PropTypes.array,
    showX: PropTypes.bool,
  }

  componentDidMount() {
    this.createChart(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name) {
      this.chart.destroy();
      this.chart = null;
      this.createChart();
    }
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

      credits: {
        enabled: false,
      },

      plotOptions: {
        line: {
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

      navigator: {
        xAxis: {
          labels: {
            formatter() {
              return `<b>${makeDate(new Date(this.value * 1000))} ${makeTime(new Date(this.value * 1000))}</b>`;
            },
          },
        },
      },

      tooltip: {
        formatter: this.props.showX ? function () {
          let s = `<b>${makeDate(new Date(this.x * 1000))} ${makeTime(new Date(this.x * 1000))}</b>`;

          this.points.forEach((point) => {
            s += `<br/><span style="color: ${point.color}">\u25CF</span> ${point.series.name}: ${parseFloat(point.y).toFixed(3)}`;
          });

          return s;
        } : null,
        shared: true,
        valueDecimals: 0,
        headerFormat: '<br/>',
      },

      series: this.props.data,
    });
  }

  render() {
    const { name } = this.props;
    return <div id={name || 'lineChart'} />;
  }
}
