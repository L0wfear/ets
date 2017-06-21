import * as React from 'react';
import * as Input from 'react-bootstrap/lib/Input';
import * as R from 'ramda';

import Datepicker from 'components/ui/DatePicker';

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
  handleFirstInput: (index: number, event: React.SyntheticEvent<EventTarget>) => void;
  handleSecondInput: (index: number, event: React.SyntheticEvent<EventTarget>) => void;

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
        <Datepicker
          date={value[0]}
          onChange={this.handleFirstInput}
          time={time}
        />
        {this.props.interval &&
          <Datepicker
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
        <Input
          type="number"
          min="0"
          value={this.props.value[0]}
          onChange={this.handleFirstInput}
        />
        {this.props.interval &&
          <Input
            type="number"
            min="0"
            value={this.props.value[1]}
            onChange={this.handleSecondInput}
          />
        }
      </div>
    );
  }
  renderString() {
    return (
      <div className="inputs">
        <Input
          type="text"
          value={this.props.value[0]}
          onChange={this.handleFirstInput}
        />
        {this.props.interval &&
          <Input
            type="text"
            value={this.props.value[1]}
            onChange={this.handleSecondInput}
          />
        }
      </div>
    );
  }
  render() {
    const getInput = R.cond([
      [R.propEq('type', 'number'), () => this.renderNumber()],
      [R.either(R.propEq('type', 'datetime'), R.propEq('type', 'date')), () => this.renderDate()],
      [R.T, () => this.renderString()],
    ]);

    return getInput({ type: this.props.type });
  }
}

export default ExtendedInput;
