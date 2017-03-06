import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

export default class EstSelect extends Component {

  static get propTypes() {
    return {
      placeholder: PropTypes.string,
      noResultsText: PropTypes.string,
      options: PropTypes.array,
      sortingFunction: PropTypes.func,
      emptyValue: PropTypes.string,
      onChange: PropTypes.func,
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

  render() {
    const { placeholder = 'Выберите...', emptyValue = '', noResultsText = 'Ничего не найдено', options = [], sortingFunction = (a, b) => {
      if (typeof a.label === 'number') {
        return a.label - b.label;
      }
      if (a.label && b.label) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
      }
      return a.label - b.label;
    } } = this.props;
    const sortedOptions = options.sort(sortingFunction);

    return <Select {...this.props} onChange={(v, a) => this.props.onChange(v === '' ? emptyValue : v, a)} options={sortedOptions} placeholder={placeholder} noResultsText={noResultsText} />;
  }
}
