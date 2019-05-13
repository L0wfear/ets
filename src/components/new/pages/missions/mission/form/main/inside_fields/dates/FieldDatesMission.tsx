import * as React from 'react';
import { connect } from 'react-redux';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldDatesMission,
  StatePropsFieldDatesMission,
  DispatchPropsFieldDatesMission,
  OwnPropsFieldDatesMission,
  StateFieldDatesMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/dates/FieldDatesMission.h';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { get } from 'lodash';

import {
  ColStartDatePickerWithDropdown,
  ColDividerDatePicker,
  ColEndDatePicker,
  DropdownDateEnd,
  ExtFieldDateStartWrap,
  FieldDatesMissionContainer,
} from './styled';
import { Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import { addTime, getDateWithMoscowTzByTimestamp, createValidDateTime, diffDates } from 'utils/dates';
import { routeTypesByTitle } from 'constants/route';
import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';

class FieldDatesMission extends React.PureComponent<PropsFieldDatesMission, StateFieldDatesMission> {
  componentDidMount() {
    const {
      IS_CREATING,
      MISSION_IS_ORDER_SOURCE,
      date_start,
    } = this.props;
    if (IS_CREATING && MISSION_IS_ORDER_SOURCE && date_start) {
      this.updateDateStartByCurrentTime();
    }
  }
  componentDidUpdate(prevProps) {
    const {
      is_cleaning_norm,
      date_start,
      object_type_name,
      norm_ids,
    } = this.props;
    if (prevProps.norm_ids !== norm_ids && is_cleaning_norm && date_start && object_type_name) {
      if (is_cleaning_norm && date_start && object_type_name) {
        const time = get(routeTypesByTitle, `${object_type_name}.time`, null);
        if (time) {
          this.props.onChange({
            date_end: addTime(
              date_start,
              time,
              'hours',
            ),
          });
        }
      }
    }
  }

  async updateDateStartByCurrentTime() {
    const {
      time: { date },
    } = await loadMoscowTime();

    const currentTime = createValidDateTime(getDateWithMoscowTzByTimestamp(date));

    const { date_start } = this.props;

    if (diffDates(currentTime, date_start) > 0) {
      this.props.onChange({
        date_start: currentTime,
      });
    }
  }

  handleChangeDateStart = (date_start) => {
    const {
      is_cleaning_norm,
      object_type_name,
      norm_ids,
    } = this.props;

    if (norm_ids && is_cleaning_norm && date_start && object_type_name) {
      if (is_cleaning_norm && date_start && object_type_name) {
        const time = get(routeTypesByTitle, `${object_type_name}.time`, null);
        if (time) {
          this.props.onChange({
            date_start,
            date_end: addTime(
              date_start,
              time,
              'hours',
            ),
          });
        }
      }
    } else {
      this.props.onChange({ date_start });
    }
  }

  handleChangeHoursDateEnd = (countHours) => {
    const { date_start } = this.props;

    if (date_start) {
      this.props.onChange({
        date_end: addTime(date_start, Number(countHours), 'hours'),
      });
    }
  };

  render() {
    const {
      isPermitted,

      date_start,
      error_date_start,
      date_end,
      error_date_end,
    } = this.props;

    return (
      <FieldDatesMissionContainer>
        <Row>
          <Col md={12}>
            <label>Время выполнения:</label>
          </Col>
        </Row>
        <Row>
          <ColStartDatePickerWithDropdown md={5}>
            <ExtFieldDateStartWrap
              id="date-start"
              type="date"
              label={false}
              error={error_date_start}
              value={date_start}
              disabled={!isPermitted || this.props.disabled}
              onChange={this.handleChangeDateStart}
            />
            <DropdownDateEnd
              id="date-end-dropdown"
              disabled={
                !isPermitted
                || !date_start
                || this.props.disabled
              }
              onSelect={this.handleChangeHoursDateEnd}
              title="Продолжительность задания, ч"
            >
              <Dropdown.Toggle disabled={false}>
                <Glyphicon id="select-date_end" glyph="time" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="select-date-end-custom">
                <MenuItem eventKey={1}>1</MenuItem>
                <MenuItem eventKey={2}>2</MenuItem>
                <MenuItem eventKey={3}>3</MenuItem>
                <MenuItem eventKey={4}>4</MenuItem>
                <MenuItem eventKey={5}>5</MenuItem>
              </Dropdown.Menu>
            </DropdownDateEnd>
          </ColStartDatePickerWithDropdown>
          <ColDividerDatePicker md={2}>
            <div>—</div>
          </ColDividerDatePicker>
          <ColEndDatePicker md={5}>
            <ExtField
              id="date-end"
              type="date"
              label={false}
              error={error_date_end}
              date={date_end}
              disabled={
                !isPermitted
                || this.props.disabled
              }
              onChange={this.props.onChange}
              boundKeys="date_end"
            />
          </ColEndDatePicker>
        </Row>
      </FieldDatesMissionContainer>
    );
  }
}

export default connect<StatePropsFieldDatesMission, DispatchPropsFieldDatesMission, OwnPropsFieldDatesMission, ReduxState>(
  (state) => ({
    technicalOperationRegistryForMissionList: getSomeUniqState(state).technicalOperationRegistryForMissionList,
  }),
)(FieldDatesMission);
