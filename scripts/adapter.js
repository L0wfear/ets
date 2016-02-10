import _ from 'lodash';
import config from './config.js';
import { getStartOfToday, makeUnixTime } from './utils/dates.js';
import { wrapCoords, swapCoords } from './utils/geo.js';

import { loadCustomers } from './customers.js';
import { loadTypes } from './types.js';
import { loadModels } from './models.js';
import { loadOkrugs } from './okrugs.js';
import { loadOwners } from './owners.js';


let getUrl = (url) => config.backend ? config.backend + url : url;
let getOldUrl = (url) => config.backendOld ? config.backendOld + url : url;
let getServiceUrl = (url) => config.servicesBackend ? config.servicesBackend + url : url;
let toFormData = (data) => {
  const formData = new FormData();
  _.mapKeys(data, (v, k) => {
    formData.append(k, v);
  });
  return formData;
};

let toUrlWithParams = (url, data) => {
  let params = '?';
  _.mapKeys(data, (v, k) => {
    if (_.isArray(v)) {
      // v.map( (el, i) => {
      //   if (_.isObject(el)) {
      //     _.mapKeys(el, (innerV, innerK) => {
      //       params += `${k}[${i}][${innerK}]=${encodeURIComponent(innerV)}&`;
      //     });
      //   }
      // });
      if (k === 'taxes') {
        const taxes = {'taxes':v};
        params += `data=${encodeURIComponent(JSON.stringify(taxes))}&`
      }

    } else {
      params += `${k}=${encodeURIComponent(v)}&`;
    }
  });
  return `${url}${params}`;
};

const POINTS_URL = getUrl('/data');
const TRACK_URL = getOldUrl('/tracks/');
const WEATHER_URL = getUrl('/weather/');
const GEO_OBJECTS_URL = getUrl('/geo_objects/');
const ROADS_ACTUAL_URL = getUrl('/roads_actual/');
const GET_ROAD_BY_ODH_URL = getUrl('/road_info/');
const CARS_INFO_URL = getUrl('/cars_info/');
const CARS_BY_OWNER_URL = getUrl('/cars_by_owner/');
const FUEL_OPERATIONS_URL = getUrl('/fuel_operations/');
const FUEL_CONSUMPTION_RATE_URL = getUrl('/fuel_consumption_rates/');
const LOGIN_URL = getUrl('/auth/');
const AUTH_CHECK_URL = getUrl('/auth_check');
const WAYBILL_URL = getUrl('/waybill/');
const CARS_ACTUAL_URL = getUrl('/car_actual/');
const CARS_GARAGE_NUMBER_URL = getUrl('/car_garage_number/');
const CARS_ADDITIONAL_INFO_URL = getUrl('/car_additional_info/');
const EMPLOYEE_URL = getUrl('/employee/');
const FUEL_TYPES_URL = getUrl('/fuel_type/');
const ROUTE_URL = getUrl('/route/');
const TECH_OPERATIONS_URL = getUrl('/technical_operation/');
const ODHS_URL = getUrl('/odh/');
const WORK_KINDS_URL = getUrl('/work_kind/');
const MISSIONS_URL = getUrl('/mission/');
const MISSION_SOURCES_URL = getUrl('/mission_source/');
const MISSION_TEMPLATES_URL = getUrl('/mission_template/');
const ROUTES_URL = getUrl('/route/');
const ROUTES_VECTOR_URL = getUrl('/route_vector/');
const ROUTE_REPORTS_URL = getUrl('/route_odh_covering_report/');
const ODH_REPORTS_SERVICE_URL = getServiceUrl('/odh-reports/');
const ROUTE_VALIDATE_URL = getUrl('/route_validate/');
const MISSION_REPORTS_URL = getUrl('/car_odh_travel_report/');
const GEOZONE_URL = getUrl('/geozone/');
const DASHBOARD_URL = getUrl('/dashboard/');

function getJSON(url, data = {}) {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;
  }
  url = toUrlWithParams(url, data);

  return fetch(url, {credentials: 'include'}).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'GET');
      return new Promise((res, rej) => res(body));
    });
  });
}

