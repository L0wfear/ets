import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';

export type StatePropsCarFuelChart = {
  has_cars_sensors: boolean;
  front_cars_sensors_level: IStateMonitorPage['carInfo']['trackCaching']['front_cars_sensors_level'];
  track: IStateMonitorPage['carInfo']['trackCaching']['track'];
};

export type DispatchPropsCarFuelChart = {};
export type OwnPropsCarFuelChart = {
  handleChartClick: any;
  handleEventClick: any;
};

export type PropsCarFuelChart = (
  StatePropsCarFuelChart
  & DispatchPropsCarFuelChart
  & OwnPropsCarFuelChart
);

export type StateCarFuelChart = {
  sensorRawData: boolean;
};

export type StatePropsCarSpeedChart = {
  track: any;
  lastPoint: any;
  has_cars_sensors: boolean;
  front_cars_sensors_equipment: IStateMonitorPage['carInfo']['trackCaching']['front_cars_sensors_equipment'];
  mkad_speed_lim: number;
  speed_lim: number;
};

export type DispatchPropsCarSpeedChart = {};
export type OwnPropsCarSpeedChart = {
  handleChartClick: any;
};

export type PropsCarSpeedChart = (
  StatePropsCarSpeedChart
  & DispatchPropsCarSpeedChart
  & OwnPropsCarSpeedChart
);

export type StateCarSpeedChart = {
  lastPoint: any;
  data: Array<any>;
  front_cars_sensors_equipment: IStateMonitorPage['carInfo']['trackCaching']['front_cars_sensors_equipment'];
  mkad_speed_lim: number;
  speed_lim: number;
};
