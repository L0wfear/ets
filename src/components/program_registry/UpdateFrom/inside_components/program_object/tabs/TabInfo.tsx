import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import connectToStores from 'flummox/connect';
import { createValidDate } from 'utils/dates';

import { OBJ_TAB_INDEX } from 'components/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormDT.h';

import Table from 'components/program_registry/UpdateFrom/inside_components/program_object/utils/Table';
import { ITableMetaInfo } from 'components/program_registry/UpdateFrom/inside_components/program_object/utils/Table.h';

import { ExtField } from 'components/ui/new/field/ExtField';

const nullFunc = () => null;

const TableMeta: ITableMetaInfo = [
  {
    key: 'object_property_id',
    title: 'Элемент ДТ',
    style: (numRow, row, errors) => ({
        minWidth: 200,
      }),
    otherProps: (numRow, row, errors) => ({
      className: errors[`element_${numRow}_object_property_id`] ? 'has-error' : null,
    }),
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
  },
  {
    key: 'value',
    title: 'Характеристика',
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
    style: nullFunc,
    otherProps: nullFunc,
  },
  {
    key: 'measure_unit_name',
    title: 'Ед. измерения',
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
    style: nullFunc,
    otherProps: nullFunc,
  },
  {
    key: 'plan',
    title: 'План',
    tabIncludes: [OBJ_TAB_INDEX.FACT, OBJ_TAB_INDEX.PLAN],
    style: nullFunc,
    otherProps: (numRow, row, errors) => ({
      className: errors[`element_${numRow}_plan`] ? 'has-error' : null,
    }),
  },
  {
    key: 'fact',
    title: 'Факт',
    style: (numRow, row, errors) => ({
      maxWidth: 100,
    }),
    otherProps: (numRow, row, errors) => ({
      className: errors[`element_${numRow}_fact`] ? 'has-error' : null,
    }),
    tabIncludes: [OBJ_TAB_INDEX.FACT],
  },
  {
    key: 'warranty_up_to',
    title: 'Гарантийные обязательства до',
    tabIncludes: [OBJ_TAB_INDEX.FACT],
    style: nullFunc,
    otherProps: nullFunc,
  },
];

const Buttons: React.FC<any> = (props) => {
  const {
    objectPropertyList = [],
    state: {
      elements = [],
    },
    isPermitted,
    selectedRow = null,
  } = props;

  const disabled = !isPermitted || (elements.length >= objectPropertyList.length);

  return (
    <div>
      <EtsBootstrap.Button disabled={disabled} onClick={props.handleClickAddEl} >Добавить элемент</EtsBootstrap.Button>
      <EtsBootstrap.Button disabled={selectedRow === null} onClick={props.handleClickOnRemove} >Удалить</EtsBootstrap.Button>
    </div>
  );
};

const getFieldProps = (props) => {
  const {
    typeTab,
    state: {
      elements = [],
    },
    objectPropertyList = [],
  } = props;

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
};

class PlanTab extends React.Component<any, any> {
  state = {
    selectedRow: null,
  };

  handleChangeTable = (numRow, field, e) => {
    const valueNew = e !== undefined && e !== null && !!e.target ? e.target.value : e;

    const newElements = this.props.state.elements.map((d, i) => {
      if (i !== numRow) {
        return { ...d };
      }
      const newLine = { ...d };

      if (field === 'object_property_id') {
        const { measure_unit_name = null, original_name = null } = this.props.objectPropertyList.find(({ id }) => id === valueNew) || {};

        newLine.measure_unit_name = measure_unit_name;
        newLine.value = this.props.selectedObj.data[original_name];
        newLine.object_property_id = valueNew;

        return { ...newLine };
      }
      if (field === 'warranty_up_to') {
        newLine.warranty_up_to = createValidDate(valueNew);
        return { ...newLine };
      }

      return {
        ...newLine,
        [field]: valueNew,
      };
    });

    this.props.handleChange('elements', newElements);
  }

  handleClickAddEl = () => {
    this.props.pushElement();
  }
  handleClickOnRemove = () => {
    const newElement = this.props.state.elements.filter((d, i) => i !== this.state.selectedRow);

    this.props.handleChange('elements', newElement);
    this.setState({ selectedRow: null });
  }
  handleRowClick = (index) => {
    this.setState({ selectedRow: index - 1 });
  }

  getDataByTypeTab: any = () => {
    const {
      whatSelectedTab,
      state,
      objectPropertyList,
      isPermitted,
    } = this.props;
    const { selectedRow } = this.state;

    switch (whatSelectedTab) {
      case OBJ_TAB_INDEX.PLAN: return {
        label: 'Плановые даты проведения ремонта',
        date_from: 'plan_date_start',
        date_to: 'plan_date_end',
        titleTable: 'Элементы ДТ, запланированные к ремонту',
        buttons: (
          <Buttons
            state={state}
            objectPropertyList={objectPropertyList}
            isPermitted={isPermitted}
            selectedRow={selectedRow}
            handleClickAddEl={this.handleClickAddEl}
            handleClickOnRemove={this.handleClickOnRemove}
          />
        ),
        tableMeta: TableMeta.filter(({ tabIncludes }) => tabIncludes.includes(OBJ_TAB_INDEX.PLAN)),
        fieldProps: getFieldProps({ state, objectPropertyList, typeTab: OBJ_TAB_INDEX.PLAN }),
      };
      case OBJ_TAB_INDEX.FACT: return {
        label: 'Фактические даты проведения ромента',
        date_from: 'fact_date_start',
        date_to: 'fact_date_end',
        titleTable: 'Элементы ДТ, фактически отремонтированные',
        buttons: null,
        tableMeta: TableMeta.filter(({ tabIncludes }) => tabIncludes.includes(OBJ_TAB_INDEX.FACT)),
        fieldProps: getFieldProps({ state, objectPropertyList, typeTab: OBJ_TAB_INDEX.PLAN }),
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
        <EtsBootstrap.Col md={12}>
          <label>{label}</label>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={12}>
          <div style={{ display: 'flex', alignItems: 'baseline', textAlign: 'center' }}>
            <div className="no-label" style={{ width: 'calc(50% - 20px)' }}>
              <ExtField
                type={'date'}
                date={state[date_from]}
                time={false}
                error={errors[date_from]}
                onChange={this.props.handleChange}
                boundKeys={date_from}
                disabled={!isPermitted}
              />
            </div>
            <div style={{ width: 40 }}>—</div>
            <div className="no-label" style={{ width: 'calc(50% - 20px)' }}>
              <ExtField
                type={'date'}
                date={state[date_to]}
                time={false}
                error={errors[date_to]}
                onChange={this.props.handleChange}
                boundKeys={date_to}
                disabled={!isPermitted}
              />
            </div>
          </div>
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={12}>
          <Table
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
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={12}>
          <ExtField
            type="text"
            value={note}
            label={'Примечание'}
            error={errors.name}
            onChange={this.props.handleChange}
            boundKeys="note"
            disabled={!isPermitted}
          />
        </EtsBootstrap.Col>
      </div>
    );
  }
}

export default connectToStores(PlanTab, ['repair']);
