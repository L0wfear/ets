import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input } from 'react-bootstrap';
import _ from 'lodash';
import EtsSelect from '../../EtsSelect.jsx';
import Div from '../../Div.jsx';
import Datepicker from '../../DatePicker.jsx';
import IntervalPicker from '../../IntervalPicker.jsx';

@autobind
export default class FilterRow extends React.Component {

  static get propTypes() {
    return {
      value: PropTypes.any,
      type: PropTypes.string,
      labelFunction: PropTypes.func,
      availableOptions: PropTypes.array,
      tableData: PropTypes.array,
      name: PropTypes.string,
      displayName: PropTypes.string,
      onChange: PropTypes.func,
      onMultiChange: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      labelFunction: v => v,
      tableData: [],
    };
  }

  render() {
    const { value, name, displayName, type, labelFunction,
      availableOptions, onChange, onMultiChange, tableData } = this.props;
    let input = <Input type="text" value={value} onChange={onChange} />;

    if (type) {
      if (type === 'select' || type === 'multiselect') {
        let options = availableOptions || _(tableData)
                        .uniqBy(name)
                        .map(d => ({
                          value: typeof d[name] === 'boolean' ? +d[name] : d[name],
                          label: labelFunction(d[name]),
                        }))
                        .filter(d => d.label !== null)
                        .value();
        if (type === 'select') {
          if (name === 'operation_id') {
            options = options.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
          }
          input = <EtsSelect options={options} value={value} onChange={onChange} />;
        } else if (type === 'multiselect') {
          input = (
            <Div className="filter-multiselect-container">
              <EtsSelect options={options} multi delimiter={'$'} value={value} onChange={onMultiChange} />
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
        <label htmlFor="input">{displayName}</label>
        {input}
      </Div>
    );
  }
}