function postJSON(url, data, type = 'form') {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;
  }
  let body;
  switch (type) {
    case 'form':
      url += '?token=' + token;
      delete data.token;
      body = toFormData(data);
      break;
    case 'json':
      body = JSON.stringify(data);
      break;
    case 'params':
      body = "";
      url = toUrlWithParams(url, data);
      break;
  }

  const options = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      //'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: body,
  };

  return fetch(url, options).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'POST');
      return new Promise((res, rej) => res(body));
    });
  });
}

function putJSON(url, data, type = 'form') {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;//url += `?token=${token}`;
  }
  let body;
  switch (type) {
    case 'form':
      url += '?token=' + token;
      delete data.token;
      body = toFormData(data);
      break
    case 'json':
      body = JSON.stringify(data);
      break;
    case 'params':
      body = "";
      url = toUrlWithParams(url, data);
      break;
  }

  const options = {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      //'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: body,
  };

  return fetch(url, options).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'PUT');
      return new Promise((res, rej) => res(body));
    });
  });
}

function deleteJSON(url, data, type = 'form') {
  data = _.clone(data);
  const { flux } = window.__ETS_CONTAINER__;
  const token = flux.getStore('session').getSession();
  if (token) {
    data.token = token;
  }
  let body;
  switch (type) {
    case 'form':
      body = toFormData(data);
      break
    case 'json':
      body = JSON.stringify(data);
      break;
    case 'params':
      body = "";
      url = toUrlWithParams(url, data);
      break;
  }

  const options = {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: body,
  };

  return fetch(url, options).then( r => {
    return r.json().then(body => {
      checkResponse(url, r, body, 'DELETE');
      return new Promise((res, rej) => res(body));
    });
  });
}

function checkResponse(url, response, body, method) {
  if (url.indexOf('login') === -1) {
    const { flux } = window.__ETS_CONTAINER__;

    if (body && body.errors && body.errors.length) {
      const usedUrl = url.slice(0, url.indexOf('?') > -1 ? url.indexOf('?') : url.length);
      console.error(`ERROR /${method} ${usedUrl}`);
      body.errors.map( er => {
        console.error(er);
      })
    }

    if (response.status === 401) {
      console.warn('USER IS NOT AUTHORIZED');
      flux.getActions('session').logout({reason: 'no auth'});
    }
  }
}

export function checkToken(token) {
  return new Promise((res, rej) => {
    return getJSON(AUTH_CHECK_URL).then(r => {
      if (r.errors.length) {
        console.log('TOKEN EXPIRED');
        rej(401);
      } else {
        console.log('TOKEN IS OK');
        res();
      }
    });
  });
}

export function login(user) {
  return fetch(LOGIN_URL, {method: 'POST', body: toFormData(user)}).then(r => r.json());
}

export function logout() {
  return new Promise((res, rej) => {
    res();
  });
}

export function getAllPoints() {
  return fetch(POINTS_URL, config.REQUEST_PARAMS).then(r => r.json());
}

// возвращает инфу для графика уровня топлива
export function getFuelData(from_dt = getStartOfToday(), to_dt = new Date().getTime(), car_id) {
  return fetch(config.backend + '/fuel/' + car_id + '/?from_dt=' + makeUnixTime(from_dt) + '&to_dt=' + makeUnixTime(to_dt))
    .then(r => r.json())
    .then(r => r.map(data => data[1]))
}

export function init() {
  console.warn('INIT');
  // @todo вся нужная для инициализации внешнего апи хрень здесь
  return Promise.all([
          //loadCustomers(),
          //loadModels(),
          //loadOwners(),
          //loadOkrugs(),
          loadTypes()
        ])
        //.then(getRoutes);
}

export function getWaybills() {
  return getJSON(WAYBILL_URL);
}

export function getCars(payload) {
  console.info('GETTING CARS');
  return getJSON(CARS_ACTUAL_URL, payload);
}

export function updateCarAdditionalInfo(data) {
  return postJSON(CARS_ADDITIONAL_INFO_URL, data, 'params').then( () => {
    return getCars();
  });
}

