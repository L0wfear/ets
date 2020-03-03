import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

export type MissionTemplateCreating = (
  {
    missionTemplates: Record<string, MissionTemplate>;
    assign_to_waybill: Record<string, Array<string>>;
  } & Partial<
    Pick<
      Mission,
      'mission_source_id' | 'mission_source_name' | 'date_start' | 'date_end' | 'passes_count'
    >
  >
);

export type PropsMissionTemplateWithForm = {
  element: Partial<MissionTemplateCreating>;
  handleHide: (isSubmitted: boolean, result?: any) => void;

  page: string;
  path?: string;
};

export type PropsMissionTemplateCreatingForm = OutputWithFormProps<
  PropsMissionTemplateWithForm,
  MissionTemplateCreating,
  any,
  any
>;
