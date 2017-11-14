import * as React from 'react';
import { Col } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import { createValidDate } from 'utils/dates';

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
    style: {
      maxWidth: 100,
    },
  },
  {
    key: 'measure_unit_name',
    title: 'Ед. измерения',
    style: {
      maxWidth: 100,
    },
  },
  {
    key: 'plan',
    title: 'План',
    style: {
      maxWidth: 100,
    },
  },
  {
    key: 'fact',
    title: 'Факт',
    style: {
      maxWidth: 100,
    },
  },
  {
    key: 'warranty_up_to',
    title: 'Гарантийные обязательства до',
  },
];

class FactTab extends React.Component<any, any> {
  handleClickAddEl = () => {
    this.props.pushElement();
  }

  handleChangeTable = (numRow, field, e) => {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;

    const {
      state: {
        elements = [],
      },
      objectPropertyList = [],
    } = this.props;

    const newElements = elements.map((d, i) => {
      if (i === numRow) {
        const newLine = { ...d };

        if (field === 'object_property_id') {
          const { measure_unit_name = null, original_name = null } = objectPropertyList.find(({ id }) => id === value) || {};

          newLine.measure_unit_name = measure_unit_name;
          newLine.value = original_name;

          return {
            ...newLine,
            object_property_id: value,
          };
        }
        if (field === 'warranty_up_to') {
          newLine.warranty_up_to = createValidDate(value);
          return {
            ...newLine,
            warranty_up_to: createValidDate(value),
          };
        }
        return {
          ...newLine,
          [field]: value,
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
        fact_date_start,
        fact_date_end,
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
        disabled: true,
      },
      value: {
        disabled: true,
      },
      measure_unit_name: {
        disabled: true,
      },
      plan: {
        disabled: true,
      },
      fact: {
      },
      warranty_up_to: {
        type: 'date',
        time: false,
      },
    };

    return (
      <div>
        <Col md={12}>
          <label>Факстические даты проведения ремонта</label>
        </Col>
        <Col md={12}>
          <div style={{ display: 'flex' }}>
            <div>
              <ExtField
                type={'date'}
                date={fact_date_start}
                time={false}
                error={errors.fact_date_start}
                onChange={this.props.handleChange}
                boundKeys={['fact_date_start']}
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
                date={fact_date_end}
                time={false}
                error={errors.fact_date_end}
                onChange={this.props.handleChange}
                boundKeys={['fact_date_end']}
                disabled={!isPermitted}
              />
            </div>
          </div>
        </Col>
        <Col md={12}>
          <TablePrev
            title={'Элементы ДТ, фактически отремонтированные'}
            headerData={PlanTabTableHeader}
            bodyData={elements}
            mainPropsFields={mainPropsFields}
            handleChange={this.handleChangeTable}
            isPermitted={isPermitted}
          />
        </Col>
        <Col md={12}>
          <ExtField
            type="text"
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

export default connectToStores(FactTab, ['repair']);
