import * as React from 'react';
import { get } from 'lodash';

import DatePicker from 'components/old/ui/input/date-picker/DatePicker';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export type IPropsExtendedInput = {
  type: string;
  time?: boolean;
  interval?: boolean;
  value: Array<any>;
  fieldName: string;
  filterType: string;
  filterValueMaker?(value: Array<any>, inputType: string): any;
  onChange(value: any): void;
  lang?: string;
  id?: string | number;
  modalKey?: string;
};

type IStateExtendedInput = {
};

class ExtendedInput extends React.Component<IPropsExtendedInput, IStateExtendedInput> {
  handleChange(index, event) {
    const newValue = [...this.props.value];

    const value = get(event, 'target.value', event);

    newValue[index] = value;
    this.props.onChange(newValue);
  }
  handleFirstInput = (e) => this.handleChange(0, e);
  handleSecondInput = (e) => this.handleChange(1, e);

  renderDate() {
    const {
      value,
    } = this.props;
    const { modalKey, id } = this.props;
    const idValueBeg = id ? `${modalKey ? `${modalKey}-` : ''}${id}-beg-value` : undefined;
    const idValueEnd = id ? `${modalKey ? `${modalKey}-` : ''}${id}-end-value` : undefined;
    const time = this.props.time ?? Boolean(this.props.type === 'datetime' || this.props.type === 'advanced-datetime');

    return (
      <div>
        <DatePicker
          id={idValueBeg}
          date={value[0]}
          onChange={this.handleFirstInput}
          time={time}
        />
        {this.props.interval
          && <DatePicker
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
        {this.props.interval
          && <div className="form-group">
            <EtsBootstrap.FormControl
              id={idValueEnd}
              type="number"
              min="0"
              value={this.props.value[1] || ''}
              onChange={this.handleSecondInput}
              lang={this.props.lang}
              step="any"
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
        {this.props.interval
          && <div className="form-group">
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
      case 'advanced-date':
      case 'advanced-datetime':
        return this.renderDate();
      default: return this.renderString();
    }
  }
}

export default ExtendedInput;
