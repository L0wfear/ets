import React, {Component} from 'react';
import { Row, Col, Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import Div from '../ui/Div.jsx';
import EtsSelect from '../ui/EtsSelect.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import Field from '../ui/Field.jsx';
import _ from 'lodash';
import cx from 'classnames';
import connectToStores from 'flummox/connect';

class ODHReports extends Component {

	static contextTypes = {
		flux: React.PropTypes.object,
	}

	constructor(props) {
		super(props);

		this.state = {
			showForm: false,
		};
	}

	deleteRoute() {
		if (confirm('Вы уверены, что хотите удалить выбранный маршрут?')) {
			const { flux } = this.context;
			flux.getActions('routes').removeRoute(this.state.selectedRoute);
			this.setState({selectedRoute: null});
		}
	}

	editRoute(route) {
		this.setState({
			selectedRoute: route
		});
	}

	handleChange(selectedRoute) {
		//this.setState({selectedRoute});
	}

	onFormHide() {
		this.setState({
			showForm: false,
			selectedRoute: null,
		})
	}

	componentDidMount() {
		const { flux } = this.context;
		//flux.getActions('objects').getODHReports();
	}

	render() {
    const { typesList = [] } = this.props;
    const TYPES = typesList.map( ({id, title}) => ({label: title, value: id}));

		return (
      <div className="ets-page-wrap">
  			<div className="some-header">
  				<div className="waybills-buttons">
  				</div>
  			</div>

        <Row>
          <Col md={12}>

            <div className="panel panel-default">
              <div className="panel-heading">Генерация отчетов</div>
              <div className="panel-body odh-generation">
                <Row>
                  <Col md={4}>
                    <label>Период</label>
                    <Row>
                      <Col md={6}>
                        <Datepicker date={new Date()} onChange={this.handleChange.bind(this, 'date_start')}/>
                      </Col>
                        <Col md={6}>
                          <Datepicker date={new Date()} onChange={this.handleChange.bind(this, 'date_start')}/>
                        </Col>
                    </Row>
                  </Col>
                  <Col md={2}>
                    <Field type="select" label="Типы ТС"
      										 options={TYPES}
      										 value={null}
      										 onChange={this.handleChange.bind(this, 'responsible_person_id')}/>
                  </Col>
                  <Col md={2}>
                    <Field type="string" label="Норма, ПМ"
      										 value={null}
      										 onChange={this.handleChange.bind(this, 'responsible_person_id')}/>
                  </Col>
                  <Col md={2}>
                    <Field type="string" label="ТУ"
      										 value={null}
      										 onChange={this.handleChange.bind(this, 'responsible_person_id')}/>
                  </Col>
                  <Col md={2}>
                    <Button bsStyle="primary">Запустить</Button>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">Фильтры</div>
              <div className="panel-body odh-filters">
                <Row>
                  <Col md={4}>
                    <label>Период</label>
                    <Row>
                      <Col md={6}>
                        <Datepicker date={new Date()} onChange={this.handleChange.bind(this, 'date_start')}/>
                      </Col>
                        <Col md={6}>
                          <Datepicker date={new Date()} onChange={this.handleChange.bind(this, 'date_start')}/>
                        </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <ButtonToolbar>
                    <Button bsStyle="primary">Применить</Button>
                    <Button bsStyle="default">Очистить</Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </div>
            </div>

          </Col>
        </Row>

  		</div>
    )
	}
}

export default connectToStores(ODHReports, ['objects']);
