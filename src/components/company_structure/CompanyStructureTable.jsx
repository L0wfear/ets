import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import Table from 'components/ui/table/DataTable.jsx';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

const Button = enhanceWithPermissions(BootstrapButton);

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
    id: ({ data }) => {
      return (
        <div>
          <Button className="action-button" permissions={[`${props.entity}.update`]} onClick={props.onActionEdit.bind(null, data)}>Редактировать</Button>
          <Button className="action-button" permissions={[`${props.entity}.delete`]} onClick={props.onActionDelete.bind(null, data)}>Удалить</Button>
        </div>
      );
    },
  };

  return (
    <Table
      title="Структура предприятия"
      results={props.data}
      renderers={renderers}
      tableMeta={tableMeta}
      isHierarchical
      noFilter
      {...props}
    />
  );
};
