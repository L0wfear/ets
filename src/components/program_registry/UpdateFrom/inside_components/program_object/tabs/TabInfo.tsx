import * as React from 'react';
import { Col, Button } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import { createValidDate } from 'utils/dates';

import { OBJ_TAB_INDEX } from '../ProgramObjectFormDT.h';

import TablePrev from 'components/program_registry/UpdateFrom/inside_components/program_object/modals/Table';
import { ITableMetaInfo } from 'components/program_registry/UpdateFrom/inside_components/program_object/modals/Table.h';

import { ExtField } from 'components/ui/Field.jsx';

const TableMeta: ITableMetaInfo = [
  {
    key: 'object_property_id',
    title: 'Элеменет ДТ',
    style: (numRow, row, errors) => ({
        minWidth: 200,
        backgroundColor: errors[`element_${numRow}_object_property_id`] ? '#ff7777' : null,
      }),
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
  },
  {
    key: 'value',
    title: 'Характеристика',
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
    style: () => null,
  },
  {
    key: 'measure_unit_name',
    title: 'Ед. измерения',
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
    style: () => null,
  },
  {
    key: 'plan',
    title: 'План',
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
    style: (numRow, row, errors) => {
      return {
        backgroundColor: errors[`element_${numRow}_plan`] ? '#ff7777' : null,
      };
    },
  },
  {
    key: 'fact',
    title: 'Факт',
    style: (numRow, row, errors) => ({
      maxWidth: 100,
      backgroundColor: errors[`element_${numRow}_fact`] ? '#ff7777' : null,
    }),
    tabIncludes: [OBJ_TAB_INDEX.FACT],
  },
  {
    key: 'warranty_up_to',
    title: 'Гарантийные обязательства до',
    tabIncludes: [OBJ_TAB_INDEX.FACT],
    style: () => null,
  },
];

class PlanTab extends React.Component<any, any> {
  state = {
    selectedRow: null,
  };
  handleClickAddEl = () => {
    this.props.pushElement();
  }
  getButtons = () => {
    const {
      objectPropertyList = [],
      state: {
        elements = [],
      },
    } = this.props;

    const disabled = !this.props.isPermitted || (elements.length >= objectPropertyList.length);

    return (
      <div>
        <Button disabled={disabled} onClick={this.handleClickAddEl} >Добавить элемент</Button>
        <Button disabled={this.state.selectedRow === null} onClick={this.handleClickOnRemove} >Удалить</Button>
      </div>
    );
  }
  handleChangeTable = (numRow, field, e) => {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;

    const {
      state: {
        elements = [],
      },
      selectedObj,
      objectPropertyList = [],
    } = this.props;

    const newElements = elements.map((d, i) => {
      if (i === numRow) {
        const newLine = { ...d };

        if (field === 'object_property_id') {
          const { measure_unit_name = null, original_name = null } = objectPropertyList.find(({ id }) => id === value) || {};

          newLine.measure_unit_name = measure_unit_name;
          newLine.value = selectedObj.data[original_name];

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
  handleClickOnRemove = () => {
    const {
      selectedRow,
    } = this.state;
    const {
      state: {
        elements = [],
      },
    } = this.props;

    const newElement = elements.filter((d, i) => i !== selectedRow);
    this.props.handleChange('elements', newElement);
    this.setState({ selectedRow: null });
  }
  getFieldProps(typeTab) {
    const {
      state: {
        elements = [],
      },
      objectPropertyList = [],
    } = this.props;

    const selectedElements = elements.reduce((arr, { num, object_property_id }) => {
      if (!!object_property_id) {
        arr.push(object_property_id);
      }
      return arr;
    }, []);

    return {
      object_property_id: {
        type: 'select',
        options: objectPropertyList.map(({ id: value, name: label }) => ({ value, label, disabled: selectedElements.includes(value) })),
        disabled: typeTab === OBJ_TAB_INDEX.FACT,
      },
      value: {
        type: 'string',
        disabled: true,
      },
      measure_unit_name: {
        type: 'string',
        disabled: true,
      },
      plan: {
        type: 'string',
        disabled: typeTab === OBJ_TAB_INDEX.FACT,
      },
      fact: {
        type: 'string',
      },
      warranty_up_to: {
        type: 'date',
        time: false,
      },
    };
  }

  getDataByTypeTab: any = () => {
    const {
      whatSelectedTab,
    } = this.props;

    switch (whatSelectedTab) {
      case OBJ_TAB_INDEX.PLAN: return {
        label: 'Плановые даты проведения ремонта',
        date_from: 'plan_date_start',
        date_to: 'plan_date_end',
        titleTable: 'Элементы ДТ, запланированные к ремонту',
        buttons: this.getButtons(),
        tableMeta: TableMeta.filter(({ tabIncludes }) => tabIncludes.includes(OBJ_TAB_INDEX.PLAN)),
        fieldProps: this.getFieldProps((OBJ_TAB_INDEX.PLAN)),
      };
      case OBJ_TAB_INDEX.FACT: return {
        label: 'Фактические даты проведения ромента',
        date_from: 'fact_date_start',
        date_to: 'fact_date_end',
        titleTable: 'Элементы ДТ, фактически отремонтированные',
        buttons: null,
        tableMeta: TableMeta.filter(({ tabIncludes }) => tabIncludes.includes(OBJ_TAB_INDEX.FACT)),
        fieldProps: this.getFieldProps((OBJ_TAB_INDEX.FACT)),
      };
      default: return {
        label: null,
        date_from: null,
        date_to: null,
        titleTable: null,
        buttons: null,
        tableMeta: [],
        fieldProps: {},
      };
    }
  }

  handleRowClick = index => {
    this.setState({ selectedRow: index - 1 });
  }

  render() {
    const { selectedRow } = this.state;
    const {
      isPermitted,
      state,
      state: {
        note,
        elements = [],
      },
      errors,
    } = this.props;

    const {
      label,
      date_from,
      date_to,
      titleTable,
      buttons,
      tableMeta,
      fieldProps,
    } = this.getDataByTypeTab();

    return (
      <div>
        <Col md={12}>
          <label>{label}</label>
        </Col>
        <Col md={12}>
          <Col md={5}>
            <div className="no-label">
              <ExtField
                type={'date'}
                date={state[date_from]}
                time={false}
                error={errors[date_from]}
                onChange={this.props.handleChange}
                boundKeys={[date_from]}
                disabled={!isPermitted}
              />
            </div>
          </Col>
          <Col md={2}>
            <div style={{
              width: '100%',
              textAlign: 'center',
              marginTop: 5,
            }}>—</div>
          </Col>
          <Col md={5}>
            <div className="no-label">
              <ExtField
                type={'date'}
                date={state[date_to]}
                time={false}
                error={errors[date_to]}
                onChange={this.props.handleChange}
                boundKeys={[date_to]}
                disabled={!isPermitted}
              />
            </div>
          </Col>
        </Col>
        <Col md={12}>
          <TablePrev
            title={titleTable}
            headerData={tableMeta}
            buttons={buttons}
            bodyData={elements}
            selectedRow={selectedRow}
            mainPropsFields={fieldProps}
            handleChange={this.handleChangeTable}
            handleRowClick={this.handleRowClick}
            isPermitted={isPermitted}
            errors={errors}
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
            disabled={!isPermitted}
          />
        </Col>
      </div>
    );
  }
}

export default connectToStores(PlanTab, ['repair']);
