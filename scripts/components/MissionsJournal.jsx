import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from './ui/table/DataTable.jsx';
import MissionFormWrap from './MissionFormWrap.jsx';
import moment from 'moment';
import cx from 'classnames';

let getTechOperationById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getTechOperationById(id);
};

let getMissionSourceById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const missionsStore = flux.getStore('missions');
  return missionsStore.getMissionSourceById(id);
};


function getStatusLabel(s) {
	switch (s) {
		case 'draft':
			return 'Черновик';
		case 'active':
			return 'Активен';
		case 'closed':
			return 'Закрыт';
		default:
			return 'Н/Д';
	}
}

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
      {
        name: 'number',
        caption: 'Номер',
        type: 'number',
        filter: {
  				type: 'select'
  			}
      },
      {
				name: 'mission_source_id',
				caption: 'Источник',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getMissionSourceById(id).name || id,
				}
			},
			// {
			// 	name: 'date_create',
			// 	caption: 'Дата выдачи',
			// 	type: 'date',
			// 	filter: {
			// 		type: 'select',
			// 	}
			// }
      {
				name: 'name',
				caption: 'Название',
				type: 'string',
				// filter: {
				// 	type: 'select'
				// }
			},
      {
				name: 'description',
				caption: 'Описание',
				type: 'string',
				// filter: {
				// 	type: 'select'
				// }
			},
      {
				name: 'passes_count',
				caption: 'Количество проходов',
				type: 'number',
				filter: {
					type: 'select'
				}
			},
      {
				name: 'technical_operation_id',
				caption: 'Технологическая операция',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getTechOperationById(id).name || id,
				}
			},
		]
	};

	return tableMeta;

};


let MissionsTable = (props) => {

		const renderers = {
			technical_operation_id: ({data}) => <div>{getTechOperationById(data).name || data}</div>,
      mission_source_id: ({data}) => <div>{getMissionSourceById(data).name || data}</div>,
		};

		return <Table title="Журнал заданий"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									{...props}/>
}

class MissionsJournal extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedMission: null,
		};
	}

	selectMission({props}) {
		const id = props.data.id;
		let mission = _.find(this.props.missionsList, m => m.id === id);

		this.setState({ selectedMission: mission });
	}

	createMission() {
		this.setState({
			showForm: true,
			selectedMission: null
		})
	}

	onFormHide() {
		this.setState({
			showForm: false,
			selectedMission: null,
		})
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('missions').getMissions();
    flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTechOperations();
    flux.getActions('objects').getRoutes();
    flux.getActions('missions').getMissionSources();
	}

	removeMission() {
		if (confirm('Вы уверены, что хотите удалить задание?')) {
			const { flux } = this.context;
			flux.getActions('missions').removeMission(this.state.selectedMission.id);
		}
	}

	showMission() {
		this.setState({ showForm: true });
	}

	render() {

		const { missionsList = [] } = this.props;

		let showCloseBtn = this.state.selectedMission !== null && this.state.selectedMission.status !== 'active';

		return (
			<div className="ets-page-wrap">
				<MissionsTable data={missionsList} onRowSelected={this.selectMission.bind(this)} selected={this.state.selectedMission} selectField={'id'} {...this.props}>
					<Button bsSize="small" onClick={this.createMission.bind(this)}><Glyphicon glyph="plus" /> Создать задание</Button>
					<Button bsSize="small" onClick={this.showMission.bind(this)} disabled={this.state.selectedMission === null}><Glyphicon glyph="search" /> Просмотреть задание</Button>
					<Button bsSize="small" disabled={this.state.selectedMission === null} onClick={this.removeMission.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</MissionsTable>
				<MissionFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 mission={this.state.selectedMission}
												 {...this.props}/>
			</div>
		);
	}
}

MissionsJournal.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionsJournal, ['missions', 'objects', 'employees']);
