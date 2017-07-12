import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { isEqual } from 'lodash';

import { ExtDiv } from 'components/ui/Div.jsx';
import Panel from 'components/ui/Panel.jsx';
import { hasTrackPointsChanged } from 'utils/geo';
import SpeedChart from './charts/SpeedChart';
import FuelChart from './charts/FuelChart';


export default class Charts extends Component {
  static propTypes = {
    car: PropTypes.object,
    trackPoints: PropTypes.arrayOf({}),
  }
  state = {
    chartTab: 0,
    rawData: false,
    hasTrackChanged: false,
  }
  componentWillReceiveProps(nextProps) {
    if (hasTrackPointsChanged(this.props.trackPoints, nextProps.trackPoints)) {
      this.setState({
        rawData: false,
        hasTrackChanged: true,
      });
    } else {
      this.setState({
        hasTrackChanged: false,
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (isEqual(this.state.chartTab, nextState.chartTab)) {
      return (
        hasTrackPointsChanged(this.props.trackPoints, nextProps.trackPoints) ||
        !isEqual(this.state.rawData, nextState.rawData)
      );
    }

    return true;
  }
  onMapClick = e => this.showOnMap(e.point.x, e)
  showOnMap = (timestamp, e, event) => {
    const threshold = e && e.point.series.closestPointRange ? e.point.series.closestPointRange : 0;
    const points = this.props.trackPoints.filter(p => (timestamp >= p.timestamp - threshold) && (timestamp <= p.timestamp + threshold));
    const point = points.length === 1 ? points[0] : points.reduce((prev, curr) => (Math.abs(curr.speed_avg - e.point.y) < Math.abs(prev.speed_avg - e.point.y) ? curr : prev));
    const extent = [point.coords_msk[0], point.coords_msk[1], point.coords_msk[0], point.coords_msk[1]];
    const map = this.props.car.marker.map;
    const track = this.props.car.marker.track;
    setTimeout(() => map.getView().fit(extent, { padding: [50, 550, 50, 50], maxZoom: 13 }), 100);
    map.get('parent').handleFeatureClick(track, point, event);
  }
  handleSourceDataCheck = () => this.setState({ rawData: !this.state.rawData })
  render() {
    return (
      <div>
        <ButtonGroup className="car-info-chart-menu">
          <Button className={!this.state.chartTab && 'active'} onClick={() => this.setState({ chartTab: 0 })}>Датчики топлива</Button>
          <Button className={this.state.chartTab && 'active'} onClick={() => this.setState({ chartTab: 1 })}>Датчики скорости</Button>
        </ButtonGroup>
        <Panel>
          <ExtDiv hidden={this.state.chartTab !== 0}>
            <FuelChart
              {...this.props}
              onMapClick={this.onMapClick}
              showOnMap={this.showOnMap}
              rawData={this.state.rawData}
              onSourceDataCheck={this.handleSourceDataCheck}
              hasTrackChanged={this.state.hasTrackChanged}
            />
          </ExtDiv>
          <ExtDiv hidden={this.state.chartTab !== 1}>
            <SpeedChart
              {...this.props}
              onMapClick={this.onMapClick}
              hasTrackChanged={this.state.hasTrackChanged}
            />
          </ExtDiv>
        </Panel>
      </div>
    );
  }
}
