import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import { omit, uniqBy } from 'lodash';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';
import { IVehicleType } from 'api/@types/services/index.h';

import { connectToStores } from 'utils/decorators';
import { getYesterday9am, getToday859am, createValidDateTime } from 'utils/dates';
import { FluxContext } from 'utils/decorators';
import { GEOZONE_OBJECTS, GEOZONE_ELEMENTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import { ExtField } from 'components/ui/new/field/ExtField';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
  geozone_type: string;
  element_type: string;
  car_func_types_ids: any;
  typesList: Array<IVehicleType>;
}

@connectToStores(['objects'])
@FluxContext
class ReportHeader extends React.Component<IPropsReportHeader, any> {
  context!: ETSCore.LegacyContext;

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getTypes();
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
  }
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
  }
  render() {
    const {
      date_start,
      date_end,
      geozone_type,
      element_type,
      car_func_types_ids,
    } = this.getState();

    const { typesList = [], readOnly } = this.props;

    const CAR_TYPES = uniqBy(typesList, 'asuods_id')
      .map((t) => ({ value: t.asuods_id, label: t.full_name }));

    const isDtGeozone = geozone_type === 'dt';

    return (
      <>
        <Row className="report-page__header">
          <Col md={3}>
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
          </Col>
          <Col md={2}>
            <ExtField type="select"
              label="Элемент"
              options={GEOZONE_ELEMENTS[geozone_type]}
              disabled={isDtGeozone || readOnly}
              value={element_type}
              onChange={this.props.handleChange}
              boundKeys="element_type"
              clearable={false}
            />
          </Col>
          <Col md={4}>
            <label htmlFor=" ">Период формирования</label>
            <DatePickerRange
              date_start_id="date_start"
              date_start_value={date_start}
              date_end_id="date_end"
              date_end_value={date_end}

              disabled={readOnly}
              onChange={this.props.handleChange}
            />
          </Col>
          <Col md={3} className={'vehicle-types-container'}>
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
          </Col>
        </Row>
        <Row>
          <Col md={3} mdOffset={9}>
            <Button
              block
              bsSize="small"
              onClick={this.handleSubmit}
              disabled={readOnly}
            >Сформировать отчет</Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
