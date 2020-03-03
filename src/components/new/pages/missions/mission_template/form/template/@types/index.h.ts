import { HandleThunkActionCreator } from 'react-redux';

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { GetMapImageInBase64ByKeyType } from 'components/new/ui/map/context/MapetsContext.h';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsMissionTemplate = {
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
} & ReturnType<typeof getSessionStructuresParams>;

export type DispatchPropsMissionTemplate = {
  actionPrintFormMissionTemplate: HandleThunkActionCreator<
    typeof missionsActions.actionPrintFormMissionTemplate
  >;
};

export type OwnMissionTemplateProps = WithFormRegistrySearchAddProps<MissionTemplate>;

export type PropsMissionTemplateWithForm = StatePropsMissionTemplate &
  DispatchPropsMissionTemplate &
  OwnMissionTemplateProps & {
    getMapImageInBase64ByKey: GetMapImageInBase64ByKeyType;
  };

export type PropsMissionTemplateForm = OutputWithFormProps<
  PropsMissionTemplateWithForm,
  MissionTemplate,
  any,
  any
>;
