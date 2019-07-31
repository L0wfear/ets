import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { changeCompanyStructureIdNotyfication, addParentCompanyStructureIdNotyfication } from 'utils/notifications';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import useCompanyStructureLinearForUserOptions from 'components/new/utils/hooks/services/useOptions/useCompanyStructureLinearForUserOptions';

type FieldCompanyStructureIdProps = {
  value: Odh['company_structures'];
  error: string;
  handleChange: any;
  isPermitted: boolean;

  page: string;
  path: string;
};

const FieldCompanyStructureId: React.FC<FieldCompanyStructureIdProps> = React.memo(
  (props) => {
    const companyStructureOptionData = useCompanyStructureLinearForUserOptions();

    const handleChangeCompanyStructure = React.useCallback(
      (key, _, options: typeof companyStructureOptionData.options) => {
        global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);

        const companyStructureOptionDataObject = companyStructureOptionData.options.reduce(
          (newObj, { rowData }) => {
            newObj[rowData.id] = rowData;

            return newObj;
          },
          {},
        );

        const optionsObject = options.reduce(
          (newObj, { rowData }) => {
            newObj[rowData.id] = rowData;

            return newObj;
          },
          {},
        );

        const valueOldObj = props.value.reduce(
          (newObj, rowData) => {
            newObj[rowData.id] = rowData;

            return newObj;
          },
          {},
        );

        props.handleChange({
          [key]: options.reduce(
            (newValue, { rowData }) => {
              newValue.push({
                id: rowData.id,
                name: rowData.name,
              });

              if (rowData.parent_id && !optionsObject[rowData.parent_id] && !valueOldObj[rowData.parent_id]) {
                const parent = companyStructureOptionDataObject[rowData.parent_id];
                global.NOTIFICATION_SYSTEM.notify(addParentCompanyStructureIdNotyfication(parent.name, rowData.name));

                newValue.push({
                  id: parent.id,
                  name: parent.name,
                });
              }

              return newValue;
            },
            [],
          ),
        });
      },
      [props.handleChange, companyStructureOptionData, props.value],
    );

    const value = React.useMemo(
      () => {
        return props.value.map(({ id }) => id);
      },
      [props.value],
    );

    const isAllChecked = React.useMemo(
      () => {
        return !companyStructureOptionData.isLoading && companyStructureOptionData.options.length === value.length;
      },
      [value, companyStructureOptionData],
    );

    const handleSelectAll = React.useCallback(
      (key) => {
        if (isAllChecked) {
          handleChangeCompanyStructure(
            key,
            null,
            [],
          );
        } else {
          handleChangeCompanyStructure(
            key,
            null,
            companyStructureOptionData.options,
          );
        }
      },
      [isAllChecked, companyStructureOptionData, handleChangeCompanyStructure],
    );

    return (
      <React.Fragment>
        <ExtField
          id="data-no_status_docs"
          type="boolean"
          label="Выбрать все"
          value={isAllChecked}
          onChange={handleSelectAll}
          className="checkbox-input flex-reverse"
          disabled={!props.isPermitted || companyStructureOptionData.isLoading}
          boundKeys="company_structures"
        />
        <ExtField
          id="odh_company_structures"
          type="select"
          multi
          label="Подразделение"
          value={value}
          error={props.error}
          emptyValue={null}
          onChange={handleChangeCompanyStructure}
          boundKeys="company_structures"
          options={companyStructureOptionData.options}
          etsIsLoading={companyStructureOptionData.isLoading}
          disabled={!props.isPermitted}
        />
      </React.Fragment>
    );
  },
);

export default FieldCompanyStructureId;
