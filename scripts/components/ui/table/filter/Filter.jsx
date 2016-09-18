import React, { PropTypes } from 'react';
import { Input, Button, Glyphicon, Collapse } from 'react-bootstrap';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';
import Div from '../../Div.jsx';
import Datepicker from '../../DatePicker.jsx';
import IntervalPicker from '../../IntervalPicker.jsx';
import EtsSelect from '../../EtsSelect.jsx';

const FilterSelect = (props) => {
  return (<EtsSelect
    type="filter-select"
    searchingText="Поиск..."
    clearAllText="Очистить"
    addLabelText='Добавить "{label}"?'
    {...props}
  />);
};

class FilterRow extends React.Component {

  static get propTypes() {
    return {
      value: PropTypes.any,
      type: PropTypes.string,
      labelFunction: PropTypes.func,
      availableOptions: PropTypes.array,
      tableData: PropTypes.array,
    };
  }

  static get defaultProps() {
    return {
      labelFunction: v => v,
      tableData: [],
    };
  }

  render() {
    const props = this.props;

    const { value, name, displayName, type, labelFunction,
      availableOptions, onChange, onMultiChange, tableData } = props;
    let input = <Input type="text" value={value} onChange={onChange} />;

    if (type) {
      if (type === 'select' || type === 'multiselect') {
        let options = availableOptions || _(tableData)
                        .uniqBy(name)
                        .map(d => ({
                          value: typeof d[name] === 'boolean' ? +d[name] : d[name],
                          label: labelFunction(d[name]),
                        }))
                        .value();
        if (type === 'select') {
          if (name === 'operation_id') {
            options = options.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
          }
          input = <FilterSelect options={options} value={value} onChange={onChange} />;
        } else if (type === 'multiselect') {
          input = (
            <Div className="filter-multiselect-container">
              <FilterSelect options={options} multi value={value} onChange={onMultiChange} />
            </Div>
          );
        }
      }
      if (type === 'date') {
        input = <Datepicker className="filter-datepicker" date={value} onChange={onChange} time={false} />;
      }
      if (type === 'date_interval') {
        input = <IntervalPicker interval={value} onChange={onChange} />;
      }
    }

    return (
      <Div className="filter-row">
        <label>{displayName}</label>
        {input}
      </Div>
    );
  }
}

export default class Filter extends React.Component {

  static get propTypes() {
    return {
      values: PropTypes.object,
      show: PropTypes.bool,
      tableData: PropTypes.array,
      onHide: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      filterValues: props.values || {},
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ filterValues: props.values });
  }

  handleFilterValueChange(key, e) {
    const filterValues = { ...this.state.filterValues };

    filterValues[key] = e.target ? e.target.value : e;

    this.setState({ filterValues });
  }

  handleFilterMultipleValueChange(key, v) {
    const filterValues = { ...this.state.filterValues };
    const data = !isEmpty(v) ? v.split(',') : [];

    filterValues[key] = data;
    if (data.length === 0) {
      delete filterValues[key];
    }

    this.setState({ filterValues });
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
  }

  reset() {
    this.props.onSubmit({});
  }

  render() {
    const { filterValues } = this.state;
    const { tableData, options } = this.props;

    const filterRows = options.map((option, i) => {
      const { filter = {}, name, displayName } = option;
      const { type, labelFunction, options } = filter;
      return (
        <FilterRow
          tableData={tableData}
          key={i}
          value={filterValues[name]}
          type={type}
          name={name}
          labelFunction={labelFunction}
          availableOptions={options}
          displayName={displayName}
          onChange={this.handleFilterValueChange.bind(this, name)}
          onMultiChange={this.handleFilterMultipleValueChange.bind(this, name)}
        />
      );
    });

    return (
      <Collapse in={this.props.show}>
        <Div className="filter-container">
          <Div className="filter-buttons">
            <Button onClick={this.submit.bind(this)}>Применить</Button>
            <Button onClick={this.reset.bind(this)}>Сброс</Button>
            <span className="filter-close" onClick={this.props.onHide}><Glyphicon glyph="remove" /></span>
          </Div>
          {filterRows}
        </Div>
      </Collapse>
    );
  }

}
