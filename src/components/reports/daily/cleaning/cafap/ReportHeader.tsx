import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { omit, get } from 'lodash';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';
import { IAppConfig } from 'api/@types/services.h';

import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import FieldComponent from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
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

    const carIdsArray = typeof car_func_types_groups === 'string' ? [car_func_types_groups] : car_func_types_groups;

    const requestBody = {
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      geozone_type,
      element_type,
      car_func_types_groups: `[${[...carIdsArray.map(item => `"${item}"`)].join(',')}]`,
    };

    this.props.onClick(car_func_types_groups !== ''
      ? requestBody
      : omit(requestBody, 'car_func_types_groups'),
    );
  }
  render() {
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
            />
          </Col>
          <Col md={2}>
            <Field type="select"
              label="Элемент"
              options={GEOZONE_ELEMENTS[geozone_type]}
              disabled={isDtGeozone}
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
              />
            </Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date_end}
                onChange={this.props.handleChange}
                bindOnChange={'date_end'}
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
            />
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col md={9} />
          <Col md={3}>
            <Button bsSize="small" onClick={this.handleSubmit}>Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
