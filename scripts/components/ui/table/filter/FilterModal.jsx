import React from 'react';
import ReactDom from 'react-dom';
import { Modal, Input, Label, Container, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Div from '../../Div.jsx';
import Datepicker from '../../DatePicker.jsx';
import IntervalPicker from '../../IntervalPicker.jsx';
import { isEmpty } from 'utils/functions';
import EtsSelect from '../../EtsSelect.jsx';

import _ from 'lodash';
import cx from 'classnames';

const FilterSelect = (props) => {
  return <EtsSelect type="filter-select"
                placeholder="Выберите..."
                searchingText="Поиск..."
                noResultsText="Ничего не найдено"
                clearAllText="Очистить"
                addLabelText='Добавить "{label}"?'
                {...props}/>;
};

const Filter = (props) => {
  const { option } = props;
  const value = props.filterValues[option.name];
  let input;

  switch (option.name) {
    case 'date_create':
      input = <Datepicker date={value} onChange={props.onChange} time={false} />;
      break;
    default:
      input = <Input type="text" value={value} onChange={props.onChange}/>;
      break;
  }

  if (option.filter && option.filter.type && option.filter.type === 'select' && !option.filter.options) {
    let options = _(props.tableData)
                    .uniq((d) => d[option.name])
                    .map((d) => ({
                      value: d[option.name] === true || d[option.name] === false ? +d[option.name] : d[option.name],
                      label: typeof option.filter.labelFunction === 'function' ? option.filter.labelFunction(d[option.name]) : d[option.name],
                    }))
                    .value();
    if (option.name === "operation_id") {
      options = options.sort((a,b) => a.label.localeCompare(b.label));
    }
    input = <FilterSelect options={options} value={value} onChange={props.onChange} />
  }
  if (option.filter && option.filter.type && option.filter.type === 'multiselect' && option.filter.options) {
    input = (
      <Div className="filter-multiselect-container">
        <FilterSelect options={option.filter.options} multi={true} value={value} onChange={props.onMultiChange} />
      </Div>
    );
  }
  if (option.filter && option.filter.type && option.filter.type === 'date_create' && !option.filter.options) {
    input = <div><Datepicker className="filter-datepicker" date={value} onChange={props.onChange} time={false} /></div>;
  }
  if (option.filter && option.filter.type && option.filter.type === 'date_interval' && !option.filter.options) {
    input = <IntervalPicker interval={value} onChange={props.onChange} />;
  }

  return (
    <Div>
      <label>{option.caption}</label>
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

  handleFilterValueChange(key, e) {
    const filterValues = Object.assign({}, this.state.filterValues);

    filterValues[key] = !!e.target ? e.target.value : e;

    this.setState({filterValues});
  }

  handleFilterMultipleValueChange(key, v) {
    const filterValues = Object.assign({}, this.state.filterValues);
    let data = !isEmpty(v) ? v.split(',') : [];

    filterValues[key] = data;
    if (data.length === 0) {
      delete filterValues[key];
    }

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

    const { options } = this.props;

    const filterRows = options.map( (option, i) => {
      return <Row key={i}>
              <Col md={12}>
                <Filter {...this.props} option={option}
                                        filterValues={this.state.filterValues}
                                        onChange={this.handleFilterValueChange.bind(this, option.name)}
                                        onMultiChange={this.handleFilterMultipleValueChange.bind(this, option.name)}/>
              </Col>
             </Row>
    });
    const className = cx({'left': this.props.direction !== 'right', 'right': this.props.direction === 'right'}, 'filter-container');

    return (
      <Div className={className} hidden={!this.props.show}>
        <Div className="filter-container-window">
          <Modal.Body>
            {filterRows}
          </Modal.Body>
        </Div>

        <Div className="filter-footer">
          <Button onClick={this.submit.bind(this)}>Применить</Button>
          <Button onClick={this.reset.bind(this)}>Сброс</Button>
        </Div>
      </Div>
    );

  }

}

export default FilterModal;
