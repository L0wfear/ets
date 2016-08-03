import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from '../../../vendor/Sparklines.js';
import Panel from 'components/ui/Panel.jsx';
import Preloader from '../Preloader.jsx'

const HEADERS = {
  fuel: 'График уровня топлива',
  speed: 'График скорости'
}

export default class Graph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loaded: false
    }
    this.type = '';
  }

  componentDidMount() {
    this.fetch();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loaded !== nextState.loaded;
  }

  renderLegend() {
    return null;
  }

  renderChart() {
    let data = this.state.data;

    return  <div style={{
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
            {this.renderLegend()}
            </div>
  }

  render() {
    //console.log('rendering graph', this.type, this.state, this.props)
    let {loaded, data} = this.state;

    return <Panel title={HEADERS[this.type]}>
           {loaded ?
              data.length ?
                this.renderChart()
                :
                <div> Нет данных </div>
            : <Preloader type="graph" style={{height: 103}}/>}
          </Panel>
  }

}
