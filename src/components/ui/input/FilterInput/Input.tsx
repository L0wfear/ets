import * as React from 'react';
import { FormControl } from 'react-bootstrap';
import * as R from 'ramda';

import { IPropsDatePicker } from 'components/ui/@types/DatePicker.h';
import Datepicker from 'components/ui/input/DatePicker';

const DataPicker: React.ComponentClass<IPropsDatePicker> = Datepicker;

export interface IPropsExtendedInput {
  type: string;
  time?: boolean;
  interval?: boolean;
  value: any[];
  fieldName: string;
  filterType: string;
  filterValueMaker?(value: any[], inputType: string): any;
  onChange(value: any): void;
}

interface IStateExtendedInput {
  value: any[];
}

class ExtendedInput extends React.Component<IPropsExtendedInput, IStateExtendedInput> {
  handleFirstInput: (event: React.SyntheticEvent<EventTarget>) => void;
  handleSecondInput: (event: React.SyntheticEvent<EventTarget>) => void;

  constructor() {
    super();

    this.handleFirstInput = this.handleChange.bind(this, 0);
    this.handleSecondInput = this.handleChange.bind(this, 1);

    this.state = {
      value: [],
    };
  }
  handleChange(index, e) {
    const newValue = [...this.state.value];

    const getValue = R.cond([
      [
        R.either(R.propEq('inputType', 'date'), R.propEq('inputType', 'datetime')),
        R.pipe(R.prop('event'), R.identity),
      ],
      [R.T, R.pipe(R.prop('event'), R.path(['target', 'value']))],
    ]);

    const value = getValue({
      inputType: this.props.type,
      event: e,
    });

    newValue[index] = value;
    this.setState({ value: newValue });
    this.props.onChange(newValue);
  }
  renderDate() {
    const {
      time = this.props.type === 'datetime',
      value,
    } = this.props;

    return (
      <div className="datepickers">
        <DataPicker
          date={value[0]}
          onChange={this.handleFirstInput}
          time={time}
        />
        {this.props.interval &&
          <DataPicker
            date={value[1]}
            onChange={this.handleSecondInput}
            time={time}
          />
        }
      </div>
    );
  }
  renderNumber() {
    return (
      <div className="inputs">
        <div className="form-group">
          <FormControl
            type="number"
            min="0"
            value={this.props.value[0]}
            onChange={this.handleFirstInput}
          />
        </div>
        {this.props.interval &&
          <div className="form-group">
            <FormControl
              type="number"
              min="0"
              value={this.props.value[1]}
              onChange={this.handleSecondInput}
            />
          </div>
        }
      </div>
    );
  }
  renderString() {
    return (
      <div className="inputs">
        <div className="form-group">
          <FormControl
            type="text"
            value={this.props.value[0]}
            onChange={this.handleFirstInput}
          />
        </div>
        {this.props.interval &&
          <div className="form-group">
            <FormControl
              type="text"
              value={this.props.value[1]}
              onChange={this.handleSecondInput}
            />
          </div>
        }
      </div>
    );
  }
  render() {
    switch (this.props.type) {
      case 'number': return this.renderNumber();
      case 'date':
      case 'datetime':
        return this.renderDate();

      default: return this.renderString();
    }
  }
}

export default ExtendedInput;
