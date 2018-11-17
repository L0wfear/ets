import { flow as flow_fp } from 'lodash/fp';
import { withProps } from 'recompose';
import withMergeProps from 'components/compositions/vokinda-hoc/with-merge-props/WithMergeProps';

import {
  dateTimeFormatter,
  onChangeWithKeys,
  multiSelectFormatter,
} from 'components/compositions/hoc';

import {
  fileFormatter,
  fileCountLimiter,
} from 'components/compositions/file-input';

import BaseField from 'components/ui/Field';

// что-то не зашло
const flow: any = flow_fp;

const BaseDataTimeField = withProps({
  type: 'date',
})(BaseField);

const BaseFileField = withProps({
  type: 'file',
})(BaseField);

const BaseMultiSelectField = withProps({
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
