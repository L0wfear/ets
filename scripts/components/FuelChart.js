import d3 from 'd3';
import React from 'react';


let margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 360 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

let x = d3.time.scale()
  .range([0, width]);

let y = d3.scale.linear()
  .range([height, 0]);

let xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(5)
  .tickFormat(TIME_FORMAT);


let yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

let line = d3.svg.line()
  .x(function(d) { return x(d.ts); })
  .y(function(d) { return y(d.amount); });

let TIME_FORMAT = d3.time.format('%Y-%m-%d');

function loadData( data ){

  let PARSED_DATA=[];

  let svg = d3.select( document.createElement('SVG'))
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    let _dt = new Date(d[0]*1000);
    PARSED_DATA.push({
      date: TIME_FORMAT(new Date(_dt)), //_dt.getFullYear()+'-'+_dt.getMonth()+'-'+_dt.getDate(),
      amount: Math.floor(+d[1]),
      ts: d[0]*1000
    })
  });

  x.domain(d3.extent(PARSED_DATA, function(d) { return d.ts; }));
  y.domain([0, d3.max(PARSED_DATA, function(d) { return d.amount; })]);

  svg.append("path")
    .data(PARSED_DATA)
    .attr("class", "line")
    .attr("d", line( PARSED_DATA ) );

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Уровень топлива");

  return svg;

}

var d3Chart = require('./d3Chart');

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});



export default loadData;
