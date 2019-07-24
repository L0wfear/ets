import * as React from 'react';
import * as R from 'ramda';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export interface IPropsExtendedInput {
  type: string;
  time?: boolean;
  interval?: boolean;
  value: any[];
  fieldName: string;
  filterType: string;
  filterValueMaker?(value: any[], inputType: string): any;
  onChange(value: any): void;
  lang?: string;
  id?: string | number;
  modalKey?: string;
}

interface IStateExtendedInput {
}

class ExtendedInput extends React.Component<IPropsExtendedInput, IStateExtendedInput> {
  handleChange(index, e) {
    const newValue = [...this.props.value];

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
    this.props.onChange(newValue);
  }
  handleFirstInput = (e) => this.handleChange(0, e);
  handleSecondInput = (e) => this.handleChange(1, e);

  renderDate() {
    const {
      time = this.props.type === 'datetime',
      value,
    } = this.props;
    const { modalKey, id } = this.props;
    const idValueBeg = id ? `${modalKey ? `${modalKey}-` : ''}${id}-beg-value` : undefined;
    const idValueEnd = id ? `${modalKey ? `${modalKey}-` : ''}${id}-end-value` : undefined;

    return (
      <div className="datepickers">
        <DatePicker
          id={idValueBeg}
          date={value[0]}
          onChange={this.handleFirstInput}
          time={time}
        />
        {this.props.interval &&
          <DatePicker
            id={idValueEnd}
            date={value[1]}
            onChange={this.handleSecondInput}
            time={time}
          />
        }
      </div>
    );
  }
  renderNumber() {
    const { modalKey, id } = this.props;
    const idValueBeg = id ? `${modalKey ? `${modalKey}-` : ''}${id}-beg-value` : undefined;
    const idValueEnd = id ? `${modalKey ? `${modalKey}-` : ''}${id}-end-value` : undefined;

    return (
      <div className="inputs">
        <div className="form-group">
          <EtsBootstrap.FormControl
            id={idValueBeg}
            type="number"
            min="0"
            value={this.props.value[0] || ''}
            onChange={this.handleFirstInput}
            lang={this.props.lang}
            step="any"
          />
        </div>
        {this.props.interval &&
          <div className="form-group">
            <EtsBootstrap.FormControl
              id={idValueEnd}
              type="number"
              min="0"
              value={this.props.value[1] || ''}
              onChange={this.handleSecondInput}
              lang={this.props.lang}
            />
          </div>
        }
      </div>
    );
  }
  renderString() {
    const { modalKey, id } = this.props;
    const idValueBeg = id ? `${modalKey ? `${modalKey}-` : ''}${id}-beg-value` : undefined;
    const idValueEnd = id ? `${modalKey ? `${modalKey}-` : ''}${id}-end-value` : undefined;

    return (
      <div className="inputs">
        <div className="form-group">
          <EtsBootstrap.FormControl
            id={idValueBeg}
            type="text"
            value={this.props.value[0] || ''}
            onChange={this.handleFirstInput}
          />
        </div>
        {this.props.interval &&
          <div className="form-group">
            <EtsBootstrap.FormControl
              id={idValueEnd}
              type="text"
              value={this.props.value[1] || ''}
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
