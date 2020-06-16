import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import PrintByDates from 'components/new/ui/modal/print_by_dates/PrintByDates';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { registyLoadPrintForm, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getToday0am, createValidDateTime, getToday2359 } from 'components/@next/@utils/dates/dates';

type PropsButtonExportMission = CommonTypesForButton & {};

const ButtonExportMission: React.FC<PropsButtonExportMission> = (props) => {
  const [isOpenModalRemove, setIsOpenModalRemove] = React.useState(false);

  const dispatch = etsUseDispatch();
  const handleClickOpenForm = React.useCallback(
    () => {
      setIsOpenModalRemove(true);
    },
    [],
  );
  const handleClickCloseForm = React.useCallback(
    () => {
      setIsOpenModalRemove(false);
    },
    [],
  );
  const handleExport = React.useCallback(
    async ({ date_from, date_to }) => {
      const payload = {
        getBlobData: {
          date_from,
          date_to,
        },
      };

      await dispatch(
        actionChangeGlobalPaylaodInServiceData(props.registryKey, payload, false),
      );
      await dispatch(
        registyLoadPrintForm(props.registryKey, true),
      );
      setIsOpenModalRemove(false);
    },
    [],
  );

  const initial_date_from = React.useMemo(() => createValidDateTime(getToday0am()), []);
  const initial_date_to = React.useMemo(() => createValidDateTime(getToday2359()), []);

  return (
    <React.Fragment>
      <EtsBootstrap.Button
        id="regestry-download-alt"
        bsSize="small"
        onClick={handleClickOpenForm}
      >
        <EtsBootstrap.Glyphicon glyph="download-alt" />
      </EtsBootstrap.Button>
      {
        isOpenModalRemove && (
          <PrintByDates
            initial_date_from={initial_date_from}
            initial_date_to={initial_date_to}
            onHide={handleClickCloseForm}
            onExport={handleExport}
            title={`Печать ${props.registryKey === 'MissionArchive' ? 'архива' : 'журнала'} заданий`}
            time={true}
            helpText="В выгрузке будут задания, у которых дата начала или дата окончания попадает в указанный период, с учетом фильтрации"
          />
        )
      }

    </React.Fragment>
  );
};

export default ButtonExportMission;
