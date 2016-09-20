import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Button, Glyphicon, Collapse } from 'react-bootstrap';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';
import Div from '../../Div.jsx';
import FilterRow from './FilterRow.jsx';

// const FilterSelect = (props) => {
//   return (<EtsSelect
//     type="filter-select"
//     searchingText="Поиск..."
//     clearAllText="Очистить"
//     addLabelText='Добавить "{label}"?'
//     {...props}
//   />);
// };

@autobind
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
          onChange={(...args) => this.handleFilterValueChange(name, ...args)}
          onMultiChange={(...args) => this.handleFilterMultipleValueChange(name, ...args)}
        />
      );
    });

    return (
      <Collapse in={this.props.show}>
        <Div className="filter-container">
          <Div className="filter-buttons">
            <Button onClick={this.submit}>Применить</Button>
            <Button onClick={this.reset}>Сброс</Button>
            <span className="filter-close" onClick={this.props.onHide}><Glyphicon glyph="remove" /></span>
          </Div>
          {filterRows}
        </Div>
      </Collapse>
    );
  }

}
