import React from 'react';
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

   selectElement({props}) {
     console.log('SELECT ELEMENT CALL', props.data.id);
     const id = props.data.id;
     if (this.state.selectedElement && id === this.state.selectedElement.id) {
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
 		if (confirm('Вы уверены, что хотите удалить выбранный элемент?')) {
      this.removeElementAction(this.state.selectedElement.id);
 		}
 	 }

   componentWillReceiveProps(props) {
     const elementsList = props[this.mainListName] || [];
     this.setState({elementsList});
   }

   render() {
     return <div/>;
   }

 }

 export default ElementsList;
