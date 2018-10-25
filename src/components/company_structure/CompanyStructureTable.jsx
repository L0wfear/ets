import React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import Table from 'components/ui/table/DataTable';
import permissions from 'components/company_structure/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

const ButtonEditStructure = enhanceWithPermissions({
  permission: permissions.update,
})(Button);

const ButtonDeletetructure = enhanceWithPermissions({
  permission: permissions.delete,
})(Button);


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
    id: ({ data }) => (
      <div>
        <ButtonEditStructure className="action-button" onClick={props.onActionEdit.bind(null, data)}>Редактировать</ButtonEditStructure>
        <ButtonDeletetructure className="action-button" onClick={props.onActionDelete.bind(null, data)}>Удалить</ButtonDeletetructure>
      </div>
    ),
  };

  return (
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
  );
};
