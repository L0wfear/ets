import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { BlockCarInfoProps } from '../../@types/BlockCarInfo';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Row, Col } from 'react-bootstrap';
import { makeDate, makeTime } from 'utils/dates';

type BlockCarInfoMainDataProps = (
  {}
) & Pick<BlockCarInfoProps, 'IS_CREATING' | 'formState' | 'handleChange'>;

const BlockCarInfoMainData: React.FC<BlockCarInfoMainDataProps> = React.memo(
  (props) => {
    const {
      IS_CREATING,
      formState: state,
    } = props;

    return (
      <BoxContainer>
        <ExtField
          type="string"
          label="Гос. номер:"
          value={state.gov_number}
          readOnly={!IS_CREATING}
          onChange={props.handleChange}
          inline
        />
        <ExtField
          type="string"
          label="Марка:"
          value={state.marka}
          readOnly={!IS_CREATING}
          onChange={props.handleChange}
          inline
        />
        <ExtField
          type="string"
          label="Модель:"
          value={state.model}
          readOnly={!IS_CREATING}
          onChange={props.handleChange}
          inline
        />
        <ExtField
          type="string"
          label="Тип ТС:"
          value={state.type}
          readOnly={!IS_CREATING}
          inline
        />
        <ExtField
          type="string"
          label="Статус ТС по базе:"
          value={state.fact_status_text}
          readOnly={!IS_CREATING}
          onChange={props.handleChange}
          inline
        />
        <ExtField
          type="string"
          label="VIN:"
          value={''} // @todo
          readOnly={!IS_CREATING}
          onChange={props.handleChange}
          inline
        />
        <ExtField
          type="string"
          label="Пробег на дату/счётчик моточасов:"
          value={''} // @todo
          readOnly={!IS_CREATING}
          onChange={props.handleChange}
          inline
        />
        <Row>
          <Col md={6}>
            <ExtField
              type="string"
              label="Номер ОСАГО:"
              value={''} // @todo
              onChange={props.handleChange}
          />
          </Col>
          <Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="действует до:"
              value={null} // @todo
              makeGoodFormat
              onChange={props.handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <ExtField
              type="string"
              label="Номер диагностической карты:"
              value={''} // @todo
              onChange={props.handleChange}
            />
          </Col>
          <Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="действует до:"
              value={null} // @todo
              makeGoodFormat
              onChange={props.handleChange}
            />
          </Col>
        </Row>
        <ExtField
          type="date"
          time={false}
          label="Дата прохождения последнего ТО:"
          value={null} // @todo
          makeGoodFormat
          onChange={props.handleChange}
        />
        <p>ТС проверено {makeDate(new Date())} в {makeTime(new Date())}</p>
      </BoxContainer>
    );
  },
);

export default BlockCarInfoMainData;
