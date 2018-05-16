import * as React from 'react';
import { connect } from 'react-redux';

import { setInitialStateInToolbar } from 'redux/modules/toolbar';

import CarsLegend from 'components/monitor/toolbarTSX/items/CarsLegend/CarsLegend';
import TrackAndGeometryLegend from 'components/monitor/toolbarTSX/items/TrackAndGeometryLegend/TrackAndGeometryLegend';
import CarsGosNumber from 'components/monitor/toolbarTSX/items/CarsGosNumber/CarsGosNumber';
import GeoObjectLegend from 'components/monitor/toolbarTSX/items/GeoObjectLegend/GeoObjectLegend';

@connect(
  () => ({}),
  {
    setInitialStateInToolbar,
  },
)
class Toolbar extends React.Component<any, any> {
  componentWillUnmount() {
    this.props.setInitialStateInToolbar();
  }
  render() {
    return (
      <div className="app-toolbar-new">
        <CarsLegend />
        <TrackAndGeometryLegend />
        <CarsGosNumber />
        <GeoObjectLegend />
      </div>
    );
  }
}

export default Toolbar;
