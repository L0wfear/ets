import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

export default class EstSelect extends Component {

  static get propTypes() {
    return {
      placeholder: PropTypes.string,
      noResultsText: PropTypes.string,
      options: PropTypes.array,
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
    const { placeholder = 'Выберите...', noResultsText = 'Ничего не найдено', options = [] } = this.props;
    const sortedOptions = options.sort((a, b) => {
      if (typeof a.label === 'number') {
        return a.label - b.label;
      }
      if (a.label && b.label) {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
      }
      return a.label - b.label;
    });

    return <Select {...this.props} options={sortedOptions} placeholder={placeholder} noResultsText={noResultsText} />;
  }
}
