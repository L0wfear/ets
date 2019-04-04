import React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import { onClickWithKeys } from 'components/compositions/hoc';
import DateFormatter from 'components/ui/DateFormatter';
import Table from 'components/ui/table/DataTable';
import { makeSchema, sortSchemaCols } from 'components/ui/table/utils';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import tirePermissions from 'components/new/pages/nsi/autobase/pages/tire/_config-data/permissions';

const CloneButton = withRequirePermissionsNew({
  permissions: tirePermissions.create,
})(onClickWithKeys(Button));

export const tableMeta = ({ schemaMakers = {} } = {}) => {
  const schema = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Организация',
        type: 'text',
        orderNum: -1,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'tire_model_name',
        displayName: 'Модель шины',
        type: 'string',
        orderNum: 0,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'tire_size_name',
        displayName: 'Размер',
        type: 'string',
        orderNum: 2,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'odometr_diff',
        displayName: 'Пробег, км',
        type: 'string',
        orderNum: 3,
        filter: {
          type: 'string',
        },
      },
      {
        name: 'motohours_diff',
        displayName: 'Наработка, мч',
        type: 'string',
        orderNum: 4,
        filter: {
          type: 'string',
        },
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        orderNum: 5,
        filter: {
          type: 'string',
        },
      },
      {
        name: 'gov_number',
        displayName: 'Рег. номер ТС',
        type: 'string',
        orderNum: 6,
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'installed_at',
        displayName: 'Дата монтажа',
        type: 'date',
        orderNum: 7,
        filter: {
          type: 'date',
        },
      },
      {
        name: 'cloneButton',
        displayName: '',
        orderNum: 8,
        filter: false,
      },
    ],
  };

  return makeSchema(schema, schemaMakers);
};

export default (props) => {
  const renderers = {
    installed_at: ({ data }) => <DateFormatter date={data} />,
    cloneButton: ({ rowData }) => (
      <CloneButton onClick={props.onCloneClick} boundKeys={rowData.id}>
        Создать копированием
      </CloneButton>
    ),
  };

  const meta = tableMeta(props);
  const sortedMeta = sortSchemaCols(meta);

  return (
    <Table
      title="Реестр шин"
      results={props.data}
      tableMeta={sortedMeta}
      renderers={renderers}
      initialSort={props.selectField}
      {...props}
    />
  );
};
