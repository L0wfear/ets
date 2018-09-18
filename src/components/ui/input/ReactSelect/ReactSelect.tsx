import * as React from 'react';
import * as PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import * as cx from 'classnames';

import {
  onChangeSelectLegacy,
  defaultSortingFunction,
} from 'components/ui/input/ReactSelect/utils';

require('components/ui/input/ReactSelect/ReactSelect.scss');

/**
 * @todo уйти от легаси
 */
export default class EstSelect extends React.Component<any, any> {
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
    } = this.props;

    this.props.onChange(onChangeSelectLegacy(objectValue === null ? emptyValue : objectValue), objectValue);
  }

  optionRenderer = (props) => {
    if (this.props.optionRenderer && typeof this.props.optionRenderer === 'function') {
      return <components.Option {...props} >{this.props.optionRenderer(props)}</ components.Option>;
    }
    return <components.Option {...props} />;
  }
  render() {
    const {
      placeholder = 'Выберите...',
      noResultsText = 'Ничего не найдено',
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
    const id = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-value` : undefined;

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

    return (
      <div id={id}>
        <Select
          {...props}
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
          noResultsText={noResultsText}
          components={
            {
              Option: this.optionRenderer
            }
          }
          isDisabled={disabled}
        />
      </div>
    );
  }
}
