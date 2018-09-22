import {
  CarInWorkOverallInfoDataType,
} from 'components/dashboard/new/redux-main/modules/dashboard/@types/car-in-work-overall.h';


export type PropsCarInWorkOverallInfo = {
  infoData: CarInWorkOverallInfoDataType;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}