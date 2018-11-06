import React from 'react';
import connectToStores from 'flummox/connect';
import {
  cloneDeep,
  each,
  filter,
} from 'lodash';
import { routeSchema } from 'models/RouteModel';
import { polyState } from 'constants/polygons';
import RouteForm from 'components/route/form/RouteForm';
import FormWrap from 'components/compositions/FormWrap';
import { DivNone } from 'global-styled/global-styled';

let lastObjectList = {
  object_type: null,
  object_list: [],
};

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
      object_list,
      type: object_type,
    } = formState;

    let oldObjectList = object_list;

    if (municipal_facility_id && object_type) {
      if (object_type === lastObjectList.object_type) {
        if (!object_list.length) {
          oldObjectList = lastObjectList.object_list;
        } else {
          lastObjectList.object_list = oldObjectList;
        }
      } else {
        lastObjectList.object_list = object_list;
        lastObjectList.object_type = object_type;
      }
    }

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
    each(oldObjectList.filter(o => !!o.object_id), (o) => {
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

          const newObjectList = [];

          each(oldObjectList.filter(o => !!o.object_id), (o) => {
            if (polys[o.object_id]) {
              polys[o.object_id].state = o.state;
              newObjectList.push(o);
            }
          });

          if (isInitOpen) {
            each(oldObjectList.filter(o => !!o.object_id), (o) => {
              if (new_polys[o.object_id]) {
                polys[o.object_id] = {
                  ...new_polys[o.object_id],
                  state: o.state,
                  old: true,
                };
              }
            });
          } else {
            lastObjectList.object_list = newObjectList.length ? newObjectList : lastObjectList.object_list;
            this.handleFormStateChange('object_list', newObjectList);
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

  handleFormSubmit = async (isTemplate) => {
    const { flux } = this.context;
    const { formState } = this.state;
    let result;

    try {
      if (!formState.id) {
        result = await flux.getActions('routes').createRoute(formState, isTemplate);
      } else {
        result = await flux.getActions('routes').updateRoute(formState);
      }
    } catch (error) {
      console.log(error);
    }

    this.onFormHide(true, result);
  }

  handleFormStateChangeRoute = (f, e) => {
    const { formErrors, formState } = this.handleFormStateChange(f, e);

    // Проверка на наличие имени маршрута в списке маршрутов
    const { routesList } = this.props;
    const routesByName = routesList
      .filter(r => r.id !== formState.id)
      .map(r => r.name);
    const value = formState.name;

    let hasChanges = false;

    if (routesByName.includes(value)) {
      if (!formErrors.name) {
        hasChanges = true;
        formErrors.name = 'Маршрут с данным названием уже существует!';
      }
    } else if (formErrors.name === 'Маршрут с данным названием уже существует!') {
      hasChanges = true;
      delete formErrors.name;
    }

    if (hasChanges) {
      this.setState({ formErrors });
    }
  }

  additionalProps = () => {
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

  onFormHide = (...arg) => {
    lastObjectList = {
      object_list: [],
      object_type: null,
    };

    this.props.onFormHide(...arg);
  }

  render() {
    const { props } = this;

    return props.showForm
      ? (
        <RouteForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChangeRoute}
          show={this.props.showForm}
          onHide={this.onFormHide}
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
      : (
        <DivNone />
      );
  }
}

export default connectToStores(RouteFormWrap, ['routes', 'geoObjects', 'objects']);
