import styled from 'styled-components';

export const ReportHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .datepicker-range{
    margin-bottom: 0px;
  }
  .datepicker-range-period {
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
  }
  button {
    margin-left: 10px;
  }
  /* ie bugfix*/
  .reports-date {
    width: 248px;
  }
  .faxogramms-date .rw-widget{
    width: 248px;
  }
`;
