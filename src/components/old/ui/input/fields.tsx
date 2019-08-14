import { flow as flow_fp } from 'lodash/fp';
import { withProps } from 'recompose';
import withMergeProps from 'components/old/compositions/vokinda-hoc/with-merge-props/WithMergeProps';

import {
  dateTimeFormatter,
  onChangeWithKeys,
  multiSelectFormatter,
} from 'components/old/compositions/hoc';

import {
  fileFormatter,
  fileCountLimiter,
} from 'components/old/compositions/file-input';

import BaseField from 'components/@next/@ui/renderFields/Field';

// что-то не зашло
const flow: any = flow_fp;

const BaseDataTimeField = withProps<{type: string}, any>({
  type: 'date',
})(BaseField);

const BaseFileField = withProps<{type: string}, any>({
  type: 'file',
})(BaseField);

const BaseMultiSelectField = withProps<{type: string, multi: boolean}, any>({
  type: 'select',
  multi: true,
})(BaseField);

export const DataTimeField = flow(
  dateTimeFormatter,
  onChangeWithKeys,
)(BaseDataTimeField);

export const MultiSelectField = flow(
  multiSelectFormatter,
  onChangeWithKeys,
)(BaseMultiSelectField);

export const FileField = flow(
  fileCountLimiter,
  fileFormatter,
  onChangeWithKeys,
)(BaseFileField);

export const Field = onChangeWithKeys(withMergeProps(
  (props) => Object.keys(props).reduce((newProps, key) => {
    if (key !== 'boundKeys') {
      newProps[key] = props[key];
    }

    return newProps;
  }, {}),
)(BaseField));
