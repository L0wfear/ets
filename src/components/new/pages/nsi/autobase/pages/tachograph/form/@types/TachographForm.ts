import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { HandleThunkActionCreator } from 'react-redux';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { actionGetTachographList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/actions';

export type StatePropsTachograph = {};
export type OwnTachographProps = WithFormRegistrySearchAddProps<TachographListWithOuterProps> & {
  actionGetTachographsList: HandleThunkActionCreator<typeof actionGetTachographList>;
};

export type PropsTachographWithForm = StatePropsTachograph &
  OwnTachographProps &
  WithSearchProps;

export type PropsTachograph = OutputWithFormProps<
  PropsTachographWithForm,
  TachographListWithOuterProps,
  [TachographListWithOuterProps],
  any
>;
export type OneTabDataCommon = {
  tabKey: string;
  title: string;
};

export type DefaultOwnPropsToBodyRoute = OneTabDataCommon & {
  isActive: boolean;
  tabHasErrors: boolean;
};
