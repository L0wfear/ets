import React, { Component, PropTypes } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday859am, getYesterday0am, getYesterday9am, getYesterday2359 } from 'utils/dates';
import { isEmpty } from 'utils/functions';

// TODO поправить на получение типов из специального сервиса
const COMBINATIONS_CAR_TYPES_ODH = [
  {
    value: '84, 85, 1',
    label: 'ДКМ (ПМ+ЖР), ДКМ (ПМ+ТР), ПМ',
  },
  {
    value: '82, 9, 14',
    label: 'ДКМ (ПУ+ПЩ), ПУ, ПУвак',
  },
  {
    value: '8',
    label: 'ТУ',
  },
];
const COMBINATIONS_CAR_TYPES_DT = [
  {
    value: '83',
    label: 'ДКМ (ПУ+ТР)',
  },
  {
    value: '85;84;1',
    label: 'ДКМ (ПМ+ТР), ДКМ (ПМ+ЖР), ПМ',
  },
  {
    value: '82;9;14',
    label: 'ДКМ (ПУ + ПЩ), ПУ, ПУ вак',
  },
  {
    value: '8',
    label: 'ТУ',
  },
];

class DailyReportHeader extends Component {

  static get propTypes() {
    return {
      handleChange: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
  }

  handleGeozoneTypeChange(v) {
    this.props.handleChange('geozone_type', v);
    if (v === 'odh') {
      this.props.handleChange('car_type_id_list', []);
      this.props.handleChange('element', 'roadway');
      this.props.handleChange('date_start', getYesterday9am());
      this.props.handleChange('date_end', getToday859am());
    } else {
      this.props.handleChange('car_type_id_list', []);
      this.props.handleChange('element', 'yard');
      this.props.handleChange('date_start', getYesterday0am());
      this.props.handleChange('date_end', getYesterday2359());
    }
  }

  handleCarTypeIdListChange(v) {
    const data = !isEmpty(v) ? v.split(',').map(d => parseInt(d, 10)) : [];
    this.props.handleChange('car_type_id_list', data);
  }

  handleCarTypeIdListChangeODHCombinations(v) {
    this.props.handleChange('car_type_id_list', (v.length ? v.split(', ') : []).map(v => parseInt(v, 10)));
  }

  handleCarTypeIdListChangeDTCombinations(v) {
    v = v.replace(/\s/g, '').replace(/,/g, ', ');
    const car_type_id_list = this.props.car_type_id_list;
    const splittedToArray = v.length ? v.split(', ') : [];
    this.props.handleChange('car_type_id_list', splittedToArray);
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getTypes();
  }

  render() {
    const props = this.props;
    const { geozone_type, typesList = [], useCombinations = false, car_type_id_list } = this.props;
    const OBJECTS = [{ value: 'odh', label: 'Объект дорожного хозяйства' }, { value: 'dt', label: 'Дворовая территория' }];
    const ELEMENTS = geozone_type === 'odh' ?
    [
        { value: 'roadway', label: 'Проезжая часть' },
        { value: 'footway', label: 'Тротуар' },
    ]
      : [{ value: 'yard', label: 'Двор' }];
    const CAR_TYPES = typesList.map(t => ({ value: t.id, label: t.full_name }));

    return (
      <Div>
        <Row>
          <Col md={3}>
            <Field type="select"
              label="Объекты"
              options={OBJECTS}
              value={props.geozone_type}
              onChange={this.handleGeozoneTypeChange.bind(this)}
              clearable={false}
            />
          </Col>
          <Col md={2}>
            <Field type="select"
              label="Элемент"
              options={ELEMENTS}
              disabled={props.geozone_type !== 'odh'}
              value={props.element}
              onChange={props.handleChange.bind(null, 'element')}
              clearable={false}
            />
          </Col>
          <Col md={4}>
            <Div><label>Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker date={props.date_start} onChange={props.handleChange.bind(null, 'date_start')} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker date={props.date_end} onChange={props.handleChange.bind(null, 'date_end')} />
            </Div>
          </Col>
          <Col md={3} className={'vehicle-types-container'}>
            {useCombinations ?
            <Field type="select"
              label="Типы ТС"
              multi={geozone_type === 'odh' ? false : true}
              options={geozone_type === 'odh' ? COMBINATIONS_CAR_TYPES_ODH : COMBINATIONS_CAR_TYPES_DT}
              value={geozone_type === 'odh' ? car_type_id_list.join(', ') : car_type_id_list}
              onChange={geozone_type === 'odh' ? this.handleCarTypeIdListChangeODHCombinations.bind(this) : this.handleCarTypeIdListChangeDTCombinations.bind(this)}
            />
            :
            <Field type="select"
              label="Типы ТС"
              multi
              options={CAR_TYPES}
              value={car_type_id_list}
              onChange={this.handleCarTypeIdListChange.bind(this)}
            />
            }
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col md={9} />
          <Col md={3}>
            <Button bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
    );
  }

}

DailyReportHeader.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(DailyReportHeader, ['objects']);
