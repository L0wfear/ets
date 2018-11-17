import {
  CarInWorkOverallItemsType,
  CarInWorkOverallInfoDataType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';

export type PropsCarInWorkOverall = {
  items: CarInWorkOverallItemsType[];
  setInfoData: (infoData: CarInWorkOverallInfoDataType) => any;
};

export type StateCarInWorkOverall = {
};
