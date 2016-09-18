import React, { Component } from 'react';
import Panel from 'components/ui/Panel.jsx';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import Preloader from '../Preloader.jsx';

const HEADERS = {
  fuel: 'График уровня топлива',
  speed: 'График скорости',
};

export default class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
    };
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
    const data = this.state.data;

    if (!data.length) {
      return <div> Нет данных </div>;
    }

    return (
      <div style={{ fontSize: '10px' }}>
        <Sparklines
          data={data}
          width={400}
          height={90}
          margin={6}
          style={{
            marginBottom: '10px',
          }}
        >
          <SparklinesLine
            style={{
              strokeWidth: 1,
              stroke: 'orange',
              fill: 'orange',
              fillOpacity: '0.25',
            }}
          />
        </Sparklines>
        {this.renderLegend()}
      </div>
    );
  }

  render() {
    const { loaded } = this.state;

    return (
      <Panel title={HEADERS[this.type]}>
        {loaded ?
          this.renderChart()
        : <Preloader type="graph" style={{ height: 103 }} />}
      </Panel>
    );
  }

}
