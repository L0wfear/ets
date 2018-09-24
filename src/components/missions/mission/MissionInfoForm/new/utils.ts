import { diffDates } from 'utils/dates';
import {
  IComponentWillUnmount,
  IComponentWillReceiveProps,
  IComponentDidMount,
} from 'components/missions/mission/MissionInfoForm/types.h';

const VALUE_FOR_FIXED = {
  TWO_F: {
    val: 2,
    list: [
      'кв. м.',
      'м.',
    ],
  },
  THREE_F: {
    val: 3,
    list: [
      'км',
    ],
  },
  floatFixed: (data, val) => parseFloat(data).toFixed(val),
};

const checkFixed = (data, key) => {
  const clone = [...data];

  if (VALUE_FOR_FIXED[key].list.includes(data[1])) {
    clone[0] = VALUE_FOR_FIXED.floatFixed(clone[0], VALUE_FOR_FIXED[key].val);
  }

  return clone;
};

const getDataTraveledYet = (data) => {
  if (data === null) {
    return 0;
  }
  if (Array.isArray(data)) {
    return data.join(' ');
  }

  return !isNaN(parseInt(data, 10)) ? parseInt(data, 10) : '-';
};


export const componentWillUnmount: IComponentWillUnmount = props => {
  if (!props.tooLongDates) {
    props.flux.getActions('pointsHybrid').closeConnection();
    props.flux.getActions('pointsHybrid').setSingleCarTrack(null);
  }
};

export const componentWillReceiveProps: IComponentWillReceiveProps = props => {
  let { track: { time_of_parking: parkingCount } } = props;
  parkingCount = parkingCount === undefined ? -1 : Number(parkingCount);

  if (parkingCount !== props.parkingCount) {
      props.setparkingCount(parkingCount);
  }
};

export const componentDidMount: IComponentDidMount = async props => {
  const {
    formState: {
      mission_data,
      car_data,
      route_data,
      report_data,
    },
    flux,
    fromMonitor,
  } = props;

  if (!props.tooLongDates) {
    flux.getActions('pointsHybrid').createConnection();
    flux.getActions('pointsHybrid').setSingleCarTrack(car_data.gov_number);
    flux.getActions('pointsHybrid').setSingleCarTrackDates([mission_data.date_start, mission_data.date_end]);
  }

  const missionReport = report_data.entries || [];

  const selectedObjects = missionReport.filter(p => p.status === 'success');
  if (report_data.check_unit) {
    missionReport.forEach(report => (report.route_check_unit = report_data.check_unit));
  }

  props.multyChange({ missionReport, selectedObjects });

  const {
    has_mkad,
  } = route_data

  const [route] = await Promise.all([
    flux.getActions('routes').getRouteById(route_data.id, true),
    flux.getActions('geoObjects').getGeozones(),
    has_mkad && !fromMonitor ? flux.getActions('geoObjects').getOdhMkad() : Promise.resolve(),
  ]);


  props.multyChange({ route });
}


export const handleSelectedElementChange = props => selectedElementId => props.multyChange({ selectedElementId, selectedPoly: props.geozonePolys[selectedElementId] });

export const initialState = {
  selectedElementId: null,
  selectedPoint: null,
  selectedPoly: undefined,
  missionReport: [],
  selectedObjects: [],
  parkingCount: -1,
  route: {},
  tooLongDates: ({ formState: { mission_data } }) => diffDates(mission_data.date_end, mission_data.date_start, 'days') > 10,
  number: ({ formState: { mission_data } }) => mission_data.number,
  routeType: ({ formState: { route_data: { type: routeType } } }) => routeType,
  traveled_percentage: ({ formState: { mission_data: { traveled_percentage } } }) => traveled_percentage,
  mkad_speed_lim: ({ formState: { speed_limits: { mkad_speed_lim } } }) => mkad_speed_lim,
  has_mkad: ({ formState: { route_data: { has_mkad } } }) => has_mkad,
  speed_lim: ({ formState: { speed_limits: { speed_lim } } }) => speed_lim,
  object_type_name: ({ formState: { route_data: { object_type_name } } }) => object_type_name,
  withWorkSpeed: ({ formState: { report_data }}) => getDataTraveledYet([
    ...checkFixed([report_data.traveled_raw, report_data.check_unit], 'TWO_F'),
    report_data.time_work_speed,
  ]),
  withHightSpeed: ({ formState: { report_data }}) => getDataTraveledYet([
    ...checkFixed([report_data.traveled_high_speed, report_data.check_unit], 'TWO_F'),
    report_data.time_high_speed,
  ]),
  sensor_traveled_working: ({ formState: { mission_data: { sensor_traveled_working } } }) => sensor_traveled_working,
  allRunWithWorkEquipment: ({ formState: { mission_data: { sensor_traveled_working } } }) => getDataTraveledYet(
    checkFixed([sensor_traveled_working / 1000, 'км'], 'THREE_F')
  ),
  gov_number: ({ formState: { car_data: { gov_number } }}) => gov_number,
}