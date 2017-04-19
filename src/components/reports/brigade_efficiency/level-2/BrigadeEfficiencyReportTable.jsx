import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'technical_operation_name',
      displayName: 'Технологическая операция',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'number',
      displayName: 'Номер наряд-задания',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'foreman_name',
      displayName: 'Бригадир',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'brigade_employee_count',
      displayName: 'Количество человек в бригаде',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'efficiency',
      displayName: 'Эффективность',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'measure_unit_name',
      displayName: 'Единица измерения',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
  ],
};

class DutyNumberLinkComponent extends Component {
  handleClick = () => {
    this.props.onClick(this.props.data);
  }
  render() {
    return (
      <div><a className="pointer" onClick={this.handleClick}>{this.props.data}</a></div>
    );
  }
}

export default (props) => {
  const renderers = {
    // rowNumber: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    // company_name: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    // func_type: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    // total_cars_count: meta => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    number: meta => <DutyNumberLinkComponent data={meta.data} onClick={props.onDutyNumberLinkClick} />,
  };

  return (
    <Table
      title="Работа бригад по ручной уборке"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      enableSort={false}
      {...props}
    />
	);
};
