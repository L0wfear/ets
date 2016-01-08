import React from 'react';
import { Modal, Input, Label, Container, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from '../Div.jsx';
import Datepicker from '../DatePicker.jsx';

const Filter = (props) => {
  const value = props.filterValues[props.col];
  const input = props.col === 'ID' ? <Input type="number" value={value} onChange={props.onChange}/> :
  <Datepicker date={value} onChange={props.onChange}/>;
  return (
    <Div>
      <label>{props.caption}</label>
      {input}
    </Div>
  )
};

class FilterModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filterValues: {},
    };
  }

  componentDidMount() {
    this.setState({filterValues: this.props.values});
  }

  componentWillReceiveProps(props) {
    this.setState({filterValues: props.values});
  }

  handleFilterValueChange(col, e) {
    const filterValues = Object.assign({}, this.state.filterValues);
    filterValues[col] = !!e.target ? e.target.value : e;

    this.setState({filterValues});
  }

  submit() {
    const filterValues = _.reduce(this.state.filterValues, (cur, v, k) => {
      if (typeof v !== 'undefined') {
        if (typeof v === 'string') {
          if (v.length > 0) {
            cur[k] = v;
          }
        } else {
          cur[k] = v;
        }
      }
      return cur;
    }, {});

    this.props.onSubmit(filterValues);
    this.props.onHide();
  }

  reset() {
    this.props.onSubmit({});
    this.props.onHide();
  }

  render() {

    const filterRows = this.props.cols.map( (col, i) => {

      if (col !== 'ID' && col !== 'DATE_CREATE') return null;

      return <Row key={i}>
              <Col md={12}>
                <Filter {...this.props} caption={this.props.captions[i]} col={col} filterValues={this.state.filterValues} onChange={this.handleFilterValueChange.bind(this, col)} />
              </Col>
             </Row>

    });

    return (
      <Div className="filter-container" hidden={!this.props.show}>

        <Modal.Body>
          {filterRows}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.submit.bind(this)}>Применить</Button>
	      	<Button onClick={this.reset.bind(this)}>Сброс</Button>
	      </Modal.Footer>
      </Div>
    );

    return (
      <Modal {...this.props}
              bsSize="small">

				<Modal.Header closeButton>
	          <Modal.Title id="contained-modal-title-lg">Фильтр</Modal.Title>
				</Modal.Header>

	      <Modal.Body>
  	      {filterRows}
	      </Modal.Body>

	      <Modal.Footer>
          <Button onClick={this.submit.bind(this)}>Сохранить</Button>
	      	<Button onClick={this.props.onHide}>Закрыть</Button>
	      </Modal.Footer>

			</Modal>
    )
  }

}

export default FilterModal;
