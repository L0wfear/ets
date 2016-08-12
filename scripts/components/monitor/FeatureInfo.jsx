import React, { Component, PropTypes } from 'react';
import Panel from 'components/ui/Panel.jsx';
import { Button } from 'react-bootstrap';
import { getStatusById } from 'constants/statuses';
import config from '../../config.js';
import { makeDate, makeTime, getStartOfToday } from 'utils/dates';
import FuelChart from 'components/ui/charts/FuelChart.jsx';
import SpeedChart from 'components/ui/charts/SpeedChart.jsx';
import { getCarImage } from '../../adapter.js';
import { roundCoordinates } from 'utils/geo';
import DatePicker from 'components/ui/DatePicker.jsx';
import { getTypeById } from 'utils/labelFunctions';
import { GEOOBJECTS_TYPES_LABELS_SINGLE } from 'constants/geoobjects';

let DTFeature = ({feature}) =>
  <div>
    <h5>Наименование</h5>
    {feature.object_address}
    <h5>Общая площадь</h5>
    {feature.total_area}
  </div>
;

let ODHFeature = ({feature}) =>
  <div>
    <h5>Наименование</h5>
    {feature.name}
    <h5>Общая площадь</h5>
    {feature.total_area}
  </div>
;

let SSPFeature = ({feature}) =>
  <div>
    <h5>Наименование</h5>
    {feature.name}
    <h5>Адрес</h5>
    {feature.address}
    <h5>Производительность (куб. м в сутки)</h5>
    {feature.productivity}
  </div>
;

let MSPFeature = SSPFeature;

let CarpoolFeature = ({feature}) =>
  <div>
    <h5>Наименование</h5>
    {feature.name}
    <h5>Адрес</h5>
    {feature.address}
  </div>
;

let FuelingWaterStationFeature = CarpoolFeature;
let SnowStorageFeature = CarpoolFeature;

let DangerZoneFeature = ({feature}) =>
  <div>
    <h5>Адрес</h5>
    {feature.address_comm}
    <h5>Площадь на проезжей части, м2</h5>
    {feature.roadway_area}
    <h5>Площадь на тротуаре, м2</h5>
    {feature.sidewalk_area}
    <h5>Площадь на обочинах, м2</h5>
    {feature.sidelines_area}
  </div>
;

let PGMFeature = ({feature}) =>
  <div>
    <h5>Наименование</h5>
    {feature.name}
    <h5>Адрес</h5>
    {feature.address}
    <h5>Объем жидких ПГМ, т</h5>
    {feature.liquid_pgm_volume}
    <h5>Объем твердых ПГМ, т</h5>
    {feature.solid_pgm_volume}
    <h5>Тип ПГМ</h5>
    {feature.pgm_stores_type_name}
  </div>
;

export default class FeatureInfo extends Component {

  static propTypes = {
    feature: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  componentWillUnmount() {
  }

  renderFeatureByType() {
    const { feature } = this.props;
    let Feature = null;

    switch (feature.featureType) {
      case 'dt':
        Feature = DTFeature;
        break;
      case 'odh':
        Feature = ODHFeature;
        break;
      case 'ssp':
        Feature = SSPFeature;
        break;
      case 'msp':
        Feature = MSPFeature;
        break;
      case 'carpool':
        Feature = CarpoolFeature;
        break;
      case 'fuelingWaterStation':
        Feature = FuelingWaterStationFeature;
        break;
      case 'dangerZone':
        Feature = DangerZoneFeature;
        break;
      case 'pgm':
        Feature = PGMFeature;
        break;
      case 'snowStorage':
        Feature = SnowStorageFeature;
        break;
      default:
        Feature = () => <div/>
    }

    return <Feature {...this.props}/>;
  }

  renderModel() {
    const { feature } = this.props;
    return (
      <Panel title={''}>
        {this.renderFeatureByType()}
      </Panel>
    );
  }

  render() {
    let { feature } = this.props;

    return (
      <div className="car-info feature-info">
        <h3 className="car-info-plate">{GEOOBJECTS_TYPES_LABELS_SINGLE[feature.featureType]}</h3>
        {this.renderModel()}
      </div>
    );
  }
}
