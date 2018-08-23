import * as React from 'react';
import * as PropTypes from 'prop-types';
import Select from 'react-select';
import { isString, isNumber } from 'lodash';

export const defaultSelectListMapper = ({ id, name }) => ({ value: id, label: name });
export const onChangeSelectLegacy = (sValue) => {
  let newValue = null;

  if (sValue) {
    if (Array.isArray(sValue)) {
      newValue = sValue.map(({ value }) => value);
    } else {
      newValue = sValue.value;
    }
  }

  return newValue;
};

const defaultSortingFunction = (a, b) => {
  if (isNumber(a.label)) {
    return a.label - b.label;
  }

  if (isString(a.label) && isString(b.label)) {
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  }

  return a.label - b.label;
};

// c обновлением до 1.2.1 появилась возможность ассинхронных опций
// @todo разобраться

export default class EstSelect extends React.Component {

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

  componentDidUpdate(prevProps) {
    if (prevProps.multi) {
      const selItems = document.querySelectorAll('.Select--multi .Select-item-label');

      for (let i = 0; i < selItems.length; i++) {
        selItems[i].setAttribute('title', selItems[i].innerHTML);
      }
    } else {
      const selItems = document.querySelectorAll('.Select-placeholder');

      for (let i = 0; i < selItems.length; i++) {
        selItems[i].setAttribute('title', selItems[i].innerHTML);
      }
    }
  }

  handleChange = (objectValue) => {
    const {
      emptyValue = '',
      selectType = false,
      fieldName,
    } = this.props;

    this.props.onChange(onChangeSelectLegacy(objectValue === '' ? emptyValue : objectValue, objectValue), objectValue);
  }
  optionRenderer = (obj) => {
    if (this.props.optionRenderer && typeof this.props.optionRenderer === 'function') {
      return <div id={obj.value}>{this.props.optionRenderer(obj)}</div>;
    }
    return <div id={obj.value}><span>{obj.label}</span></div>;
  }
  render() {
    const {
      placeholder = 'Выберите...',
      noResultsText = 'Ничего не найдено',
      options = [],
      sortingFunction = defaultSortingFunction,
      modalKey, 
    } = this.props;

    const sortedOptions = options.sort(sortingFunction);
    const id = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-value` : undefined;

    return (
      <div id={id}>
        <Select
          {...this.props}
          onChange={this.handleChange}
          options={sortedOptions}
          placeholder={placeholder}
          noResultsText={noResultsText}
          optionRenderer={this.optionRenderer}
        />
      </div>
    );
  }
}
