import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

export type PropsInspectContainerFormLazy = {
  element: Partial<InspectContainer> | null;
  onFormHide: OnFormHideType;
  readOnly?: boolean;
  loadingPageName?: string;
  page?: string;
  path?: string;

};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsInspectContainer = {
};

export type DispatchPropsInspectContainer = {
};
export type OwnInspectContainerProps = {
  element: Partial<InspectContainer> | null;
  handleHide: OnFormHideType;
  readOnly?: boolean;
  page: string;
  path?: string;
};

export type PropsInspectContainerWithForm = StatePropsInspectContainer &
  DispatchPropsInspectContainer &
  OwnInspectContainerProps;

export type PropsInspectContainerForm = OutputWithFormProps<
  PropsInspectContainerWithForm,
  InspectContainer,
  any,
  any
>;
