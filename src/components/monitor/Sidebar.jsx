import React, { Component, PropTypes } from 'react';
import Div from 'components/ui/Div.jsx';
import cx from 'classnames';
import { autobind } from 'core-decorators';
import CarInfo from './car_info/CarInfo.jsx';
import FeatureInfo from './FeatureInfo.jsx';

@autobind
export default class Sidebar extends Component {

  static get propTypes() {
    return {
      selected: PropTypes.object,
      selectedFeature: PropTypes.object,
      flux: PropTypes.object,
    };
  }

  shouldComponentUpdate() {
    // const noSelected = this.props.selected === null;
    // const noSelectedFeature = this.props.selectedFeature;
    // const selectedHasChanged = this.props.selected && nextProps.selected.id !== this.props.selected.id;
    // const selectedFeatureHasChanged = this.props.selectedFeature && this.props.selectedFeature.id !== nextProps.selectedFeature.id;
    // if (noSelected || selectedHasChanged || selectedFeatureHasChanged) {
    //   return true;
    // }
    // return false;
    return true;
  }

  close() {
    const { selected, selectedFeature } = this.props;
    let store;
    if (selected) {
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

  renderFeatureInfo() {
    const { selectedFeature } = this.props;
    return <FeatureInfo feature={selectedFeature} />;
  }

  renderCarInfo() {
    const { selected, flux } = this.props;
    return <CarInfo car={selected} flux={flux} onclose={this.close} />;
  }

  renderInfo() {
    const { selectedFeature, selected } = this.props;
    if (selectedFeature) {
      return this.renderFeatureInfo();
    } else if (selected) {
      return this.renderCarInfo();
    }
    return <div />;
  }

  render() {
    // TODO оптимизировать рендер
    const { selected, selectedFeature } = this.props;
    const dashboardClassName = cx('monitor-sidebar', { 'monitor-sidebar-sm': selectedFeature });

    return (
      <Div hidden={!selected && !selectedFeature} className={dashboardClassName}>
        <span className="monitor-sidebar-close" onClick={this.close}>×</span>
        {this.renderInfo()}
      </Div>
    );
  }

}
