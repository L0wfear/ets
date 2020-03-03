import { TechMaintOrder, IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsTechMaintOrder = {
  techMaintTypeList: IStateAutobase['techMaintTypeList'];
  measureUnitRunList: IStateAutobase['measureUnitRunList'];
  specialModelList: IStateSomeUniq['specialModelList'];
};
export type DispatchPropsTechMaintOrder = {
  measureUnitRunGetAndSetInStore: (tech_maintenance_type_id: TechMaintOrder['tech_maintenance_type_id']) => any;
  actionGetAndSetInStoreSpecialModel: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreSpecialModel>;
};
export type OwnTechMaintOrderProps = WithFormRegistrySearchAddProps<TechMaintOrder>;

export type PropsTechMaintOrderWithForm = (
  StatePropsTechMaintOrder
  & DispatchPropsTechMaintOrder
  & OwnTechMaintOrderProps
);

export type PropsTechMaintOrder = OutputWithFormProps<
  PropsTechMaintOrderWithForm,
  TechMaintOrder,
  [ TechMaintOrder ],
  any
>;

export type StateTechMaintOrder = {
};
