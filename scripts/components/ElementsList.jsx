import React from 'react';
import ReactDOM from 'react-dom';
import { FluxContext } from './decorators/index.js';

/*
 * Базовый класс для наследования списков с формами
 */

@FluxContext
class ElementsList extends React.Component {

   constructor(props) {
     super(props);

     this.state = {
       elementsList: [],
       showForm: false,
       selectedElement: null,
     }
   }

   init() {

   }

   selectElement({props}) {
     console.log('SELECT ELEMENT CALL', props.data.id);
     const id = props.data.id;
     if (this.state.selectedElement && id === this.state.selectedElement.id && !this.doubleClickDisabled) {
   		 return this.setState({ showForm: true });
   	 }
     let selectedElement = _.find(this.state.elementsList, el => el.id === id);
     this.setState({ selectedElement });
   }

   createElement() {
 		this.setState({
 			showForm: true,
 			selectedElement: null
 		});
 	 }

   showForm() {
 	   this.setState({ showForm: true });
 	 }

   onFormHide() {
 		this.setState({
 			showForm: false,
 			selectedElement: null,
 		});
 	 }

   removeElement() {
    if (typeof this.removeElementAction !== 'function') return;
 		if (confirm('Вы уверены, что хотите удалить выбранный элемент?')) {
      this.removeElementAction(this.state.selectedElement.id);
 		}
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

   onKeyPress(e, a) {
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
 		if (e.code === 'ArrowDown' && this.state.selectedElement !== null) {
 			e.preventDefault();
 			// let elementsAsGrid = _.sortBy(this.props[this.mainListName], 'number').reverse()
 			// let selectedElementIndex = _.findIndex(elementsAsGrid, (el) => el.id === this.state.selectedElement.id);
 			// console.log(selectedElementIndex);
 		}
 		if (e.code === 'ArrowUp' && this.state.selectedElement !== null) {
 			e.preventDefault();
 			// let selectedElementIndex = _.findIndex(_.sortBy(this.props[this.mainListName], 'number').reverse(), (el) => el.id === this.state.selectedElement.id);
 			// console.log(selectedElementIndex);
 		}
 	 }

   render() {
     return <div/>;
   }

 }

 export default ElementsList;
