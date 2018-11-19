import * as React from 'react';
import * as PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import * as cx from 'classnames';
import { get } from 'lodash';

import {
  onChangeSelectLegacy,
  defaultSortingFunction,
} from 'components/ui/input/ReactSelect/utils';

require('components/ui/input/ReactSelect/ReactSelect.scss');

/**
 * @todo уйти от легаси
 */
export default class ReactSelect extends React.Component<any, any> {
  static defaultProps = {
    legacy: true,
    clearable: true,
  }

  static get propTypes() {
    return {
      placeholder: PropTypes.string,
      noResultsText: PropTypes.string,
      options: PropTypes.array,
      sortingFunction: PropTypes.func,
      emptyValue: PropTypes.string,
      onChange: PropTypes.func,
      fieldName: PropTypes.string,
      selectType: PropTypes.string,
    };
  }

  handleChange = (objectValue) => {
    const {
      emptyValue = '',
      multi,
    } = this.props;

    this.props.onChange(
      onChangeSelectLegacy(
        objectValue === null ? emptyValue : objectValue,
        multi,
      ),
      objectValue,
    );
  }

  optionRenderer = ({ innerProps, ...props }) => {
    const newInnerProps = {
      ...innerProps,
      id: innerProps.id.replace(/option-\d+$/, `value-${props.value}`),
    };

    if (this.props.optionRenderer && typeof this.props.optionRenderer === 'function') {
      return <components.Option innerProps={newInnerProps} {...props} >{this.props.optionRenderer(props)}</ components.Option>;
    }
    return <components.Option innerProps={newInnerProps} {...props} />;
  }

  noOptionsMessage = () => this.props.noResultsText || 'Нет данных';
  filterOption = (option, filterValue: string) => {
    const label = get(option, 'label', '').toString() || '';

    return label.toLocaleLowerCase().includes(
      filterValue.toLocaleLowerCase()
    );
  }
  singleValueRender = ({ innerProps, ...props }) => {
    const {
      modalKey,
    } = this.props;
    
    const id = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-value` : undefined;

    const newInnerProps = {
      ...innerProps,
      id,
    };

    return <components.SingleValue innerProps={newInnerProps} {...props} />;
  }
  render() {
    const {
      placeholder = 'Выберите...',
      options = [],
      sortingFunction = defaultSortingFunction,
      className,
      modalKey,
      disabled,
      clearable,
      legacy,
      multi,
      ...props
    } = this.props;

    const sortedOptions = options.sort(sortingFunction);
    const instanceId = modalKey ? `${modalKey}-${this.props.id}` : this.props.id;

    let value = props.value;

    if (legacy) {
      value = value !== null && value !== undefined ?
          multi ?
              sortedOptions.filter(({ value: op_value }) => value.includes(op_value))
            :
              sortedOptions.find(({ value: op_value }) => op_value === value)
        :
          null;
    }

    const id = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-container` : undefined;

    return (
      <Select
        {...props}
        id={id}
        filterOption={this.filterOption}
        instanceId={instanceId}
        isClearable={clearable}
        isMulti={multi}
        value={value}
        className={cx(
          'react-select',
          className,
        )}
        classNamePrefix="react-select"
        onChange={this.handleChange}
        options={sortedOptions}
        placeholder={placeholder}
        noOptionsMessage={this.noOptionsMessage}
        components={
          {
            Option: this.optionRenderer,
            SingleValue: this.singleValueRender,
          }
        }
        isDisabled={disabled}
      />
    );
  }
}
