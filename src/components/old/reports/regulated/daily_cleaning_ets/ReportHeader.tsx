import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { omit, uniqBy } from 'lodash';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getYesterday9am, getToday859am, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { GEOZONE_ELEMENTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import ExtField from 'components/@next/@ui/renderFields/Field';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { carFuncTypesGetAndSetInStore } from 'redux-main/reducers/modules/autobase/car_func_types/actions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';

type StateProps = {
  carFuncTypesList: IStateAutobase['carFuncTypesList'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type IPropsReportHeader = {
  date_start: string;
  date_end: string;
  geozone_type: string;
  element_type: string;
  car_func_types_ids: any;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper & StateProps & DispatchProps;

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  componentDidMount() {
    this.props.dispatch(
      carFuncTypesGetAndSetInStore(
        {},
        {
          page: 'mainpage',
        },
      ),
    );
  }
  getState() {
    const {
      date_start = getYesterday9am(),
      date_end = getToday859am(),
      geozone_type = 'odh',
      element_type = 'roadway',
      car_func_types_ids = '',
    } = this.props;

    return {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_ids,
    };
  }
  handleGeoObjectChange = (field, value) => {
    const isDtGeozone = value === 'dt';

    if (isDtGeozone) {
      this.props.handleChange('element_type', 'yard');
    } else {
      this.props.handleChange('element_type', 'roadway');
    }

    this.props.handleChange('geozone_type', value);
  };
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_ids,
    } = this.getState();

    const carIdsArray = typeof car_func_types_ids === 'string' ? [car_func_types_ids] : car_func_types_ids;

    const requestBody = {
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      geozone_type,
      element_type,
      car_func_types_ids: `[${[...carIdsArray].join(',')}]`,
    };

    this.props.onClick(car_func_types_ids !== ''
      ? requestBody
      : omit(requestBody, 'car_func_types_ids'),
    );
  };
  render() {
    const {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_ids,
    } = this.getState();

    const { carFuncTypesList, readOnly } = this.props;

    const CAR_TYPES = uniqBy(carFuncTypesList, 'asuods_id')
      .map((t) => ({ value: t.asuods_id, label: t.full_name }));

    const GEOZONE_OBJECTS = [
      { value: 'odh', label: 'Объект дорожного хозяйства' },
      { value: 'dt', label: 'Дворовая территория' },
    ];

    const isDtGeozone = geozone_type === 'dt';

    return (
      <>
        <EtsBootstrap.Row className="report-page__header">
          <EtsBootstrap.Col md={3}>
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
            <ExtField type="select"
              label="Элемент"
              options={GEOZONE_ELEMENTS[geozone_type]}
              disabled={isDtGeozone || readOnly}
              value={element_type}
              onChange={this.props.handleChange}
              boundKeys="element_type"
              clearable={false}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={4}>
            <FieldLabel>
              Период формирования
            </FieldLabel>
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
              value={car_func_types_ids}
              onChange={this.props.handleChange}
              boundKeys="car_func_types_ids"
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
            >Сформировать отчет</EtsBootstrap.Button>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </>
    );
  }
}

export default compose(
  ReportHeaderWrapper,
  connect<StateProps, DispatchProps, any, ReduxState>(
    (state) => ({
      carFuncTypesList: getAutobaseState(state).carFuncTypesList,
    }),
  ),
)(ReportHeader);
