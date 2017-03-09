import React, { Component, PropTypes } from 'react';
import Input from 'react-bootstrap/lib/Input';
import { createValidDateTime } from '../../utils/dates';
import EtsSelect from './EtsSelect';
import Datepicker from './DatePicker';

const TYPES = [
  { value: '=', label: '=' },
  { value: 'lt', label: '<' },
  { value: 'gt', label: '>' },
  { value: '<>', label: '≠' },
  { value: '><', label: '><' },
];

export default class AdvancedInput extends Component {

  static propTypes = {
    name: PropTypes.string,
    filterValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
    date: PropTypes.bool,
    time: PropTypes.bool,
  }

  state = {
    type: '=',
    value: null,
  }

  componentWillReceiveProps(props) {
    if (!props.filterValue) this.setState({ value: null });
  }

  handleTypeChange(v) {
    this.setState({ type: v, value: null });
    const filterValue = '';
    this.props.onChange(filterValue);
  }

  handleChange(v, index = 0) {
    const { name, date } = this.props;
    let { filterValue } = this.props;
    const { type } = this.state;
    let { value } = this.state;
    if (v === null || v === '' || v === undefined) {
      filterValue = null;
      return this.props.onChange(filterValue);
    }
    switch (type) {
      case '><': {
        if (!Array.isArray(value)) value = date ? [new Date(), new Date()] : ['', ''];
        value[index] = v;
        if (typeof filterValue !== 'object') {
          filterValue = {
            [`${name}__gte`]: new Date(),
            [`${name}__lte`]: new Date(),
          };
        }
        filterValue = { ...filterValue, [`${name}__${index === 0 ? 'gte' : 'lte'}`]: v };
        break;
      }
      case '<>': {
        v.setHours(0, 0, 0, 0);
        value = v;
        filterValue = {
          [`${name}__lt`]: v,
          [`${name}__gte`]: new Date(v.getTime() + (60 * 60 * 24 * 1000)),
        };
        break;
      }
      case 'lt': {
        value = v;
        filterValue = { [`${name}__lt`]: v };
        break;
      }
      case 'gt': {
        value = v;
        filterValue = { [`${name}__gt`]: v };
        break;
      }
      default: {
        v.setHours(0, 0, 0, 0);
        value = v;
        filterValue = {
          [`${name}__gte`]: v,
          [`${name}__lt`]: new Date(v.getTime() + (60 * 60 * 24 * 1000)),
        };
        break;
      }
    }
    this.setState({ value });
    if (date && filterValue) {
      Object.keys(filterValue).forEach((k) => {
        filterValue[k] = createValidDateTime(filterValue[k]);
      });
    }
    return this.props.onChange(filterValue);
  }

  render() {
    const { type, value } = this.state;
    const { date } = this.props;
    const time = type !== '=' && type !== '<>';
    return (
      <div className="advanced-string-input">
        <EtsSelect
          sortingFunction={() => {}}
          options={TYPES}
          value={type}
          clearable={false}
          onChange={v => this.handleTypeChange(v)}
        />
        {!date ? <div className="inputs">
          <Input type="number" min="0" value={type === '><' && value ? value[0] : value} onChange={e => this.handleChange(e.target.value, 0)} />
          {type === '><' && <Input type="number" min="0" value={value ? value[1] : value} onChange={e => this.handleChange(e.target.value, 1)} />}
        </div> : <div className="datepickers">
          <Datepicker date={type === '><' && value ? value[0] : value} onChange={v => this.handleChange(v, 0)} time={time} />
          {type === '><' && <Datepicker date={type === '><' && value ? value[1] : value} onChange={v => this.handleChange(v, 1)} time={time} />}
        </div>}
      </div>
    );
  }
}
