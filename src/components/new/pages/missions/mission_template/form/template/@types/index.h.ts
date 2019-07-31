export type PropsMissionTemplateFormLazy = {
  showForm: boolean;
  element: Partial<MissionTemplate> | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { HandleThunkActionCreator } from 'react-redux';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsMissionTemplate = {
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
} & ReturnType<typeof getSessionStructuresParams>;

export type DispatchPropsMissionTemplate = {
  actionPrintFormMissionTemplate: HandleThunkActionCreator<
    typeof missionsActions.actionPrintFormMissionTemplate
  >;
};
export type OwnMissionTemplateProps = {
  element: Partial<MissionTemplate> | null;
  handleHide: OnFormHideType;

  page: string;
  path?: string;
};

export type PropsMissionTemplateWithForm = StatePropsMissionTemplate &
  DispatchPropsMissionTemplate &
  OwnMissionTemplateProps & {
    getMapImageInBase64ByKey: any;
  };

export type PropsMissionTemplateForm = OutputWithFormProps<
  PropsMissionTemplateWithForm,
  MissionTemplate,
  any,
  any
>;
export type StateMissionTemplate = {};
