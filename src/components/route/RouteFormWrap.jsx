import React from 'react';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import {
  cloneDeep,
  each,
  filter,
} from 'lodash';
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

        formState = cloneDeep(props.element);

        if (!formState.id) {
          formState.is_new = true;
          formState.created_at = new Date();
        }

        formState.draw_odh_list = cloneDeep(formState.draw_object_list);
        formState.polys = formState.type === 'simple_dt' ? cloneDeep(props.dtPolys) : cloneDeep(props.odhPolys);
        each(formState.object_list.filter(o => !!o.object_id), (o) => {
          if (formState.polys[o.object_id]) formState.polys[o.object_id].state = o.state;
        });
      } else {
        formState = {};
      }
      formState.structure_id = props.element.structure_id || this.context.flux.getStore('session').getCurrentUser().structure_id;
      const formErrors = this.validate(formState, {});
      this.setState({
        formState,
        canSave: !filter(formErrors).length,
        formErrors,
      });
    }
  }

  resetFormState() {
    const { formState } = this.state;
    formState.polys = formState.type === 'simple_dt' ? cloneDeep(this.props.dtPolys) : cloneDeep(this.props.odhPolys);
    formState.object_list = [];
    formState.draw_object_list = [];
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

    if (typeof this.props.selectedRoute === 'function') {
      this.props.selectedRoute(formState);
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
    const value = formState.name;

    if (routesByName.includes(value)) {
      if (!formErrors.name) {
        formErrors.name = 'Маршрут с данным названием уже существует!';
      }
    } else if (formErrors.name === 'Маршрут с данным названием уже существует!') {
      delete formErrors.name;
    }
    this.setState({ formErrors });
  }
  additionalProps() {
    const { fromMission = false } = this.props;

    if (fromMission) {
      const {
        available_route_types = [],
      } = this.props;

      return {
        available_route_types,
      };
    }
    return {
    };
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
        notTemplate={this.props.notTemplate}
        structureId={this.props.structureId}
        fromOrder={this.props.fromOrder}
        {...this.state}
        {...this.additionalProps()}
      />
      : null;
  }

}

export default connectToStores(RouteFormWrap, ['routes', 'geoObjects']);
