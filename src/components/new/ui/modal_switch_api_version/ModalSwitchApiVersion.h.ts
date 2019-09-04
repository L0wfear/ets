import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { DispatchProp } from 'react-redux';

export type StatePropsModalSwitchApiVersion = {
  appConfig: InitialStateSession['appConfig'];
  appConfigTracksCaching: InitialStateSession['appConfigTracksCaching'];
};
export type DispatchPropsModalSwitchApiVersion = DispatchProp;
export type OwnPropsModalSwitchApiVersion = {
  onHide: () => void;
};

export type NoneVersionOption = {
  value: number | null;
  label: string;
};

export type DefaultVersionOption = {
  value: string;
  label: string;
};

export type OneOptionInStateModalSwitchApiVersion = NoneVersionOption | DefaultVersionOption;

export type StateModalSwitchApiVersion = {
  serviceValue: OneOptionInStateModalSwitchApiVersion['value'];
  tracksCachingValue: OneOptionInStateModalSwitchApiVersion['value'];
};
export type PropsModalSwitchApiVersion = (
  StatePropsModalSwitchApiVersion
  & DispatchPropsModalSwitchApiVersion
  & OwnPropsModalSwitchApiVersion
);
