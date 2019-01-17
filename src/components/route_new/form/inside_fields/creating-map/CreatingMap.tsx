import * as React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { connect } from 'react-redux';
import { Flex, DivNone, FlexContainer } from 'global-styled/global-styled';
import RouteCreatingMap from 'components/route_new/form/inside_fields/creating-map/map/RouteCreatingMap';
import { loadGeozoneMunicipalFacility } from 'redux-main/trash-actions/geometry/geometry';
import { ReduxState } from 'redux-main/@types/state';

import {
  PropsCreatingMap,
  StateCreatingMap,
  StatePropsCreatingMap,
  DispatchPropsCreatingMap,
  OwnPropsCreatingMap,
} from 'components/route_new/form/inside_fields/creating-map/CreatingMap.d';
import { routeTypesByKey } from 'constants/route';
import { getTechnicalOperationsObjects } from 'redux-main/trash-actions/technical-operation/technical-operation';
import { OneGeozoneMunicipalFacility } from 'redux-main/trash-actions/geometry/geometry.h';
import { ButtonOdhContainer, CreatingMapContainer, ButtonCheckTypeSelect, ButtonCheckRoute, PointInputContainer, RouteFormGeoList } from 'components/route_new/form/inside_fields/creating-map/styled/styled';
import { ExtField } from 'components/ui/new/field/ExtField';
import RouteGeoList from 'components/route_new/route-info/geo-list/RouteGeoList';

import {
  makeObjectListByObjectListIdArr,
  makeObjectListIdArr,
  makeObjectListOptions,
  mergeLineIntoInputLines,
  mergeStateFromObjectList,
  routesToLoadByKeySet,
  changeStateInObjectList,
  setNameForPointByIndex,
  setCacheDataForRoute,
  getCacheDataForRoute,
} from 'components/route_new/form/inside_fields/creating-map/utils';
import { ExtButton } from 'components/ui/new/button/ExtButton';

class CreatingMap extends React.PureComponent<PropsCreatingMap, StateCreatingMap> {
  state = {
    technical_operations_object_list: [],
    geozone_municipal_facility_by_id: {},
    object_list: this.props.object_list,
    OBJECT_LIST_OPTIONS: [],
    objectListIdArr: makeObjectListIdArr(this.props.object_list),
    type: this.props.type,
    manual: this.props.type && routeTypesByKey[this.props.type].slug === 'points',
    hand: false,
  };

  componentDidMount() {
    this.getToObjects();
  }

  static getDerivedStateFromProps(nextProps: PropsCreatingMap, prevState: StateCreatingMap) {
    const {
      object_list,
      type,
    } = nextProps;
    let changeObj = null;

    if (object_list !== prevState.object_list) {
      const { geozone_municipal_facility_by_id } = mergeStateFromObjectList(object_list, prevState.geozone_municipal_facility_by_id);

      changeObj = {
        ...changeObj,
        object_list,
        OBJECT_LIST_OPTIONS: makeObjectListOptions(geozone_municipal_facility_by_id),
        objectListIdArr: makeObjectListIdArr(object_list),
        geozone_municipal_facility_by_id,
      };
    }

    if (type !== prevState.type) {
      changeObj = {
        ...changeObj,
        manual: type && routeTypesByKey[type].slug && routeTypesByKey[type].slug === 'points',
        hand: false,
        type,
      };
    }
    return changeObj;
  }

  componentDidUpdate(prevProps: PropsCreatingMap) {
    const {
      type: prevType,
      municipal_facility_id: prevMunicipalFacilityId,
      technical_operation_id: prevTechnicalOperationId,
    } = prevProps;

    const {
      type,
      municipal_facility_id,
      technical_operation_id,
    } = this.props;

    const trigger = (
      prevType !== type
      || prevMunicipalFacilityId !== municipal_facility_id
      || technical_operation_id !== prevTechnicalOperationId
    );

    if (trigger) {
      if (type && municipal_facility_id && technical_operation_id) {
        if (prevType && prevMunicipalFacilityId && prevTechnicalOperationId) {
          setCacheDataForRoute(prevType, {
            object_list: prevProps.object_list,
            input_lines: prevProps.input_lines,
          });
        }

        this.props.onChange({
          ...getCacheDataForRoute(type),
          draw_object_list: [],
        });

        const needUpdateObjectData = true;

        this.loadGeometry(this.props, this.state, needUpdateObjectData);
      } else if (prevType && prevMunicipalFacilityId && prevTechnicalOperationId) {
        setCacheDataForRoute(prevType, {
          object_list: prevProps.object_list,
          input_lines: prevProps.input_lines,
        });
      } else {
        this.props.onChange({
          object_list: [],
          input_lines: [],
          draw_object_list: [],
        });
      }
    }
  }

