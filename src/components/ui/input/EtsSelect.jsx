import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { isString, isNumber } from 'lodash';

export const defaultSelectListMapper = ({ id, name }) => ({ value: id, label: name });

const defaultSortingFunction = (a, b) => {
  if (isNumber(a.label)) {
    return a.label - b.label;
  }

  if (isString(a.label) && isString(b.label)) {
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  }

  return a.label - b.label;
};

export default class EstSelect extends Component {

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

  handleChange = (linearValue, objectValue) => {
    const {
      emptyValue = '',
      selectType = false,
      fieldName,
    } = this.props;

    this.props.onChange(linearValue === '' ? emptyValue : linearValue, objectValue);
  }
  render() {
    const {
      placeholder = 'Выберите...',
      noResultsText = 'Ничего не найдено',
      options = [],
      sortingFunction = defaultSortingFunction,
    } = this.props;

    const sortedOptions = options.sort(sortingFunction);

    return (
      <Select
        {...this.props}
        onChange={this.handleChange}
        options={sortedOptions}
        placeholder={placeholder}
        noResultsText={noResultsText}
      />
    );
  }
}
