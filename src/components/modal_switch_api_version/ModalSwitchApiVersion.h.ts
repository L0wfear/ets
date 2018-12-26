import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DispatchProp } from 'react-redux';

export type StatePropsModalSwitchApiVersion = {
  appConfig: InitialStateSession['appConfig'];
};
export type DispatchPropsModalSwitchApiVersion = DispatchProp;
export type OwnPropsModalSwitchApiVersion = {
  onHide: () => void;
};

export type NoneVersionOption = {
  value: number;
  label: string;
};

export type DefaultVersionOption = {
  value: string;
  label: string;
};

export type OneOptionInStateModalSwitchApiVersion = NoneVersionOption | DefaultVersionOption;

export type StateModalSwitchApiVersion = {
  value: OneOptionInStateModalSwitchApiVersion['value'];
  appConfig: InitialStateSession['appConfig'];
  options: OneOptionInStateModalSwitchApiVersion[];
};
export type PropsModalSwitchApiVersion = (
  StatePropsModalSwitchApiVersion
  & DispatchPropsModalSwitchApiVersion
  & OwnPropsModalSwitchApiVersion
);
