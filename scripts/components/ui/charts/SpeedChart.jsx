import Chart from './BaseChart.jsx';

export default class SpeedChart extends Chart {

  constructor(props) {
    super(props);
    this.type = 'speed';
  }

  componentWillReceiveProps() {
    this.fetch();
  }

  shouldComponentUpdate() {
    return true;
  }

  fetch() {
    const track = this.props.track;
    let data = [];
    if (track) {
      const points = track.points;
      data = points.map(point => point.speed_avg);
    }

    if (data.length === 0) return;

    this.setState({
      data,
      loaded: true,
    });
  }


}
