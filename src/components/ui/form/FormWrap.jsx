import * as React from 'react';
import * as PropTypes from 'prop-types';
import Form from './Form';

export default class FormWrap extends React.Component {
  static contextTypes = {
    flux: PropTypes.object,
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
    const value = e.target ? e.target.value : e;
    const formState = this.state.formState;
    const newState = {};

    console.info('Form changed', field, e);
    formState[field] = value;

    newState.formState = formState;

    this.setState(newState);
  }

  handleFormSubmit(formState) {
    const { flux } = this.context;
    this.props.onFormHide();
  }

  render() {
    const props = this.props;

    return props.showForm
      ? (
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
      )
      : null;
  }
}
