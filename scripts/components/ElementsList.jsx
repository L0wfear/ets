import React from 'react';

/*
 * Базовый класс для наследования списков с формами
 */

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
     console.log('SELECT ELEMENT CALL');
     const id = props.data.id;
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

 ElementsList.contextTypes = {
 	flux: React.PropTypes.object,
 };

 export default ElementsList;
