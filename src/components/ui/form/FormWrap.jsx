import React, { Component } from 'react';
import Form from './Form.jsx';

export default class FormWrap extends Component {

  static contextTypes = {
    flux: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      formState: null,
      canSave: false,
      formErrors: {},
    };
  }

  componentWillReceiveProps(props) {
    if (props.showForm) {
      if (props.element !== null) {
        const formState = Object.assign({}, props.element);
        this.setState({ formState });
      } else {
        this.setState({ formState: {} });
      }
    }
  }


  handleFormStateChange(field, e) {
    const value = !!e.target ? e.target.value : e;
    const formState = this.state.formState;
    const newState = {};

    if ((!!value && value !== '' && !(Array.isArray(value) && value.length === 0)) || (typeof value === 'boolean')) {
      console.info('Form changed', field, e);
      formState[field] = value;
    } else {
      console.info('Form deleted', field);
      delete formState[field];
    }

    newState.formState = formState;

    this.setState(newState);
  }

  handleFormSubmit(formState) {
    const { flux } = this.context;
    this.props.onFormHide();
  }

  render() {
    const props = this.props;

    return props.showForm ?
      <Form
        formState={this.state.formState}
        onSubmit={this.handleFormSubmit.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        tableMeta={this.props.tableMeta}
        title={this.props.title}
        {...this.state}
      />
      : null;
  }

}
