import React, {Component} from 'react';
import { Modal, Input, Label, Row, Col, FormControls, Button } from 'react-bootstrap';
import Select from 'react-select';
import Datepicker from './ui/DatePicker.jsx';
import { getMasters, getDrivers, getFIOById } from './../stores/EmployeesStore.js';
import ROUTES from '../../mocks/routes.js';


const MASTERS = getMasters();
const DRIVERS = getDrivers();
const FUEL_TYPES = [
{
	id:1,
	label: 'Бензин',
	value: 1
},
{
	id:2,
	label: 'Д/т',
	value: 2
}]


let EtsSelect = (props) => <Select {...props} placeholder="Выберите..."/>;

let MastersSelect = (props) => {

	//let renderOption = (option) => <span>{option['Имя']}</span>

	return 	<EtsSelect 
			options={MASTERS} 
			clearable={true} 
			searchable={true} 
			{...props}
			//optionRenderer={renderOption}
			/>

};

let DriversSelect = (props) => {
	return <EtsSelect
		options={DRIVERS}
		clearable={true}
		searchable={true}
			{...props}/>
}

let DriversSelectByCode = (props) => {

	let renderOption = (v) => <span>{v['Табельный номер']}</span>
	let renderValue = (v) => v['Табельный номер'];

	return <Select
		options={DRIVERS}
		clearable={true}
		optionRenderer={renderOption}
		valueRenderer={renderValue}
		searchable={true}
		onChange={(v,a)=>console.log('driver selected', v,a)}/>
}

let CarSelect = () => {

	return <Select
		options={DRIVERS}
		clearable={true}
		//optionRenderer={renderOption}
		//valueRenderer={renderValue}
		searchable={true}
		onChange={(v,a)=>console.log('car selected', v,a)}/>
}

export default class WaybillForm extends Component {

	handleChange(field, e) {
		this.props.handleFormStateChange( field, e);
	}

  handleSubmit(){

    console.log('submitting waybill form', this.props.formState);
    this.props.onSubmit(this.props.formState)
  }

  handlePrint(){
  	console.log('printing bill', this.props.formState);
  }

