import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import Div from 'components/ui/Div.jsx';
import CarInfo from './car_info/CarInfo.jsx';
import FeatureInfo from './FeatureInfo.jsx';

export default class Sidebar extends Component {
  static get propTypes() {
    return {
      selected: PropTypes.object,
      selectedFeature: PropTypes.object,
      flux: PropTypes.object,
    };
  }
  close = () => {
    const { selected, selectedFeature } = this.props;
    let store;
    if (selected && selected.marker.track) {
      store = this.props.flux.getStore('points');
      selected.marker.track.sensorsState = {
        equipment: [],
        level: [],
      };
      store.handleSelectPoint(false);
    } else if (selectedFeature) {
      store = this.props.flux.getStore('geoObjects');
      store.handleSelectFeature(null);
    }
  }
  render() {
    // TODO оптимизировать рендер
    const { selected, selectedFeature, flux } = this.props;
    const dashboardClassName = cx('monitor-sidebar', { 'monitor-sidebar-sm': selectedFeature });
    const notSelected = !selected && !selectedFeature;

    return (
      <Div hidden={notSelected} className={dashboardClassName}>
        <span className="monitor-sidebar-close" onClick={this.close}>×</span>
        {selected &&
          <CarInfo car={selected} flux={flux} onclose={this.close} />
        }
        {selectedFeature &&
          <FeatureInfo feature={selectedFeature} />
        }
        {notSelected && <div />}
      </Div>
    );
  }
}
