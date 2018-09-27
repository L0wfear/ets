import React from 'react';
import { autobind } from 'core-decorators';
import connectToStores from 'flummox/connect';
import {
  cloneDeep,
  each,
  filter,
} from 'lodash';
import { routeSchema } from 'models/RouteModel';
import { polyState } from 'constants/polygons';
import RouteForm from './RouteForm';
import FormWrap from '../compositions/FormWrap';

@autobind
class RouteFormWrap extends FormWrap {
  constructor(props) {
    super(props);

    this.schema = routeSchema;
  }

  componentDidMount() {
    this.context.flux.getActions('technicalOperation').getTechnicalOperationsObjects();
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      let formState = null;
      if (props.element !== null) {
        formState = cloneDeep(props.element);
        formState.is_main = Boolean(formState.is_main);

        if (!formState.id) {
          formState.is_new = true;
          formState.created_at = new Date();
        }

        formState.draw_odh_list = cloneDeep(formState.draw_object_list);
        this.updateFromStatePolys(formState, true);
      } else {
        formState = {
          is_main: true,
        };
      }

      if (!formState.id) {
        formState.number = '{{number}}';
        formState.name = formState.name || '';
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

  updateFromStatePolys = (formState, isInitOpen) => {
    const {
      municipal_facility_id,
      type: object_type,
    } = formState;

    let new_polys = {};
    if (object_type !== 'mixed') {
      new_polys = cloneDeep(this.props.dtPolys);
    }
    if (object_type !== 'simple_dt') {
      new_polys = {
        ...new_polys,
        ...cloneDeep(this.props.odhPolys),
      };
    }
    each(formState.object_list.filter(o => !!o.object_id), (o) => {
      if (new_polys[o.object_id]) {
        new_polys[o.object_id].state = o.state;
      }
    });

    if (municipal_facility_id && (object_type === 'mixed' || object_type === 'simple_dt')) {
      const object_type_id = this.props.technicalOperationsObjectsList.find(({ type }) => object_type === type).id;
      this.context.flux.getActions('geoObjects').getGeozoneMunicipalFacility(municipal_facility_id, object_type_id)
        .then((rows) => {
          const polys = rows.reduce((newObj, { id, name, shape }) => ({
            ...newObj,
            [id]: {
              name,
              shape: JSON.parse(shape),
              state: polyState.SELECTABLE,
            },
          }), {});

          if (isInitOpen) {
            each(formState.object_list.filter(o => !!o.object_id), (o) => {
              if (polys[o.object_id]) {
                polys[o.object_id].state = o.state;
              } else if (new_polys[o.object_id]) {
                polys[o.object_id] = {
                  ...new_polys[o.object_id],
                  state: o.state,
                  old: true,
                };
              }
            });
          } else {
            this.handleFormStateChange('object_list', []);
            this.handleFormStateChange('input_lines', []);
            this.handleFormStateChange('draw_list', []);
            this.handleFormStateChange('draw_odh_list', []);
          }

          this.handleFormStateChange('polys', polys);
        });
    }

    this.handleFormStateChange('polys', {});
  }

  resetFormState = async () => {
    const { formState } = this.state;

    formState.object_list = [];
    formState.input_lines = [];
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

    return props.showForm
      ? (
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
          updateFromStatePolys={this.updateFromStatePolys}
          {...this.state}
          {...this.additionalProps()}
        />
      )
      : null;
  }
}

export default connectToStores(RouteFormWrap, ['routes', 'geoObjects', 'objects']);
