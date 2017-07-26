import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { get } from 'lodash';
import * as R from 'ramda';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';
import { IAppConfig } from 'api/@types/services/index.h';

import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import FieldComponent from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/input/DatePicker';
import { getYesterday9am, getToday859am, createValidDateTime } from 'utils/dates';
import { bindable, FluxContext } from 'utils/decorators';
import { getCurrentSeason } from 'utils/dates';
import { GEOZONE_OBJECTS, GEOZONE_ELEMENTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePicker: any = bindable(Datepicker);
const Field: any = bindable(FieldComponent);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
  geozone_type: string;
  element_type: string;
  car_func_types_groups: any;
  appConfig: IAppConfig;
}

@connectToStores(['objects'])
@FluxContext
class ReportHeader extends React.Component<IPropsReportHeader, any> {
  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getConfig();
  }
  getState() {
    const {
      date_start = getYesterday9am(),
      date_end = getToday859am(),
      geozone_type = 'odh',
      element_type = 'roadway',
      car_func_types_groups = '',
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
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_groups,
    } = this.getState();

    const getRequestBody = R.cond([
      [R.complement(R.propEq('carTypeGroups', '')),
      ({ state, carTypeGroups }) => {
        const carTypeStrings = carTypeGroups
          .split(',')
          .map(item => `"${item}"`)
          .join(',');

        return {
          ...state,
          car_func_types_groups: `[${carTypeStrings}]`,
        };
      }],
      [R.T, R.identity(R.prop('state'))],
    ]);

    const initialState = {
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      geozone_type,
      element_type,
    };

    const requestBody = getRequestBody({
      state: initialState,
      carTypeGroups: car_func_types_groups,
    });

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


    const season = getCurrentSeason(this.props.appConfig.summer_start, this.props.appConfig.summer_end);
    const carTypes = get(this.props.tableMeta.car_func_types, [geozone_type, season]);

    const CAR_TYPES = carTypes
      ? Object.keys(carTypes).map(t => ({ value: `${t}`, label: carTypes[t] }))
      : [];

    const isDtGeozone = geozone_type === 'dt';

    return (
      <Div>
        <Row>
          <Col md={3}>
            <Field type="select"
              label="Объекты"
              options={GEOZONE_OBJECTS}
              value={geozone_type}
              onChange={this.handleGeoObjectChange}
              bindOnChange={'geozone_type'}
              clearable={false}
              disabled={readOnly}
            />
          </Col>
          <Col md={2}>
            <Field type="select"
              label="Элемент"
              options={GEOZONE_ELEMENTS[geozone_type]}
              disabled={isDtGeozone || readOnly}
              value={element_type}
              onChange={this.props.handleChange}
              bindOnChange={'element_type'}
              clearable={false}
            />
          </Col>
          <Col md={4}>
            <Div><label>Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date_start}
                onChange={this.props.handleChange}
                bindOnChange={'date_start'}
                disabled={readOnly}
              />
            </Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date_end}
                onChange={this.props.handleChange}
                bindOnChange={'date_end'}
                disabled={readOnly}
              />
            </Div>
          </Col>
          <Col md={3} className={'vehicle-types-container'}>
            <Field type="select"
              label="Типы ТС"
              multi
              options={CAR_TYPES}
              value={car_func_types_groups}
              onChange={this.props.handleChange}
              bindOnChange={'car_func_types_groups'}
              disabled={readOnly}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col md={9} />
          <Col md={3}>
            <Button
              bsSize="small"
              onClick={this.handleSubmit}
              disabled={readOnly}
            >Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
