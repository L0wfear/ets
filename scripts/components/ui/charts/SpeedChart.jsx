import Chart from './BaseChart.jsx';

export default class SpeedChart extends Chart {

  constructor(props) {
    super(props)
    this.type = 'speed';
  }

  componentWillReceiveProps() {
    this.fetch()
  }


  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  fetch() {
    let track = this.props.track;
    let data = [];
    if (track) {
      let points = track.points;
      data = points.map(point => point.speed_avg)
    }

    this.setState({
      data: data,
      loaded: true
    })
  }


}
