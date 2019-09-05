import {
  PropsCreatingMap,
  StateCreatingMap,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/CreatingMap.d';
import { routeTypesByKey } from 'constants/route';

import {
  OneGeozoneMunicipalFacility,
  GeozoneMunicipalFacilityById,
} from 'redux-main/trash-actions/geometry/geometry.h';
import { polyState } from 'constants/polygons';
import { keyBy } from 'lodash';
import { Route } from 'redux-main/reducers/modules/routes/@types';

export const routesToLoadByKeySet = new Set(
  Object.entries(routeTypesByKey)
    .filter(([, { needLoad }]) => needLoad)
    .map(([key]) => key),
);

const mergeRestObjetRecordWithNew = (objectIndex: Record<ValuesOf<Route['object_list']>['object_id'], ValuesOf<Route['object_list']>>, newObjectList: Route['object_list']) => {
  const newArr: Array<ValuesOf<Route['object_list']> & { is_invalid?: boolean }>  = [...newObjectList];

  Object.values(objectIndex).forEach((rowData) => {
    newArr.push({
      ...rowData,
      is_invalid: true,
    });
  });

  return newArr;
};

export const mergeStateFromObjectList = (
  objectList: PropsCreatingMap['object_list'],
  geozoneMunicipalFacilityById: StateCreatingMap['geozone_municipal_facility_by_id'],
  init?: boolean,
) => {
  const objectIndex = keyBy(objectList, 'object_id');
  const newObjectList = [];

  const geozone_municipal_facility_by_id = Object.entries(
    geozoneMunicipalFacilityById,
  ).reduce<GeozoneMunicipalFacilityById>((newObj, [id, geoData]) => {
    newObj[id] = geoData;
    if (objectIndex[id]) {
      newObj[id] = {
        ...newObj[id],
        state: objectIndex[id].state,
      };

      newObjectList.push(objectIndex[id]);
      delete objectIndex[id];
    } else if (newObj[id].state !== polyState.ENABLE) {
      newObj[id] = {
        ...newObj[id],
        state: polyState.ENABLE,
      };
    }

    return newObj;
  }, {});

  return {
    geozone_municipal_facility_by_id,
    objectList: init ? mergeRestObjetRecordWithNew(objectIndex, newObjectList) : newObjectList,
  };
};

export const changeStateInObjectList = (
  geo: OneGeozoneMunicipalFacility,
  objectList: PropsCreatingMap['object_list'],
  type: PropsCreatingMap['type'],
) => {
  let newObjectList = [];

  if (geo.state === polyState.ENABLE) {
    newObjectList = objectList.filter(
      ({ object_id }) => Number(object_id) !== Number(geo.id),
    );
  } else if (geo.state === polyState.SELECTED) {
    newObjectList = [...objectList];
    const newObjectData = makeObjByGeo(type, geo.id, geo);
    if (newObjectData) {
      newObjectList.push(newObjectData);
    }
  } else {
    newObjectList = objectList.reduce((newArr, objData) => {
      if (Number(objData.object_id) === Number(geo.id)) {
        newArr.push({
          ...objData,
          state: geo.state,
        });
      } else {
        newArr.push(objData);
      }

      return newArr;
    }, []);
  }

  return newObjectList;
};

export const makeObjectListOptions = (
  geozone_municipal_facility_by_id: StateCreatingMap['geozone_municipal_facility_by_id'],
  objectList: Route['object_list'],
) => {
  const objectIndex = keyBy(objectList, 'object_id');

  const options_by_mf = Object.values(geozone_municipal_facility_by_id).map(
    ({ id, name, is_valid_company_structure }) => {
      delete objectIndex[id];
      return {
        value: id,
        label: name,
        is_invalid: !is_valid_company_structure,
      };
    });
  Object.values(objectIndex).forEach((rowData: any) => {
    options_by_mf.push({
      value: rowData.object_id,
      label: rowData.name,
      is_invalid: rowData.is_invalid,
    });
  });

  return options_by_mf;
};

export const makeObjectListIdArr = (
  object_list: PropsCreatingMap['object_list'],
) => {
  return object_list.map(({ object_id }) => Number(object_id));
};

export const makeObjByGeo = (
  type: PropsCreatingMap['type'],
  object_id: number,
  geo: OneGeozoneMunicipalFacility,
) => {
  if (geo) {
    return {
      name: geo.name,
      object_id: Number(geo.id),
      state: geo.state,
      type: routeTypesByKey[type].slug,
    };
  }
  // tslint:disable-next-line
  console.warn('not found geo for', object_id);

  return null;
};

export const makeObjectListByObjectListIdArr = (
  ObjectListIdArr: number[],
  object_list: PropsCreatingMap['object_list'],
  type: PropsCreatingMap['type'],
  geozone_municipal_facility_by_id: StateCreatingMap['geozone_municipal_facility_by_id'],
) => {
  const objectIndex = keyBy(object_list, 'object_id');

  return ObjectListIdArr.reduce((ObjectList, object_id) => {
    const objData = objectIndex[object_id];

    if (objectIndex[object_id]) {
      ObjectList.push(objData);
    } else {
      const newObjectData = makeObjByGeo(
        type,
        object_id,
        geozone_municipal_facility_by_id[object_id],
      );
      if (newObjectData) {
        newObjectData.state = polyState.SELECTED;
        ObjectList.push(newObjectData);
      }
    }

    return ObjectList;
  }, []);
};

export const mergeLineIntoInputLines = (
  input_lines: PropsCreatingMap['input_lines'],
  line: any,
) => {
  return input_lines.map((lineData) => {
    if (lineData.object_id === line.object_id) {
      return line;
    }

    return lineData;
  });
};

export const setNameForPointByIndex = (
  objectList: PropsCreatingMap['object_list'],
  index: number,
  value: string,
) => {
  return objectList.map((d, i) => {
    if (i === index) {
      return {
        ...d,
        name: value,
      };
    }

    return d;
  });
};

export let cachedDataForRoute = Object.keys(routeTypesByKey).reduce(
  (newObj, key) => {
    newObj[key] = {
      object_list: [],
      input_lines: [],
    };

    return newObj;
  },
  {},
);

export const setCacheDataForRoute = (type, objValue) => {
  cachedDataForRoute[type] = objValue;
};

export const getCacheDataForRoute = (type) => {
  return cachedDataForRoute[type];
};

export const resetCachedDataForRoute = () => {
  cachedDataForRoute = Object.keys(routeTypesByKey).reduce((newObj, key) => {
    newObj[key] = {
      object_list: [],
      input_lines: [],
    };

    return newObj;
  }, {});
};
