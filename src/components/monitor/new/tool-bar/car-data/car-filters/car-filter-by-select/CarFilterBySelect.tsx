import * as React from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import { ExtField } from 'components/ui/Field.jsx';
import { monitorPageChangeFilter } from 'components/monitor/new/redux/models/actions-monitor-page';
import * as ClickOutHandler from 'react-onclickout';

const makeOptions = (carActualGpsNumberIndex) => (
  Object.values(carActualGpsNumberIndex).reduce((newObj, { type_id, type_name, company_structure_id, company_structure_name, company_id, company_name }) => {
    if (type_id && type_name && !newObj.TYPE_OPTIONS.obj[type_id]) {
      newObj.TYPE_OPTIONS.obj[type_id] = type_name;
      newObj.TYPE_OPTIONS.arr.push({
        value: type_id,
        label: type_name,
      });
    }

    if (company_structure_id && company_structure_name && !newObj.COMPANY_STRUCTURE_OPTIONS.obj[company_structure_id]) {
      newObj.COMPANY_STRUCTURE_OPTIONS.obj[company_structure_id] = company_structure_name;
      newObj.COMPANY_STRUCTURE_OPTIONS.arr.push({
        value: company_structure_id,
        label: company_structure_name,
      });
    }
    if (company_id && company_name && !newObj.OWNER_OPTIONS.obj[company_id]) {
      newObj.OWNER_OPTIONS.obj[company_id] = company_name;
      newObj.OWNER_OPTIONS.arr.push({
        value: company_id,
        label: company_name,
      });
    }

    return newObj;
  }, {
    TYPE_OPTIONS: { obj: {}, arr: [] },
    COMPANY_STRUCTURE_OPTIONS: { obj: {}, arr: [] },
    OWNER_OPTIONS: { obj: {}, arr: [] },
  })
)

class CarFilterByText extends React.Component<any, any> {
  constructor(props) {
    super(props);

    const { carActualGpsNumberIndex } = props;

    const calcData = makeOptions(carActualGpsNumberIndex);

    this.state = {
      hidden: true,
      carActualGpsNumberIndex,
      TYPE_OPTIONS: calcData.TYPE_OPTIONS.arr,
      COMPANY_STRUCTURE_OPTIONS: calcData.COMPANY_STRUCTURE_OPTIONS.arr,
      OWNER_OPTIONS: calcData.OWNER_OPTIONS.arr,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { carActualGpsNumberIndex } = nextProps;

    if (carActualGpsNumberIndex !== this.state.carActualGpsNumberIndex) {
      const calcData = makeOptions(carActualGpsNumberIndex);

      this.setState({
        carActualGpsNumberIndex,
        TYPE_OPTIONS: calcData.TYPE_OPTIONS.arr,
        COMPANY_STRUCTURE_OPTIONS: calcData.COMPANY_STRUCTURE_OPTIONS.arr,
        OWNER_OPTIONS: calcData.OWNER_OPTIONS.arr,
      });
    }
  }

  toggleHidden: any = () => {
    const hidden = !this.state.hidden;

    this.setState({ hidden });
  }
  handleClickOut: any = () => {
    if (!this.state.hidden) {
      this.setState({ hidden: true });
    }
  }

  render() {
    const {
      TYPE_OPTIONS,
      COMPANY_STRUCTURE_OPTIONS,
      OWNER_OPTIONS,
    } = this.state;

    const noData = {
      carFilterMultyType: TYPE_OPTIONS.length === 0,
      carFilterMultyStructure: COMPANY_STRUCTURE_OPTIONS.length === 0,
      carFilterMultyOwner: OWNER_OPTIONS.length === 0,
    }
    return (
      <span>
        <ClickOutHandler onClickOut={this.handleClickOut}>
          <div className="tool_bar-block">
            <div className="default_cube flex-row map-car-filter multi">
              <div className="button-toggle" onClick={this.toggleHidden} >
                <Glyphicon glyph="filter" />
              </div>

                {
                  this.state.hidden ?
                  (
                    <div className="none"></div>
                  )
                  :
                  (
                    <div className="car_text_filter-container multi">
                      <div>
                        <ExtField
                          multi
                          label={false}
                          type="select"
                          value={this.props.carFilterMultyType.join(',')}
                          onChange={this.props.changeCarFilterMulty}
                          placeholder={`Тип техники${noData.carFilterMultyType ? ' (нет данных)' : ''}`}
                          options={TYPE_OPTIONS}
                          boundKeys={['carFilterMultyType']}
                          disabled={noData.carFilterMultyType}
                        />
                        <ExtField
                          multi
                          label={false}
                          type="select"
                          value={this.props.carFilterMultyStructure.join(',')}
                          onChange={this.props.changeCarFilterMulty}
                          placeholder={`Подразделение${noData.carFilterMultyStructure ? ' (нет данных)' : ''}`}
                          options={COMPANY_STRUCTURE_OPTIONS}
                          boundKeys={['carFilterMultyStructure']}
                          disabled={noData.carFilterMultyStructure}
                        />
                        {
                          this.props.isOkrug ?
                          (
                            <ExtField
                              multi
                              label={false}
                              type="select"
                              value={this.props.carFilterMultyOwner.join(',')}
                              onChange={this.props.changeCarFilterMulty}
                              placeholder={`Организации${noData.carFilterMultyOwner ? ' (нет данных)' : ''}`}
                              options={OWNER_OPTIONS}
                              boundKeys={['carFilterMultyOwner']}
                              disabled={noData.carFilterMultyOwner}
                            />
                          )
                          :
                          (
                            <div className="none"></div>
                          )
                        }
                      </div>
                    </div>
                  )
                }
            </div>
          </div>
        </ClickOutHandler>
      </span>
    )
  }
}
const mapStateToProps = state => ({
  isOkrug: state.session.userData.isOkrug,
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,

  carFilterMultyType: state.monitorPage.filters.data.carFilterMultyType,
  carFilterMultyStructure: state.monitorPage.filters.data.carFilterMultyStructure,
  carFilterMultyOwner: state.monitorPage.filters.data.carFilterMultyOwner,
});

const mapDispatchToProps = dispatch => ({
  changeCarFilterMulty: (type, stringMulty: string) => (
    dispatch(
      monitorPageChangeFilter(
        type,
        stringMulty ? stringMulty.split(',').map(d => Number(d)) : [],
      ),
    )
  ),
  dispatch,
});

 export default connect(
  mapStateToProps,
  mapDispatchToProps,
 )(CarFilterByText);
