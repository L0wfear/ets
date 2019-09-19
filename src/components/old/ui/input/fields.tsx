import { flow as flow_fp } from 'lodash/fp';
import { withProps } from 'recompose';

import {
  dateTimeFormatter,
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
)(BaseDataTimeField);

export const MultiSelectField = flow(
  multiSelectFormatter,
)(BaseMultiSelectField);

export const FileField: React.ComponentType<{ boundKeys: string } & Record<string, any>> = flow(
  fileCountLimiter,
  fileFormatter,
)(BaseFileField);