export function getEmployees() {
  return getJSON(EMPLOYEE_URL);
}

export function updateEmployee(employee) {
  return putJSON(EMPLOYEE_URL, employee, 'params').then( () => {
    return getEmployees();
  });
}

export function removeWaybill(payload) {
  return deleteJSON(WAYBILL_URL, payload, 'params').then( () => {
    return getWaybills();
  });
}

export function updateWaybill(waybill) {
  return putJSON(WAYBILL_URL, waybill, 'params').then( () => {
    return getWaybills();
  });
}

export function createWaybill(waybill) {
  return postJSON(WAYBILL_URL, waybill, 'params').then( () => {
    return getWaybills();
  });
}

export function getFuelOperations() {
  return fetch(FUEL_OPERATIONS_URL).then(r => r.json());
}

export function getFuelRatesByCarModel(car_model_id) {
  return getJSON(FUEL_CONSUMPTION_RATE_URL, { car_model_id });
}

export function getTrack(car_id, from_dt, to_dt) {

  let query = '/?from_dt=' + makeUnixTime(from_dt) +
    '&to_dt=' + makeUnixTime(to_dt) +
    '&version=2';

  console.log('track loading for', car_id);
  return fetch(TRACK_URL + car_id + query, {
    credentials: 'include'
  }).then(r => r.json())
    .then(points => points.map((point) => {
        // wrap coords for OpenLayers
        point.coords = swapCoords(point.coords);
        point.coords_msk = swapCoords(point.coords_msk);
        return point;
      })
    );

}

export function getCarImage(car_id, type_id, model_id) {
  return fetch(config.backend + `/car_image?model_id=${model_id}&car_id=${car_id}&type_id=${type_id}`)
        .then(r => r.json())
}

export function getWeather() {
  return fetch(WEATHER_URL).then(r => r.json());
}

// возвращает список ОДХ по координатам
export function getGeoObjectsByCoords([lat, lon], d = 5) {
  let mskQuery = '?d=' + d + '&x_msk=' + lat + '&y_msk=' + lon;
  let query = '?d=' + d + '&lat=' + lat + '&lon=' + lon;
  return fetch(GEO_OBJECTS_URL + mskQuery).then(r => r.json())
}

// возвращает список всех доступных ОДХ
export function getRoadsActual() {
  return fetch(ROADS_ACTUAL_URL).then(r => r.json());
}

// возвращает инфу по ОДХ
let ODH_CACHE = {};
export function getRoadByODHId(id) {
  if (ODH_CACHE[id] === undefined) {
    let query = '?road_id=' + id;
    return fetch(GET_ROAD_BY_ODH_URL + query, {credentials: 'include'}).then(r => {
      ODH_CACHE[id] = r.json();
      return ODH_CACHE[id];
    });
  } else {
    return ODH_CACHE[id];
  }
}

// возвращает список всех доступных автомобилей
export function getCarsInfo() {
  return fetch(CARS_INFO_URL).then(r => r.json())
}


// TODO метод на бэкэнде
// пока возвращает промис из заглушки
export function getCarsByOwnerId(ownerId) {

  console.info('GETTING CARS BY OWNER ID');

  return getCars()

  let query = '?owner_id=' + ownerId;
  return fetch(CARS_BY_OWNER_URL + query).then(r => r.json())
}

export function getFuelRates() {
  return getJSON(FUEL_CONSUMPTION_RATE_URL);
}

export function updateFuelRate(newFuelRate) {
  return putJSON(FUEL_CONSUMPTION_RATE_URL, newFuelRate, 'params').then( () => {
    return getFuelRates();
  });
}

export function addFuelRate(newFuelRate) {
  return postJSON(FUEL_CONSUMPTION_RATE_URL, newFuelRate, 'params').then( () => {
    return getFuelRates();
  });
}

export function deleteFuelRate(rate) {
  return deleteJSON(FUEL_CONSUMPTION_RATE_URL, {id: rate.id}, 'params').then( () => {
    return getFuelRates();
  });
}

