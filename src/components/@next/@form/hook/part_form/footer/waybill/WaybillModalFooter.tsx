import * as React from 'react';

type WaybillModalFooterProps = {
  formDataKey: string;
  indexBlock: number
};

const WaybillModalFooter: React.FC<WaybillModalFooterProps> = React.memo(
  (props) => {
    return (
      <div>
        waybill_footer
      </div>
    );
  },
);

export default WaybillModalFooter;
