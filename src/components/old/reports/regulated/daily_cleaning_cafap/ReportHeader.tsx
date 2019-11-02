import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { get } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getYesterday9am, getToday859am, createValidDateTime } from 'components/@next/@utils/dates/dates';

import { getCurrentSeason } from 'components/@next/@utils/dates/dates';
import { GEOZONE_OBJECTS, GEOZONE_ELEMENTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';

import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import ExtField from 'components/@next/@ui/renderFields/Field';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
  geozone_type: string;
  element_type: string;
  car_func_types_groups: any;
  appConfig: InitialStateSession['appConfig'];
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      date_start = getYesterday9am(),
      date_end = getToday859am(),
      geozone_type = 'odh',
      element_type = 'roadway',
      car_func_types_groups = ['pm', 'pu'],
    } = this.props;

    return {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_groups,
    };
  }
  handleGeoObjectChange = (field, value) => {
    const isDtGeozone = value === 'dt';

    if (isDtGeozone) {
      this.props.handleChange('element_type', 'yard');
      this.props.handleChange('car_func_types_groups', 'all');
    } else {
      this.props.handleChange('element_type', 'roadway');
      this.props.handleChange('car_func_types_groups', undefined);
    }

    this.props.handleChange('geozone_type', value);
  }
  handleChangeElement = (field, value) => {
    const { element_type } = this.props;

    if (value === 'roadway' && value !== element_type) {
      this.props.handleChange('car_func_types_groups', 'pm,pu');
    }

    this.props.handleChange(field, value);
  }
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_groups,
    } = this.getState();

    const initialState = {
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      geozone_type,
      element_type,
    };

    const requestBody: Record<string, any> = {
      ...initialState,
    };

    requestBody.car_func_types_groups = `[${
      car_func_types_groups.map((item) => `"${item}"`).join(',')
    }]`;

    this.props.onClick(requestBody);
  }
  render() {
    const { readOnly } = this.props;
    const {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_groups,
    } = this.getState();

    const season = getCurrentSeason(this.props.appConfig.summer_start_date, this.props.appConfig.summer_end_date);
    const carTypes = get(this.props.tableMeta.car_func_types, [geozone_type, season], {});
    const CAR_TYPES =  Object.keys(carTypes).reduce((newArr, t) => {
      if (element_type !== 'roadway' || t !== 'tu') {
        newArr.push({ value: `${t}`, label: carTypes[t] });
      }

      return newArr;
    }, []);

    const isDtGeozone = geozone_type === 'dt';

    return (
      <>
        <EtsBootstrap.Row className="report-page__header">
          <EtsBootstrap.Col md={2}>
            <ExtField
              type="select"
              label="Объекты"
              options={GEOZONE_OBJECTS}
              value={geozone_type}
              onChange={this.handleGeoObjectChange}
              boundKeys="geozone_type"
              clearable={false}
              disabled={readOnly}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={2}>
            <ExtField
              type="select"
              label="Элемент"
              options={GEOZONE_ELEMENTS[geozone_type]}
              disabled={isDtGeozone || readOnly}
              value={element_type}
              onChange={this.props.handleChange}
              boundKeys="element_type"
              clearable={false}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={5}>
            <label htmlFor=" ">Период формирования</label>
            <DatePickerRange
              date_start_id="date_start"
              date_start_value={date_start}
              date_end_id="date_end"
              date_end_value={date_end}

              disabled={readOnly}
              onChange={this.props.handleChange}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3} className={'vehicle-types-container'}>
            <ExtField
              type="select"
              label="Типы ТС"
              multi
              options={CAR_TYPES}
              value={car_func_types_groups}
              onChange={this.props.handleChange}
              boundKeys="car_func_types_groups"
              disabled={readOnly}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={3} mdOffset={9}>
            <EtsBootstrap.Button
              block
              bsSize="small"
              onClick={this.handleSubmit}
              disabled={readOnly}
            >Сформировать отчетsss</EtsBootstrap.Button>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </>
    );
  }
}

export default compose<any, any>(
  connect<any, any, any, ReduxState>(
    (state) => ({
      appConfig: getSessionState(state).appConfig,
    }),
  ),
  ReportHeaderWrapper,
)(ReportHeader);
