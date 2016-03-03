import React from 'react';
import ReactDom from 'react-dom';
import { Modal, Input, Label, Container, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from '../../Div.jsx';
import Datepicker from '../../DatePicker.jsx';
import Select from 'react-select';

import _ from 'lodash';
import cx from 'classnames';

const FilterSelect = (props) => {
  return <Select {...props}
                 placeholder="Выберите..."
                 searchingText="Поиск..."
                 noResultsText="Ничего не найдено"
                 clearAllText="Очистить"
                 addLabelText='Добавить "{label}"?'/>
};

const Filter = (props) => {
  const value = props.filterValues[props.col];
  const columnMeta = _.find(props.tableMeta.cols, col => col.name === props.col) || {};
  let input;

  switch (props.col) {
    case 'ID':
      input = <Input type="number" value={value} onChange={props.onChange}/>;
      break;
    case 'date_create':
      input = <Datepicker date={value} onChange={props.onChange} time={false} />;
      break;
    case 'id':
      input = <FilterSelect options={props.options} value={value} onChange={props.onChange} />
      break;
    default:
      input = <Input type="text" value={value} onChange={props.onChange}/>;
      break;
  }

  if (columnMeta.filter && columnMeta.filter.type && columnMeta.filter.type === 'select') {
    const options = _(props.tableData)
                    .uniq((d) => d[props.col])
                    .map((d) => ({
                      value: d[props.col] === true || d[props.col] === false ? +d[props.col] : d[props.col],
                      label: typeof columnMeta.filter.labelFunction === 'function' ? columnMeta.filter.labelFunction(d[props.col]) : d[props.col],
                    }))
                    .value();
    input = <FilterSelect options={options} value={value} onChange={props.onChange} />
  }


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

    const { tableMeta } = this.props;

    const filterRows = tableMeta.cols.map( (col, i) => {
      return <Row key={i}>
              <Col md={12}>
                <Filter {...this.props} caption={col.caption} col={col.name} filterValues={this.state.filterValues} onChange={this.handleFilterValueChange.bind(this, col.name)} />
              </Col>
             </Row>
    });
    const className = cx({'left': this.props.direction !== 'right', 'right': this.props.direction === 'right'}, 'filter-container');

    return (
      <Div className={className} hidden={!this.props.show}>

        <Modal.Body>
          {filterRows}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.submit.bind(this)}>Применить</Button>
	      	<Button onClick={this.reset.bind(this)}>Сброс</Button>
	      </Modal.Footer>

      </Div>
    );

  }

}

export default FilterModal;
