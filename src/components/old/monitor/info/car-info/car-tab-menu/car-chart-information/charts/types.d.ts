export type TypeFrontCarsSensorsLevel = {
  [key: string]: {
    data: any[];
    show: boolean;
    color: string;
    connectNulls: number;
    name: string;
  };
};

export type StatePropsCarFuelChart = {
  track: any[];
  has_cars_sensors: boolean;
  front_cars_sensors_level: TypeFrontCarsSensorsLevel;
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
  sensorRawData: boolean,
};

export type StatePropsCarSpeedChart = {
  track: any;
  lastPoint: any;
  has_cars_sensors: boolean;
  front_cars_sensors_equipment: TypeFrontCarsSensorsEquipment;
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

export type TypeFrontCarsSensorsEquipment = {
  [key: string]: {
    data: any[];
    type_name: string;
    color: string;
    connectNulls: number;
    name: string;
    show: boolean;
  };
};

export type StateCarSpeedChart = {
  lastPoint: any,
  data: any[],
  front_cars_sensors_equipment: TypeFrontCarsSensorsEquipment;
  mkad_speed_lim: number;
  speed_lim: number;
};
