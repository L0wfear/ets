// import withFormContext from 'components/@next/@form/hook/withFormContext';
// import { waybillFormSchema } from './schema';
// import maintenanceWorkPermissions from '../../_config-data/permissions';
// import { getDefaultWaybillElement } from './utils';
// import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
// import { submitWaybill, promiseGetWaybillById } from 'redux-main/reducers/modules/waybill/promises/waybill_promises';
// import { WaybillFormStoreType } from './@types';
// import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

// /**
//  * Статусы берём селекторами (useFormDataIsClosed)
//  */
// export default withFormContext<WithFormRegistrySearchAddProps<Partial<Waybill>>, Waybill>(
//   (props) => ({
//     key: 'waybill_form',
//     uniqField: 'id',
//     mergeElement: getDefaultWaybillElement,
//     schema: waybillFormSchema,
//     permissions: maintenanceWorkPermissions,

//     loadItemPromise: promiseGetWaybillById,
//     handleSubmitPromise: submitWaybill,
//     bsSizeForm: 'large',

//     handleHide: props.handleHide,
//     meta: {
//       page: props.page,
//       path: props.path,
//     },

//     store: {
//       mission_reject_list: {
//         value: [],
//         isLoading: false,
//       },
//       mission_list: {
//         value: [],
//         isLoading: false,
//       },
//       structure_id: {
//         options: [],
//         isLoading: false,
//       },
//       employee: {
//         listIndex: {},
//         options: [],
//         isLoading: false,
//       },
//       carActualList: {
//         options: [],
//         isLoading: false,
//       },
//       employeeBindedToCar: {
//         list: [],
//         isLoading: false,
//       },
//       medicalStatsAllowedDrivers: {
//         list: [],
//         isLoading: false,
//       },
//       workModeOptions: {
//         options: [],
//         isLoading: false,
//       },
//       carRefillFuelCardsOptions: {
//         listIndex: {},
//         options: [],
//         isLoading: false,
//       },
//       fuelCardsList: {
//         list: [],
//         isLoading: false,
//       },
//       refillTypeList: {
//         list: [],
//         isLoading: false,
//       },
//       refillTypeOptions: {
//         options: [],
//         isLoading: false,
//       },
//     },
//   }),
// );
// <<< в 33 добавить
// - https://gost-jira.atlassian.net/browse/DITETSSUP-1844
// - https://gost-jira.atlassian.net/browse/DITETS19-1168
// - https://gost-jira.atlassian.net/browse/DITETS19-1345
// - https://gost-jira.atlassian.net/browse/DITETSSUP-2623
// - https://gost-jira.atlassian.net/browse/DITETSSUP-1903

import * as React from 'react';

export default () => <div>Waybill</div>;