export function getFuelTypes() {
  return getJSON(FUEL_TYPES_URL);
}

export function getTechOperations() {
  return getJSON(TECH_OPERATIONS_URL);
}

export function getODHs() {
  return getJSON(ODHS_URL);
}

export function getWorkKinds() {
  return getJSON(WORK_KINDS_URL);
}

export function getMissions(payload) {
  return getJSON(MISSIONS_URL, payload, 'params');
}

export function getMissionSources() {
  return getJSON(MISSION_SOURCES_URL);
}

export function removeMission(payload) {
  return deleteJSON(MISSIONS_URL, payload, 'params').then( () => {
    return getMissions();
  });
}

export function updateMission(mission) {
  return putJSON(MISSIONS_URL, mission, 'params').then( () => {
    return getMissions();
  });
}

export function createMission(mission) {
  return postJSON(MISSIONS_URL, mission, 'params').then( () => {
    return getMissions();
  });
}

export function getMissionTemplates() {
  return getJSON(MISSION_TEMPLATES_URL);
}

export function createMissionTemplate(missionTemplate) {
  return postJSON(MISSION_TEMPLATES_URL, missionTemplate, 'params').then( () => {
    return getMissionTemplates();
  });
}

export function removeMissionTemplate(payload) {
  return deleteJSON(MISSION_TEMPLATES_URL, payload, 'params').then(() => getMissionTemplates());
}

export function updateMissionTemplate(mission) {
  return putJSON(MISSION_TEMPLATES_URL, mission, 'params').then( () => {
    return getMissionTemplates();
  });
}


// ROUTES

export function getRoutes() {
  return getJSON(ROUTES_URL);
}

export function getRoutesVector() {
  return getJSON(ROUTES_VECTOR_URL);
}

export function createRoute(route) {
  return postJSON(ROUTES_URL, route, 'params').then(() => getRoutes());
}

export function createVectorRoute(route) {
  return postJSON(ROUTES_VECTOR_URL, route, 'form').then(() => getRoutesVector());
}

export function removeRoute(payload) {
  return deleteJSON(ROUTES_URL, payload, 'params').then(() => getRoutes());
}

export function removeRouteVector(route) {
  return deleteJSON(ROUTES_VECTOR_URL, route, 'params').then(() => getRoutesVector());
}

export function updateRoute(payload) {
  return putJSON(ROUTES_URL, payload, 'form').then(() => getRoutes());
}

export function updateRouteVector(payload) {
  return putJSON(ROUTES_VECTOR_URL, payload, 'form').then(() => getRoutesVector());
}

export function getRouteById(payload) {
  return getJSON(ROUTES_URL, payload);
}

export function getRouteVectorById(payload) {
  return getJSON(ROUTES_VECTOR_URL, payload);
}

// SERVICES

export function getODHReports() {
  const payload = {
    page: 1,
    per_page: 50,
    sort_by: 'ID',
    order: 'desc'
  }
  return getJSON(ODH_REPORTS_SERVICE_URL, payload, 'params');
}

export function getRouteReports() {
  return getJSON(ROUTE_REPORTS_URL);
}

export function getRouteReportById(payload) {
  return getJSON(ROUTE_REPORTS_URL, payload);
}

export function createRouteReport(payload) {
  return postJSON(ROUTE_REPORTS_URL, payload, 'form').then(() => getRouteReports());
}

export function validateRoute(payload) {
  return getJSON(ROUTE_VALIDATE_URL, payload);
}

export function getMissionReports() {
  return getJSON(MISSION_REPORTS_URL);
}

export function getMissionReportById(payload) {
  return getJSON(MISSION_REPORTS_URL, payload);
}

export function createMissionReport(payload) {
  return postJSON(MISSION_REPORTS_URL, payload, 'form').then(() => getMissionReports());
}

export function getGeozones() {
  return getJSON(GEOZONE_URL);
}

// DASHBOARD //

export function getDashboardComponent(role, key, id) {
  return getJSON(`${DASHBOARD_URL}${key}/`).then(component => ({role, component, key, id}));
}
