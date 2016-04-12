import React, {Component} from 'react';
import Select from 'react-select';

//export default (props) => <Select {...props} placeholder="Выберите..." noResultsText="Ничего не найдено" />;

class EstSelect extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.multi) {
      const selItems = document.querySelectorAll('.Select--multi .Select-item-label');

      for (var i = 0; i < selItems.length; i++) {
        selItems[i].setAttribute('title', selItems[i].innerHTML);
      }
    }
  }

  render() {
    const { placeholder = 'Выберите...', noResultsText = 'Ничего не найдено'} = this.props;

    return <Select {...this.props} placeholder={placeholder} noResultsText={noResultsText} />;
  }
}

export default EstSelect;
