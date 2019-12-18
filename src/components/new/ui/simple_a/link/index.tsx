import * as React from 'react';
import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const SimpleLinkAText = styled.span`
  text-decoration: underline;
`;
const SimpleLinkAStyled = styled.a`
  &&& {
    text-decoration: none!important;
    &:hover {
      ${SimpleLinkAText} {
        text-decoration: none!important;
      }
    }
  }
`;

const SimpleLabel = styled.div`
  border: solid 2px ${UiConstants.colorLightGreen};
  padding: 2px 10px;
  border-radius: 3px;
  color: ${UiConstants.colorDark};
  font-weight: 700;
  text-decoration: none!important;
  text-decoration-style: none!important;
  margin-right: 5px;
  display: inline-flex;
  font-size: 12px;
  background: #fff;
`;

type PropsSimpleLinkA = {
  id?: string;
  className?: string;
  title?: string;
  target?: string;
  href?: string;
  onClick?: (props: PropsSimpleLinkA, event: React.MouseEvent) => any;

  download?: string;
  withFileFormatLabel?: boolean;
  shortTitle?: boolean;
  [k: string]: any;
};

const SimpleLinkA: React.FC<PropsSimpleLinkA> = React.memo(
  (props) => {
    const {
      id,
      className,
      title,
      children,
      href,
      withFileFormatLabel,
      shortTitle,
    } = props;

    const handleClick = React.useCallback(
      (event: React.MouseEvent) => {
        if ('onClick' in props) {
          props.onClick(props, event);
        }
      },
      [props],
    );
    
    const fileFormat = React.useMemo(() => {
      const titleList = title?.split('.');

      return titleList?.length > 1
        ? titleList[titleList.length - 1]
        : '';
    }, [title,]);

    const getShortTitle = React.useCallback((titleVal: string, titleLength: number ) => {
      return titleVal && titleVal.length > titleLength
        ? `${titleVal.substring( 0, titleLength)}...`
        : titleVal;
    }, [title,]);

    const titleText = shortTitle
      ? getShortTitle(title, 8)
      : title;

    console.log('titleText === ', { titleText });

    return (
      <SimpleLinkAStyled
        id={id}
        className={className}
        href={href}
        onClick={handleClick}
        download={props.download}
        target={props.target}
        title={title}
      >
        {
          withFileFormatLabel
            && (
              <SimpleLabel>
                {fileFormat}
              </SimpleLabel>
            )
        }
        <SimpleLinkAText>
          {titleText || children || href}
        </SimpleLinkAText>
      </SimpleLinkAStyled>
    );
  },
);

export default SimpleLinkA;
