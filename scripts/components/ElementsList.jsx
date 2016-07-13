import React from 'react';
import ReactDOM from 'react-dom';
import { FluxContext } from 'utils/decorators';


/**
* Базовый класс для наследования таблиц с формами
* @extends React.Component
*/
@FluxContext
class ElementsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      elementsList: [],
      showForm: false,
      selectedElement: null,
    };

    this.clicks = 0;
  }

  init() {

  }

  onDoubleClick() {
    this.setState({ showForm: true });
  }

  selectElement({props}) {
    const id = !props || !props.data ? null : props.data.id || props.data[this.selectField];

    if (props.fromKey) {
      let selectedElement = _.find(this.state.elementsList, el => el.id ? el.id === id : el[this.selectField] === id);
      if (selectedElement) {
        this.setState({ selectedElement });
      }
      return;
    }

    this.clicks++;

    if (this.clicks === 1) {
      let selectedElement = _.find(this.state.elementsList, el => el.id ? el.id === id : el[this.selectField] === id);
      this.setState({ selectedElement });
      setTimeout(() => {
        if (this.clicks !== 1) {
          if (this.state.selectedElement && id === (this.state.selectedElement.id || this.state.selectedElement[this.selectField]) ) {
            this.onDoubleClick();
          }
        }
        this.clicks = 0;
      }, 300);
    }
  }

  createElement() {
    this.setState({
      showForm: true,
      selectedElement: null
    });
  }

  showForm() {
    this.setState({
      showForm: true
    });
  }

  onFormHide() {
    this.setState({
      showForm: false,
      selectedElement: null,
    });
  }

  removeElement() {
    if (typeof this.removeElementAction !== 'function') return;

    confirmDialog({
      title: 'Внимание',
      body: 'Вы уверены, что хотите удалить выбранный элемент?'
    })
    .then(() => this.removeElementAction(this.state.selectedElement.id || this.state.selectedElement[this.selectField]))
    .catch(() => {});
  }

  componentWillReceiveProps(props) {
    const elementsList = props[this.mainListName] || [];
    this.setState({elementsList});
  }

  componentDidMount() {
    if (!this.keyPressDisabled) {
      ReactDOM.findDOMNode(this).setAttribute('tabindex', 1);
      ReactDOM.findDOMNode(this).onkeydown = this.onKeyPress.bind(this);
    }

    this.init();
  }

  onKeyPress(e) {
    if (e.code === 'Enter' && this.state.selectedElement !== null) {
      this.showForm();
    }

    if (e.code === 'Backspace' && this.state.selectedElement !== null) {
      e.preventDefault();
      if (typeof this.removeDisabled === 'function') {
        if (!this.removeDisabled()) {
          this.removeElement();
        }
      } else {
        this.removeElement();
      }
    }
  }

  render() {
    return <div/>;
  }

}

export default ElementsList;
