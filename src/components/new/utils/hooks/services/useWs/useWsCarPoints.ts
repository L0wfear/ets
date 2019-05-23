import * as React from 'react';
import * as ReconnectingWebSocket from 'vendor/ReconnectingWebsocket';

type OneWsPointData = {
  coords: number[] | [number | number];       // координаты
  coords_msk: number[] | [number | number];   // координаты мск (не используем)
  direction: number                           // направление (0 - 360)
  distance: number                            // расстояние от предыдущей точки
  id: number;                                 // gps_code
  nsat: number;                               // количество спутников
  speed: number;                              // скорость в точке
  status: 1 | 2 | 3 | 4 | number;             // статус ТС
  timestamp: number;
};

type WsPointsState = {
  wsState: Record<string, OneWsPointData>;
  ws: any;
};

const useWsCarPoints = () => {
  const [wsStateData, setWsState] = React.useState<WsPointsState>({
    wsState: {},
    ws: null,
  });

  const openConnection = React.useCallback(
    (points_ws, tokenOwn) => {
      let token = tokenOwn;

      if (process.env.STAND === 'gost_stage') {
        token = JSON.parse(
          localStorage.getItem(global.SESSION_KEY_ETS_TEST_BY_DEV2),
        );
      }

      const wsUrl = `${points_ws}?token=${token}`;

      const ws = new ReconnectingWebSocket(wsUrl, null);

      try {
        ws.onmessage = ({ data }) => {
          setWsState(
            (wsStateOld) => ({
              ...wsStateOld,
              wsState: {
                ...wsStateOld.wsState,
                ...JSON.parse(data),
              },
            }),
          );
        };
        ws.onclose = (event) => {
          // console.warn('WEBSOCKET - Потеряно соединение с WebSocket, пытаемся переподключиться');
        };
        ws.onerror = () => {
          // console.error('WEBSOCKET - Ошибка WebSocket');
        };
      } catch (e) {
        global.NOTIFICATION_SYSTEM.notify(
          'Ошибка подключения к потоку',
          'error',
        );
      }

      setWsState(
        (oldState) => {
          if (oldState.ws) {
            oldState.ws.close();
          }

          return {
            wsState: {},
            ws,
          };
        },
      );
    },
    [],
  );

  const closeConnection = React.useCallback(
    () => {
      if (wsStateData.ws) {
        wsStateData.ws.close();
      }
    },
    [wsStateData.ws],
  );

  return {
    wsStateData,
    openConnection,
    closeConnection,
  };
};

export default useWsCarPoints;
