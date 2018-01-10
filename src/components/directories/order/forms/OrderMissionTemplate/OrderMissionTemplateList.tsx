import * as React from 'react';
import * as RB from 'react-bootstrap';
import { isEmpty } from 'lodash';

import { FluxContext, connectToStores } from 'utils/decorators';

import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import EtsSelect from 'components/ui/input/EtsSelect';

import MissionTemplateTable from 'components/directories/order/forms/OrderMissionTemplate/MissionTemplateTable';
import DutyMissionTemplateTable from 'components/directories/order/forms/OrderMissionTemplate/DutyMissionTemplateTable';

import { createMissions } from 'components/missions/mission_template/MissionTemplateFormWrap.jsx';
import { createDutyMissions } from 'components/missions/duty_mission_template/DutyMissionTemplateFormWrap.jsx';
import { employeeFIOLabelFunction } from 'utils/labelFunctions';

const ASSIGN_OPTIONS = [
  { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
  { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
  { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
];

const ModalTSX: any = RB.Modal;
const EtsSelectTSX: any = EtsSelect;

function getFilterDateOrder(technical_operations, { order_date, order_date_to }) {
  return technical_operations.reduce((newObj, to) => {
    const {
      norm_id,
      date_from,
      date_to,
      num_exec,
      order_operation_id,
    } = to;

    newObj[norm_id] = {
      date_to: date_to || order_date,
      date_from: date_from || order_date_to,
      num_exec,
      order_operation_id,
    };

    return newObj;
  }, {});
}

function getMissionListByFilter(missionsList, filterData, typeClick) {
  return missionsList.reduce((arr, m) => {
    const { norm_id, passes_count} = m;

    if (filterData[norm_id]) {
      const {
        date_to,
        date_from,
        num_exec,
        order_operation_id,
      } = filterData[norm_id];

      if (passes_count <= num_exec || typeClick === 'missionDutyTemplate') {
        arr.push({
          ...m,
          date_to,
          date_from,
          order_operation_id,
        });
      }
    }

    return arr;
  }, []);
}

interface ICheckedElements {
  [id: number]: any;
}

interface IStateOrderMissionTemplate {
  assign_to_waybill: string;
  missionsList: any[];
  selectedElement: void | any;
  checkedElements: ICheckedElements;
  structures: any[];
}

@connectToStores(['missions', 'session', 'employees'])
@FluxContext
class OrderMissionTemplate extends React.Component<any, IStateOrderMissionTemplate> {
  state: any = {
    assign_to_waybill: 'assign_to_new_draft',
    missionsList: [],
    selectedElement: undefined,
    checkedElements: {},
    structures: [],
  };

  componentDidMount() {
    const { technical_operations = [] } = this.props;
    const { orderDates, typeClick } = this.props;
    const { structures } = this.context.flux.getStore('session').getCurrentUser();

    const filterData = getFilterDateOrder(technical_operations, orderDates);

    this.getMissionsList().then(({ result = [] }) => {
      const missionsList = getMissionListByFilter(result, filterData, typeClick);

      this.setState({ missionsList, structures });
    });
  }

  getMissionsList() {
    const { flux } = this.context;
    const { typeClick } = this.props;
    const payload = {};

    switch (typeClick) {
      case 'missionTemplate': return flux.getActions('missions').getMissionTemplates(payload);
      case 'missionDutyTemplate': return flux.getActions('missions').getDutyMissionTemplates(payload).then(({ result }) => ({
        result: result.map(r => ({
          ...r,
          brigade_employee_names: (r.brigade_employee_id_list || []).map(({ employee_id }) => employeeFIOLabelFunction(flux)(employee_id)).join(', '),
        })),
      }));
      default: Promise.reject({ error: 'no typeClick' });
    }
  }

  handleChangeTypePrint = assign_to_waybill => {
    this.setState({ assign_to_waybill });
  }

  handleSubmit = () => {
    const {
      assign_to_waybill,
      checkedElements,
    } = this.state;
    const {
      mission_source_id,
      orderDates: {
        faxogramm_id,
      },
      technical_operations: [],
      typeClick,
    } = this.props;

    const queryList = Object.entries(checkedElements).map(([id, value]) => {
      const {
        date_from: date_start,
        date_to: date_end,
        num_exec: passes_count,
      } = value;

      const externalPayload = {
        mission_source_id,
        passes_count,
        date_start,
        date_end,
        assign_to_waybill,
      };
      const newElement = {
        ...value,
        faxogramm_id,
      };

      if (typeClick === 'missionDutyTemplate') {
        delete externalPayload.assign_to_waybill;
      }

      switch (typeClick) {
        case 'missionTemplate': return createMissions(this.context.flux, { [id]: newElement }, externalPayload);
        case 'missionDutyTemplate': return createDutyMissions(this.context.flux, { [id]: newElement }, externalPayload);
        default: return Promise.reject({ error: 'no typeClick' });
      }
    });

    Promise.all(queryList).then(() => {
      this.setState({
        selectedElement: undefined,
        checkedElements: {},
      });
    });
  }

  onRowSelected = ({ props: { data: { id } } }) => {
    const { missionsList = [] } = this.state;

    const selectedElement = missionsList.find(m => m.id === id);

    this.setState({ selectedElement });
  }

  onRowChecked = (id, state) => {
    const {
      checkedElements: checkedElementsOld = {},
      missionsList = [],
    } = this.state;

    const checkedElements = Object.entries(checkedElementsOld).reduce((newObj, [key, value]) => {
      newObj[key] = { ...value };
      return newObj;
    }, {});

    const selectedElement = missionsList.find(m => m.id === id);

    if (state) {
      checkedElements[id] = selectedElement;
    } else {
      delete checkedElements[id];
    }

    this.setState({ checkedElements });
  }

  onAllChecked = (rows, state) => {
    const checkedElements = state ? rows : {};

    this.setState({ checkedElements });
  }

  checkDisabledSubmit = () => {
    const {
      checkedElements,
    } = this.state;

    return isEmpty(checkedElements);
  }

  render() {
    const {
      assign_to_waybill,
      missionsList,
      selectedElement,
      checkedElements,
      structures,
    } = this.state;

    const {
      showForm,
      typeClick,
    } = this.props;

    let title = '';

    if (typeClick === 'missionTemplate') {
      title = 'Создание заданий';
    }
    if (typeClick === 'missionDutyTemplate') {
      title = 'Создание наряд-заданий';
    }

    return (
      <ModalTSX show={showForm} onHide={this.props.onFormHide} bsSize="lg">
        <RB.Modal.Header closeButton>
          <RB.Modal.Title id="contained-modal-title-lg">{title}</RB.Modal.Title>
        </RB.Modal.Header>

        <ModalBody>
          <Div hidden={typeClick !== 'missionTemplate'} >
            <MissionTemplateTable
              data={missionsList}
              selected={selectedElement}
              checked={checkedElements}
              onRowSelected={this.onRowSelected}
              onAllRowsChecked={this.onAllChecked}
              onRowChecked={this.onRowChecked}

              flux={this.context.flux}
              structures={structures}
            />
          </Div>
          <Div hidden={typeClick !== 'missionDutyTemplate'} >
            <DutyMissionTemplateTable
              data={missionsList}
              selected={selectedElement}
              checked={checkedElements}
              onRowSelected={this.onRowSelected}
              onAllRowsChecked={this.onAllChecked}
              onRowChecked={this.onRowChecked}

              flux={this.context.flux}
              structures={structures}
            />
          </Div>
        </ModalBody>
        <RB.Modal.Footer>
          <Div hidden={typeClick === 'missionDutyTemplate'} className="inline-block assignToWaybillCheck" style={{ width: '300px', textAlign: 'left !important', height: '22px', marginRight: '20px' }}>
            <EtsSelectTSX
              type="select"
              options={ASSIGN_OPTIONS}
              value={assign_to_waybill}
              clearable={false}
              onChange={this.handleChangeTypePrint}
            />
          </Div>
          <Div className="inline-block">
            <RB.Button disabled={this.checkDisabledSubmit()} onClick={this.handleSubmit}>{'Сформировать'}</RB.Button>
          </Div>
        </RB.Modal.Footer>
      </ModalTSX>
    );
  }
}

export default OrderMissionTemplate;