	render () {

		let fState = this.props.formState;
		let IS_NEW = fState.status === null;
		let IS_CLOSING = fState.status;
		let IS_CLOSED = !fState.status;

		console.log( 'formstate is', fState);

		return <Modal {...this.props} bsSize="large">
			<Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Путевой лист № {fState.number}</Modal.Title>
			</Modal.Header>

      <Modal.Body>

      <Row>
      	<Col md={6}>
      		{/*Организация: АвД Жилищник "Крылатское" <br/>*/}
      	</Col>
      </Row>
       <Row>
      	<Col md={6}>
      		<label>Ответственное лицо</label><br/>
      		{ IS_NEW ? 
      		<MastersSelect disabled={!!fState.status} value={fState.master_id} onChange={this.handleChange.bind(this, 'master_id')}/>
      		:
      		getFIOById(fState.master_id, true)
      		}
      	</Col>
       	{ IS_NEW && 
       		<Col md={3}>
	       		<label>Выезд план</label>
		   			<Datepicker date={ fState.vyezd_plan } onChange={this.handleChange.bind(this, 'vyezd_plan')}/>
	       	</Col> }
	       { IS_NEW && 
	       	<Col md={3}>
		   			<label>Возвращение план</label>
		   			<Datepicker date={ fState.vozvr_plan } onChange={this.handleChange.bind(this, 'vozvr_plan')}/>
	       	</Col>
	       }
	       { IS_CLOSING &&
		       	<Col md={3}>
		       		<label>Выезд факт</label>
			   			<Datepicker date={ fState.vyezd_fakt } onChange={this.handleChange.bind(this, 'vyezd_fakt')}/>
		       	</Col>}
		      { IS_CLOSING &&
		      	<Col md={3}>
			   			<label>Возвращение факт</label>
			   			<Datepicker date={ fState.vozvr_fakt } onChange={this.handleChange.bind(this, 'vozvr_fakt')}/>
		       	</Col>
		       }
       </Row>

      	<Row>	
      	{ IS_NEW ? 
      		<Col md={6}>
      			<label>Водитель (возможен поиск по табельному номеру)</label><br/>
      				<DriversSelect value={fState.driver_id} onChange={this.handleChange.bind(this, 'driver_id')}/>
      		</Col>
      		: 
      		<Col md={6}>
    				<label>Водитель</label><br/>
    				{getFIOById(fState.driver_id, true)}
  				</Col> 
      		}
      		<Col md={6}>
      			<label>Транспортное средство (поиск по госномеру)</label>
      			<CarSelect/>
      		</Col>
      	</Row>
      	{/*<Select.Async multi={false} value={this.props.master}*/}

        <h4>Задание</h4>
      	<Row>
      	<Col md={4}>
      		<label>Маршрут</label>
      		<EtsSelect options={ROUTES} value={fState.route_id} onChange={this.handleChange.bind(this, 'route_id')}/>
    		</Col>	
    		<Col md={4}>
    			<label>Вид работ</label>
    			<EtsSelect/>
    		</Col>
    		<Col md={4}>
    		  <label>Количество прохождений</label>
    		  <Input type="number" disabled={IS_CLOSING} value={fState.ezdok} onChange={this.handleChange.bind(this, 'ezdok')}/>
    		</Col>
      	</Row>

      	<Row>
      		<Col md={4}>
      		<h4>Одометр</h4>
      		<label>Начало, км</label>
      		<Input type="number" disabled={IS_CLOSING}  onChange={this.handleChange.bind(this, 'odometr_nachalo')} value={fState.odometr_nachalo}/>
          { IS_CLOSING &&
            <div>
          		<label>Конец, км</label>
          		<Input type="number" value={fState.odometr_konec} onChange={this.handleChange.bind(this, 'odometr_konec')} disabled={IS_NEW}/>
          		<label>Пробег, км</label>
          		<Input type="number" value={fState.odometr_probeg} disabled/>
            </div>
          }
      		</Col>
      		<Col md={4}>
      		<h4>Счетчик моточасов</h4>
      		<label>Начало, м/ч</label>
      		<Input type="number"  disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'motoch_nachalo')} value={fState.motoch_nachalo}/>
          { IS_CLOSING &&
            <div>
      		<label>Конец, м/ч</label>
      		<Input type="number" value={fState.motoch_konec} onChange={this.handleChange.bind(this, 'motoch_konec')} disabled={IS_NEW}/>
      		<label>Пробег, м/ч</label>
      		<Input type="number" value={fState.motoch_probeg} disabled/>
          </div>}
      		</Col>
      		<Col md={4}>
      		<h4>Счетчик моточасов обор-ния</h4>
      		<label>Начало, м/ч</label>
      		<Input type="number" value={fState.motoch_obor_nachalo}  onChange={this.handleChange.bind(this, 'motoch_obor_nachalo')}disabled={IS_CLOSING}/>
          { IS_CLOSING &&
            <div>
      		<label>Конец, м/ч</label>
      		<Input type="number" value={fState.motoch_obor_konec}  onChange={this.handleChange.bind(this, 'motoch_obor_konec')} disabled={IS_NEW}/>
      		<label>Пробег, м/ч</label>
      		<Input type="number" value={fState.motoch_obor_probeg} disabled/>
          </div>}
      		</Col>
      	</Row>
      	<Row>
      		<Col md={4}>
      		<h4> Топливо </h4>
      		<label>Тип топлива</label>
      		<EtsSelect options={FUEL_TYPES} value={fState.fuel_type} onChange={this.handleChange.bind(this, 'fuel_type')}/>
      		<label>Начало, л</label>
      		<Input type="number" value={fState.fuel_nachalo} disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'fuel_nachalo')}/>
      		<label>Выдать, л</label>
      		<Input type="number" value={fState.fuel_vydat}  disabled={IS_CLOSING} onChange={this.handleChange.bind(this, 'fuel_vydat')}/>
          { IS_CLOSING &&
            <div>
          <label>Выдано, л</label>
          <Input type="number" value={fState.fuel_vydano}  onChange={this.handleChange.bind(this, 'fuel_vydano')} disabled={IS_NEW}/>
      		<label>Конец, л</label>
      		<Input type="number" value={fState.fuel_konec}  onChange={this.handleChange.bind(this, 'fuel_konec')} disabled={IS_NEW}/>
          </div>}
      		</Col>
      		<Col md={4}>
      		</Col>
      		<Col md={4}>
      		</Col>
      	</Row>
      </Modal.Body>	
      <Modal.Footer>
      	<Button onClick={this.handlePrint.bind(this)}>Распечатать</Button>
      	<Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
      </Modal.Footer>
		</Modal>
	}
}