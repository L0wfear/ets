import * as React from 'react';

type WaybillModalFooterProps = {
  formDataKey: string;
  indexBlock: number
};

const WaybillModalFooter: React.FC<WaybillModalFooterProps> = React.memo(
  (props) => {
    return React.useMemo(
      () => {
        return (
          <div>
            waybill_footer
          </div>
        );
      },
      [props],
    );
  },
);

export default WaybillModalFooter;
