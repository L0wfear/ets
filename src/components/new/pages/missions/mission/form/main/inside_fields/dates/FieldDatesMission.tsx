import * as React from 'react';
import { connect } from 'react-redux';
import ExtField from 'components/@next/@ui/renderFields/Field';
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
  ExtFieldDateStartWrap,
  FieldDatesMissionContainer,
} from './styled';
import { addTime, getDateWithMoscowTzByTimestamp, createValidDateTime, diffDates } from 'components/@next/@utils/dates/dates';
import { routeTypesByTitle } from 'constants/route';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';

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
      date,
    } = await this.props.dispatch(
      actionLoadTimeMoscow(
        {},
        {
          page: this.props.page,
          path: this.props.path,
        },
      ),
    );

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
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <FieldLabel>Время выполнения:</FieldLabel>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
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
            <EtsBootstrap.Dropdown
              id="date-end-dropdown"
              disabled={
                !isPermitted
                || !date_start
                || this.props.disabled
              }
              title="Продолжительность задания, ч"
              toggleElement={<EtsBootstrap.Glyphicon id="select-date_end" glyph="time" />}
              toggleElementSize="input"
            >
              <EtsBootstrap.DropdownMenu>
                <EtsBootstrap.MenuItem eventKey={1} onSelect={this.handleChangeHoursDateEnd}>1</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={2} onSelect={this.handleChangeHoursDateEnd}>2</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={3} onSelect={this.handleChangeHoursDateEnd}>3</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={4} onSelect={this.handleChangeHoursDateEnd}>4</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem eventKey={5} onSelect={this.handleChangeHoursDateEnd}>5</EtsBootstrap.MenuItem>
              </EtsBootstrap.DropdownMenu>
            </EtsBootstrap.Dropdown>
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
        </EtsBootstrap.Row>
      </FieldDatesMissionContainer>
    );
  }
}

export default connect<StatePropsFieldDatesMission, DispatchPropsFieldDatesMission, OwnPropsFieldDatesMission, ReduxState>(
  (state) => ({
    technicalOperationRegistryForMissionList: getSomeUniqState(state).technicalOperationRegistryForMissionList,
  }),
)(FieldDatesMission);