  async getToObjects() {
    const { payload: { technical_operations_object_list } } = await this.props.getTechnicalOperationsObjects();
    this.setState({ technical_operations_object_list });

    if (this.props.type && this.props.municipal_facility_id) {
      const needUpdateObjectData = false;
      this.loadGeometry(this.props, { ...this.state, technical_operations_object_list }, needUpdateObjectData);
    }
  }
  async loadGeometry(props: PropsCreatingMap, state: StateCreatingMap, needUpdateObjectData: boolean) {
    const { type } = props;

    if (routesToLoadByKeySet.has(type)) {
      const typeData = state.technical_operations_object_list.find(({ slug }) => slug === routeTypesByKey[type].slug);

      if (typeData) {
        const {
          payload: {
            geozone_municipal_facility_by_id: geozone_municipal_facility_by_id_raw,
          },
        } = await this.props.loadGeozoneMunicipalFacility(props.municipal_facility_id, props.technical_operation_id, typeData.id);

        const {
          geozone_municipal_facility_by_id,
          objectList,
        } = mergeStateFromObjectList(
          this.props.object_list,
          geozone_municipal_facility_by_id_raw,
        );

        this.setState({
          geozone_municipal_facility_by_id,
          OBJECT_LIST_OPTIONS: makeObjectListOptions(geozone_municipal_facility_by_id),
        });

        if (needUpdateObjectData) {
            this.props.onChange({ object_list: objectList });
            if (routeTypesByKey[type].slug === 'odh') {
              setImmediate(() => (
                this.props.checkRoute()
              ));
            }
        }
      }
    }
  }
  handleFeatureClick = (geo: OneGeozoneMunicipalFacility) => {
    if (this.props.isPermitted) {
      this.props.onChange({
        object_list: changeStateInObjectList(
          geo,
          this.props.object_list,
          this.props.type,
        ),
      });
    }
  }
  handlePointAdd = ({ newPointObject }) => {
    if (this.props.isPermitted) {
      const { object_list } = this.state;

      const triggerOnAddPoint = !object_list.some(({ coordinates }) => (
        coordinates[0] === newPointObject.coordinates[0]
        && coordinates[1] === newPointObject.coordinates[1]
      ));

      if (triggerOnAddPoint) {
        this.props.onChange({
          object_list: [
            ...object_list,
            newPointObject,
          ],
        });
      }
    }
  }
  handleAddDrawLines = (input_lines) => {
    if (this.props.isPermitted) {
      this.props.onChange(({
      input_lines: [
          ...this.props.input_lines,
          ...input_lines,
        ],
      }));
      this.setState({ manual: false });
    }
  }
  handleDrawFeatureClick = (line) => {
    if (this.props.isPermitted) {
      this.props.onChange({
        input_lines: mergeLineIntoInputLines(
          this.props.input_lines,
          line,
        ),
      });
    }
  }
  handleRemoveLastDrawFeature = () => {
    if (this.props.isPermitted) {
      const { input_lines } = this.props;
      const newInputLines = [...input_lines];
      newInputLines.pop();

      this.props.onChange(({
        input_lines: newInputLines,
      }));
    }
  }
  setHandTrue = () => {
    if (this.props.isPermitted) {
      this.setState({
        manual: true,
        hand: true,
      });
    }
  }
  setHandFalse = () => {
    if (this.props.isPermitted) {
      this.setState({
        hand: false,
        manual: false,
      });
    }
  }
  toggleAllObjectList = () => {
    if (this.props.isPermitted) {
      const {
        objectListIdArr,
        geozone_municipal_facility_by_id,
      } = this.state;
      const geoValues = Object.values(geozone_municipal_facility_by_id);
      const countPolys = geoValues.length;

      if (countPolys) {
        if (objectListIdArr.length === countPolys) {
          this.handleChangeSelectedObjectList([]);
        } else {
          this.handleChangeSelectedObjectList(
            geoValues.map(({ id }) => id),
          );
        }
      }
    }
  }
  handleChangeSelectedObjectList = (objectListIdArr: number[]) => {
    if (this.props.isPermitted) {
      this.props.onChange({
        object_list: makeObjectListByObjectListIdArr(
          objectListIdArr,
          this.props.object_list,
          this.props.type,
          this.state.geozone_municipal_facility_by_id),
      });
    }
  }
  handleChangePointName = (index, { currentTarget: { value }}) => {
    if (this.props.isPermitted) {
      this.props.onChange({
        object_list: setNameForPointByIndex(
          this.props.object_list,
          Number(index),
          value,
        ),
      });
    }
  }
  handleClickOnStartDraw = () => {
    if (this.props.isPermitted) {
      this.setState({ manual: !this.state.manual });
    }
  }

  handleRemovePoint = (index) => {
    if (this.props.isPermitted) {
      const object_list = [...this.props.object_list];
      this.props.onChange({
        object_list: object_list.filter((_, i) => i !== index),
      });
    }
  }

