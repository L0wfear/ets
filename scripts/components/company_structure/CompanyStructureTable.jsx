import React from 'react';
import { Button } from 'react-bootstrap';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
  cols: [
    {
      name: 'name',
      displayName: 'Название',
      type: 'string',
    },
    {
      name: 'type_display',
      displayName: 'Тип',
      type: 'string',
      filter: {
        type: 'select',
      }
    },
    {
      name: 'note',
      displayName: 'Примечание',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'id',
      displayName: 'Действия',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
  ]
};

export default (props) => {
	const renderers = {
		id: ({data}) => {
			return (
				<div>
					<Button className="action-button" onClick={props.onActionEdit.bind(null, data)}>Редактировать</Button>
					<Button className="action-button" onClick={props.onActionDelete.bind(null, data)}>Удалить</Button>
				</div>
			);
		}
  };

	return <Table title="Структура предприятия"
								results={props.data}
								renderers={renderers}
								tableMeta={tableMeta}
								isHierarchical={true}
								{...props}/>;
}
