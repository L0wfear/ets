import React, { Component, PropTypes } from 'react';
import CarInfo from './CarInfo.jsx';
import FeatureInfo from './FeatureInfo.jsx';
import Div from 'components/ui/Div.jsx';
import cx from 'classnames';

export default class Sidebar extends Component {

  static propTypes = {
    selected: PropTypes.object,
    selectedFeature: PropTypes.object
  }

  constructor() {
    super();
  }

  shouldComponentUpdate(nextProps) {
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

  renderFeatureInfo() {
    const { selectedFeature } = this.props;
    return <FeatureInfo feature={selectedFeature}/>
  }

  renderCarInfo() {
    const { selected, flux } = this.props;
    return <CarInfo car={selected} flux={flux} onclose={this.close.bind(this)}/>;
  }

  renderInfo() {
    const { selectedFeature, selected } = this.props;
    if (selectedFeature) {
      return this.renderFeatureInfo();
    } else if (selected) {
      return this.renderCarInfo();
    } else {
      return <div/>
    }
  }

  render() {
    // TODO оптимизировать рендер
    let { selected, selectedFeature } = this.props;
    const dashboardClassName = cx('monitor-sidebar', {'monitor-sidebar-sm': selectedFeature});

    return (
      <Div hidden={!selected && !selectedFeature} className={dashboardClassName}>
        <span className="monitor-sidebar-close" onClick={this.close.bind(this)}>×</span>
        {this.renderInfo()}
      </Div>
    );
  }

  close() {
    const { selected, selectedFeature } = this.props;
    let store;
    if (selected) {
      store = this.props.flux.getStore('points');
      store.handleSelectPoint(false);
    } else if (selectedFeature) {
      store = this.props.flux.getStore('geoObjects');
      store.handleSelectFeature(null);
    }
  }

}
