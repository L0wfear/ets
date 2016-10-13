import React from 'react';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import _ from 'lodash';
import { routeSchema } from 'models/RouteModel.js';
import RouteForm from './RouteForm.jsx';
import FormWrap from '../compositions/FormWrap.jsx';

@autobind
class RouteFormWrap extends FormWrap {

  constructor(props) {
    super(props);

    this.schema = routeSchema;
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      let formState = null;
      if (props.element !== null) {
        formState = _.cloneDeep(props.element);
        formState.polys = formState.type === 'simple_dt' ? _.cloneDeep(props.dtPolys) : _.cloneDeep(props.odhPolys);
        _.each(formState.object_list.filter(o => !!o.object_id), (o) => {
          if (formState.polys[o.object_id]) formState.polys[o.object_id].state = o.state;
        });
      } else {
        formState = {};
      }
      const formErrors = this.validate(formState, {});
      this.setState({
        formState,
        canSave: !_.filter(formErrors).length,
        formErrors,
      });
    }
  }

  resetFormState() {
    const { formState } = this.state;
    formState.polys = formState.type === 'simple_dt' ? _.cloneDeep(this.props.dtPolys) : _.cloneDeep(this.props.odhPolys);
    formState.object_list = [];
    this.setState({ formState });
  }

  async handleFormSubmit(isTemplate) {
    const { flux } = this.context;
    const { formState } = this.state;
    let result;

    if (!formState.id) {
      result = await flux.getActions('routes').createRoute(formState, isTemplate);
    } else {
      result = await flux.getActions('routes').updateRoute(formState);
    }

    this.props.onFormHide(true, result);
  }

  async handleFormStateChange(f, e) {
    await super.handleFormStateChange(f, e);

    // Проверка на наличие имени маршрута в списке маршрутов
    const { formErrors, formState } = this.state;
    const { routesList } = this.props;
    const routesByName = routesList
      .filter(r => r.id !== formState.id)
      .map(r => r.name);
    let value;
    if (f === 'name') {
      value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    } else {
      value = formState.name;
    }
    if (routesByName.includes(value)) {
      if (!formErrors.name) {
        formErrors.name = 'Маршрут с данным названием уже существует!';
      }
    } else if (formErrors.name === 'Маршрут с данным названием уже существует!') {
      delete formErrors.name;
    }
    this.setState({ formErrors });
  }

  render() {
    const props = this.props;

    return props.showForm ?
      <RouteForm
        formState={this.state.formState}
        onSubmit={this.handleFormSubmit}
        handleFormChange={this.handleFormStateChange}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        resetState={this.resetFormState}
        fromMission={this.props.fromMission}
        {...this.state}
      />
      : null;
  }

}

export default connectToStores(RouteFormWrap, ['routes', 'geoObjects']);
