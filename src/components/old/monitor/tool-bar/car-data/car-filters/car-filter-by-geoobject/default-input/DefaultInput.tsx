import * as React from 'react';
import { connect } from 'react-redux';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { monitorPageChangeGeoobjectsFilter } from 'components/old/monitor/redux-main/models/actions-monitor-page';

import {
  PropsDefaultInput,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-geoobject/default-input/DefaultInput.h';

const DefaultInput: React.FC<PropsDefaultInput> = ({ OPTIONS, OPTIONS: { length }, ...props }) => (
  <ExtField
    label={false}
    type="select"
    value={props.value}
    onChange={props.changeFilter}
    placeholder={`${props.placeholder}${!length ? ' (нет данных)' : ''}`}
    options={OPTIONS}
    disabled={!length}
    clearable={false}
  />
);

const mapStateToProps = (state) => ({
  value: state.monitorPage.geoobjectsFilter,
});

const mapDispatchToProps = (dispatch) => ({
  changeFilter: (value: string) => (
    dispatch(
      monitorPageChangeGeoobjectsFilter(
        value
      ),
    )
  ),
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefaultInput);
