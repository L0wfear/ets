import {
  FutureMissionsItemsByTypeType,
} from 'components/dashboard/new/redux-main/modules/dashboard/@types/future-mission.h';

export type PropsListByTypeMission = {
  title: string;
  items: FutureMissionsItemsByTypeType[];
  titleKey: string;
  itemsKey: string;
  handleClick: React.MouseEventHandler<HTMLLIElement>;
}