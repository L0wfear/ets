import * as React from 'react';
import {
  IDataTableSchema,
  ISchemaRenderer,
  IDataTableColSchema,
} from 'components/ui/table/@types/schema.h';

import { ExtField } from 'components/ui/new/field/ExtField';
import { isNumber } from 'util';

type PropsFieldsData = {
  element: object;
  meta: IDataTableSchema;
  renderers: ISchemaRenderer;
};

class FieldsData extends React.PureComponent<PropsFieldsData, {}> {
  mapRow = ({ name, displayName }: IDataTableColSchema) => {
    const {
      element,
      renderers,
    } = this.props;

    if (renderers && renderers[name]) {
      return (
        <div key={name}>
          <ExtField
            type="string"
            value={renderers[name]({ data: element[name], rowData: element })}
            label={`${displayName}:`}
            readOnly
          />
        </div>
      )
    }
    return (
      <div key={name}>
        <ExtField
          type="string"
          value={isNumber(element[name]) || element[name] ? element[name] : '-'}
          label={`${displayName}:`}
          readOnly
        />
      </div>
    )
  }
  render() {
    return (
      <>
        {this.props.meta.cols.map(this.mapRow)}
      </>
    )
  }
}

export default FieldsData;
