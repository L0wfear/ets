import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';

export type PropsCarFieldBytextInput = {
  carFilterText: string;
  canFocusOnCar: boolean;
  changeCarFilterText: any;
  geoobjectsFilter: IStateMonitorPage['geoobjectsFilter'];
  resetCarFilterText: React.MouseEventHandler<any>;
  handleFocusOnCar: React.MouseEventHandler<HTMLDivElement>;
};

export type StateCarFieldBytextInput = {};

export namespace CarFieldBytextInputUtils {
  export type ChangeCarFilterText = React.ChangeEvent<HTMLInputElement>;
  export type HandleFocusOnCar = React.MouseEventHandler<HTMLDivElement>;
}
