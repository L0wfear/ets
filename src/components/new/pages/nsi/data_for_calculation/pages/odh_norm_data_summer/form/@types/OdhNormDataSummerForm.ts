import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { OdhNormDataSummer } from 'redux-main/reducers/modules/odh_norm_data_summer/@types/odhNormDataSummer';
import { HandleThunkActionCreator } from 'react-redux';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsOdhNormDataSummerFormLazy = {
  element: Partial<OdhNormDataSummer>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
} & WithSearchProps;

export type StatePropsOdhNormDataSummer = {};
export type DispatchPropsOdhNormDataSummer = {
  actionLoadMeasureUnit: HandleThunkActionCreator<typeof actionLoadMeasureUnit>;
};
export type OwnOdhNormDataSummerProps = {
  element: Partial<OdhNormDataSummer>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsOdhNormDataSummerWithForm = (
  StatePropsOdhNormDataSummer
  & DispatchPropsOdhNormDataSummer
  & OwnOdhNormDataSummerProps
);

export type PropsOdhNormDataSummer = OutputWithFormProps<
  PropsOdhNormDataSummerWithForm,
  OdhNormDataSummer,
  [ OdhNormDataSummer ],
  any
>;
