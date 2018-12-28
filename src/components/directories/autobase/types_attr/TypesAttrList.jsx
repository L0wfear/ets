import * as React from 'react';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import CarTypesTable from 'components/directories/autobase/types_attr/TypesAttrTable';

@connectToStores(['objects'])
@exportable({ entity: 'types_attr' })
@staticProps({
  entity: 'types_attr',
  listName: 'typesAttrList',
  tableComponent: CarTypesTable,
})
class TypesAttrList extends ElementsList {
  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getTypesAttr();
  }
}

export default TypesAttrList;
