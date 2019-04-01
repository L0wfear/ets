import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DispatchProp } from 'react-redux';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export type ButtonCloseInspectAutobaseStateProps = {
  lastConductingInspect: InspectAutobase;
};
export type ButtonCloseInspectAutobaseDispatchProps = DispatchProp;

export type ButtonCloseInspectAutobaseOwnProps = {
  loadingPage: string;
};

export type ButtonCloseInspectAutobaseProps = (
  (
    ButtonCloseInspectAutobaseStateProps
    & ButtonCloseInspectAutobaseDispatchProps
    & ButtonCloseInspectAutobaseOwnProps
  )
  & WithSearchProps
);
