import * as React from 'react';
import { connect } from 'react-redux';
import { ExtField } from 'components/ui/Field.jsx';
import { monitorPageChangeFilter } from 'components/monitor/new/redux/models/actions-monitor-page';

import {
  PropsDefaultInput,
} from 'components/monitor/new/tool-bar/car-data/car-filters/car-filter-by-select/default-input/DefaultInput.h';

const DefaultInput: React.SFC<PropsDefaultInput> = ({ OPTIONS, OPTIONS: { length }, ...props }) => (
  <ExtField
    multi
    label={false}
    type="select"
    value={props.value}
    onChange={props.changeFilter}
    placeholder={`${props.placeholder}${!length ? ' (нет данных)' : ''}`}
    options={OPTIONS}
    disabled={!length}
  />
)
const mapStateToProps = (state, { keyField }) => ({
  value: state.monitorPage.filters.data[keyField],
});

const mapDispatchToProps = (dispatch, { keyField }) => ({
  changeFilter: (stringMulty: string) => (
    dispatch(
      monitorPageChangeFilter(
        keyField,
        stringMulty,
      ),
    )
  ),
  dispatch,
});

 export default connect(
  mapStateToProps,
  mapDispatchToProps,
 )(DefaultInput);