  render() {
    const { props, state } = this;
    const {
      type,
      isPermitted,
    } = props;
    const {
      manual,
      hand,
    } = state;

    const countPolys = Object.keys(state.geozone_municipal_facility_by_id).length;

    return type
      ? (
        <>
          <Flex grow={4} shrink={4} basis={500}>
            <CreatingMapContainer>
              <RouteCreatingMap
                objectsType={type}
                manual={manual}
                canDraw={hand}
                polys={state.geozone_municipal_facility_by_id}
                bridges={this.props.bridges}
                objectList={props.object_list}
                drawObjectList={props.input_lines}
                handleFeatureClick={this.handleFeatureClick}
                handlePointAdd={this.handlePointAdd}
                handleAddDrawLines={this.handleAddDrawLines}
                handleDrawFeatureClick={this.handleDrawFeatureClick}
                handleRemoveLastDrawFeature={this.handleRemoveLastDrawFeature}
                handleClickOnStartDraw={this.handleClickOnStartDraw}
                disabled={!isPermitted}
              />
              {
                type && routeTypesByKey[type].slug === 'odh'
                ? (
                  <ButtonOdhContainer>
                    <ButtonCheckTypeSelect
                      id="manual"
                      active={hand}
                      onClick={this.setHandTrue}
                      disabled={!isPermitted}
                    >
                      Вручную
                    </ButtonCheckTypeSelect>
                    <ButtonCheckTypeSelect
                      id="select-from-odh"
                      active={!hand}
                      onClick={this.setHandFalse}
                      disabled={!isPermitted}
                    >
                      Выбор из ОДХ
                    </ButtonCheckTypeSelect>
                  </ButtonOdhContainer>
                )
                : (
                  <DivNone />
                )
              }
            </CreatingMapContainer>
          </Flex>
          <RouteFormGeoList grow={1} shrink={1} basis={250}>
            {
              routeTypesByKey[type].slug !== 'points'
                ? (
                  <>
                    <ExtField
                      type="boolean"
                      label="Выбрать всё"
                      value={countPolys && (state.objectListIdArr.length === countPolys)}
                      onChange={this.toggleAllObjectList}
                      className="checkbox-input flex-reverse"
                      disabled={!isPermitted || !countPolys}
                    />
                    <ExtField
                      id="object_list_id"
                      type="select"
                      multi
                      label={`Список выбранных ${routeTypesByKey[type].title}`}
                      error={props.error}
                      options={state.OBJECT_LIST_OPTIONS}
                      value={state.objectListIdArr}
                      onChange={this.handleChangeSelectedObjectList}
                      disabled={!isPermitted}
                    />
                    {
                      routeTypesByKey[type].slug === 'odh'
                        ? (
                          <ButtonCheckRoute id="check-route" onClick={this.props.checkRoute} disabled={!Boolean(props.draw_object_list.length || props.input_lines.length)}>Проверить маршрут</ButtonCheckRoute>
                        )
                        : (
                          <DivNone />
                        )
                    }
                    <RouteGeoList
                      type={type}
                      object_list={props.object_list}
                      draw_object_list={props.draw_object_list}
                      polys={state.geozone_municipal_facility_by_id}
                      makeFailList={true}
                    />
                  </>
                )
                : (
                  routeTypesByKey[type].slug === 'points'
                   ? (
                      props.object_list.map((d, index) => (
                        <PointInputContainer key={index}>
                          <span><b>{`Пункт назначения №${index + 1}${d.name ? ` (${d.name})` : ''}`}</b></span>
                          <FlexContainer>
                            <ExtField
                              type="string"
                              label={false}
                              error={false}
                              value={d.name}
                              onChange={this.handleChangePointName}
                              boundKeys={[index]}
                              disabled={!isPermitted}
                            />
                          <ExtButton disabled={!isPermitted} onClick={() => this.handleRemovePoint(index)}><Glyphicon glyph="remove" /></ExtButton>
                          </FlexContainer>
                        </PointInputContainer>
                      ))
                    )
                    : (
                      <DivNone />
                    )
                )
            }
          </RouteFormGeoList>
        </>
      )
      : (
        <DivNone />
      );
  }
}

export default connect<StatePropsCreatingMap, DispatchPropsCreatingMap, OwnPropsCreatingMap, ReduxState>(
  null,
  (dispatch, { page, path }) => ({
    loadGeozoneMunicipalFacility: (municipal_facility_id, technical_operation_id, object_type_id) => (
      dispatch(
        loadGeozoneMunicipalFacility(
          'none',
          {
            municipal_facility_id,
            technical_operation_id,
            object_type_id,
          },
          {
            page,
            path,
          },
        ),
      )
    ),
    getTechnicalOperationsObjects: () => (
      dispatch(
        getTechnicalOperationsObjects(
          'none',
          {},
          {
            page,
            path,
          },
        ),
      )
    ),
  }),
)(CreatingMap);
