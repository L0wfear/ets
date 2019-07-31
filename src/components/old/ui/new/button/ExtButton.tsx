import EtsBootstrap from 'components/new/ui/@bootstrap';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import withMergeProps from 'components/old/compositions/vokinda-hoc/with-merge-props/WithMergeProps';

export const ExtButton: any = onChangeWithKeys(
  withMergeProps(
    ({ boundKeys, ...props }) => props,
  )(EtsBootstrap.Button as any),
);
