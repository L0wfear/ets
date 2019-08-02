import * as React from 'react';
import * as Highcharts from 'highcharts/highstock';

import { makeTime, makeDate } from 'components/@next/@utils/dates/dates';

type PropsLineChart = {
  data: Highcharts.SeriesOptionsType[],
  onClick: any;
  name: string;
  showX: boolean;
};

type StateLineChart = {

};

class LineChart extends React.Component<PropsLineChart, StateLineChart> {
  chart: any;
  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    /**
     * Кол-во серий данных +1, так как навигатор под графиком тоже включен в серию данных.
     */
    if (this.chart &&  this.chart.series) {
      this.props.data.forEach((newSeries, i) => this.chart.series[i].update(newSeries));
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
        align: 'left',
        layout: 'vertical',
        verticalAlign: 'top',
        floating: true,
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
            click: (e) => this.onClick(e),
          },
        },
      },

      chart: {
        height: 400,
        marginBottom: 120,
      },

      xAxis: {
        ordinal: false,
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
        formatter: this.props.showX ? function(tooltip?: Highcharts.TooltipFormatterContextObject | any) {
          let s = `<b>${makeDate(new Date(this.x * 1000))} ${makeTime(new Date(this.x * 1000))}</b>`;

          tooltip.chart.hoverPoints.forEach((point) => {
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

export default LineChart;
