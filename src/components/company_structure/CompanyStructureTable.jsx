import React from 'react';
import { ExtButton } from 'components/ui/new/button/ExtButton';

import Table from 'components/ui/table/DataTable';
import permissions from 'components/company_structure/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import { StyleForCompnayStructureTable } from './styled/styled';

const ButtonEditStructure = enhanceWithPermissions({
  permission: permissions.update,
})(ExtButton);

const ButtonDeletetructure = enhanceWithPermissions({
  permission: permissions.delete,
})(ExtButton);


const tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Название',
      type: 'text',
    },
    {
      name: 'type_display',
      displayName: 'Тип',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'carpool_ids',
      displayName: 'Автобаза',
      type: 'array',
      filter: {
        type: 'text',
      },
    },
    {
      name: 'note',
      displayName: 'Примечание',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'id',
      displayName: 'Действия',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
  ],
};

export default (props) => {
  const renderers = {
    id: ({ rowData }) => (
      <div>
        <ButtonEditStructure className="action-button" onClick={props.onActionEdit} boundKeys={rowData}>Редактировать</ButtonEditStructure>
        <ButtonDeletetructure className="action-button" onClick={props.onActionDelete} boundKeys={rowData}>Удалить</ButtonDeletetructure>
      </div>
    ),
    carpool_ids: ({ rowData }) => (
      <div>
        {rowData.carpool_names.join(', ')}
      </div>
    ),
  };

  return (
    <>
      <StyleForCompnayStructureTable />
      <Table
        title="Структура предприятия"
        results={props.data}
        renderers={renderers}
        tableMeta={tableMeta}
        isHierarchical
        noFilter
        enableSort={false}
        {...props}
      />
    </>
  );
};
