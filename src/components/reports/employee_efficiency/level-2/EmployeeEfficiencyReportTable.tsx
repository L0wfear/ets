import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/DataTable/schema.h';

import DataTable from 'components/ui/table/DataTable.jsx';
const Table: any = DataTable;

const tableMeta: IDataTableSchema = {
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
      name: 'employee_name',
      displayName: 'ФИО сотрудника',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'duty_missions',
      displayName: 'Количество заданий',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'area',
      displayName: 'Обслуживаемая площадь',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'trashcans',
      displayName: 'Очищаемые урны',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
    {
      name: 'stations',
      displayName: 'Обслуживаемые остановки',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width80',
    },
  ],
};

interface IPropsEmployeeEfficiencyReportTable {
  data: object[];
  title: string;
}

const EmployeeEfficiencyReportTable: React.StatelessComponent<IPropsEmployeeEfficiencyReportTable> = props =>
  <Table
    title={props.title}
    tableMeta={tableMeta}
    results={props.data}
    renderers={{}}
    {...props}
  />;

export { EmployeeEfficiencyReportTable };
