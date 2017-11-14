import * as React from 'react';
import { Col, Button } from 'react-bootstrap';
import connectToStores from 'flummox/connect';

import TablePrev from './TablePrev';

import { ExtField } from 'components/ui/Field.jsx';

const PlanTabTableHeader = [
  {
    key: 'object_property_id',
    title: 'Элеменеn ДТ',
    style: {
      minWidth: 200,
    },
  },
  {
    key: 'value',
    title: 'Характеристика',
  },
  {
    key: 'measure_unit_name',
    title: 'Ед. измерения',
  },
  {
    key: 'plan',
    title: 'План',
  },
];

class PlanTab extends React.Component<any, any> {
  handleClickAddEl = () => {
    this.props.pushElement();
  }
  getButtons = () => {
    return (
      <div>
        <Button onClick={this.handleClickAddEl} >Добавить элемент</Button>
      </div>
    );
  }
  handleChangeTable = (numRow, field, value) => {
    const {
      state: {
        elements = [],
      },
      objectPropertyList = [],
    } = this.props;

    let newValueOfF = value;

    if (typeof value === 'object') {
      const {
        target: {
          value: eValue,
        },
      } = value;

      newValueOfF = eValue;
    }

    const newElements = elements.map((d, i) => {
      if (i === numRow) {
        const newLine = { ...d };

        if (field === 'object_property_id') {
          const { measure_unit_name = null } = objectPropertyList.find(({ id }) => id === newValueOfF) || {};

          newLine.measure_unit_name = measure_unit_name;
        }
        return {
          ...newLine,
          [field]: newValueOfF,
        };
      }
      return { ...d };
    });

    this.props.handleChange('elements', newElements);
  }

  render() {
    const {
      isPermitted,
      state: {
        plan_date_start,
        plan_date_end,
        note,
        elements = [],
      },
      objectPropertyList = [],
      errors,
    } = this.props;

    const mainPropsFields = {
      object_property_id: {
        type: 'select',
        options: objectPropertyList.map(({ id: value, name: label }) => ({ value, label })),
      },
      value: {
      },
      measure_unit_name: {
        readOnly: true,
      },
      plan: {

      },
    };

    return (
      <div>
        <Col md={12}>
          <label>Плановые даты проведения ремонта</label>
        </Col>
        <Col md={12}>
          <div style={{ display: 'flex' }}>
            <div>
              <ExtField
                type={'date'}
                date={plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.props.handleChange}
                boundKeys={['plan_date_start']}
                disabled={!isPermitted}
              />
            </div>
            <div style={{
              width: 40,
              textAlign: 'center',
              marginTop: 5,
            }}>—</div>
            <div>
              <ExtField
                type={'date'}
                date={plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.props.handleChange}
                boundKeys={['plan_date_end']}
                disabled={false}
              />
            </div>
          </div>
        </Col>
        <Col md={12}>
          <TablePrev
            title={'Элементы ДТ, запланированные к ремонту'}
            headerData={PlanTabTableHeader}
            buttons={this.getButtons()}
            bodyData={elements}
            mainPropsFields={mainPropsFields}
            handleChange={this.handleChangeTable}
          />
        </Col>
        <Col md={12}>
          <ExtField
            type="string"
            value={note}
            label={"Примечание"}
            error={errors.name}
            onChange={this.props.handleChange}
            boundKeys={['note']}
            disabled={false}
          />
        </Col>
      </div>
    );
  }
}

export default connectToStores(PlanTab, ['repair']);
