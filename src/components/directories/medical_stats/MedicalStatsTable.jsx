import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

const allowedDictionary = {
  0: 'Не допущен',
  1: 'Допущен',
};

export const tableMeta = () => ({
  cols: [
    {
      name: 'employee_name',
      displayName: 'ФИО сотрудника',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'employee_birthday',
      displayName: 'Дата рождения',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'employee_position',
      displayName: 'Должность',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'allowed',
      displayName: 'Результат мед.осмотра',
      type: 'text',
      filter: {
        type: 'select',
        options: Object.keys(allowedDictionary).map(key => ({ label: allowedDictionary[key], value: key })),
      },
    },
    {
      name: 'conclusion',
      displayName: 'Заключение о результате мед.осмотра',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'type_name',
      displayName: 'Тип мед.осмотра',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'sign_datetime',
      displayName: 'Дата и время подписи результата мед.осмотра',
      type: 'datetime',
      filter: {
        type: 'datetime',
      },
    },
  ],
});

const UserActionLogTable = (props) => {
  const renderers = {
    employee_birthday: ({ data }) => <DateFormatter date={data} />,
    allowed: ({ data }) => <span>{allowedDictionary[Number(data)]}</span>,
  };

  return (
    <Table
      title="Статистика прохождения мед. осмотров"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      rowNumberLabel="№ п/п"
      rowNumberClassName="width60"
      enumerated
      {...props}
    />
  );
};

export default UserActionLogTable;
