/* eslint-disable react/prop-types */
// WebSocketContext.js
import { createContext, useContext, useMemo, } from 'react';
import useWebSocket from './useWebSocket';
import { useGlobalDispatch } from '../Provider/GlobalStateProvider';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children })
{
    const dispatch = useGlobalDispatch();

    const { sendMessage } = useWebSocket({
        onMessage: (data) =>
        {
            console.log("data:", JSON.stringify(data))
            if (data.action === 'be_online')
            {
                console.log(`${data.payload.userId} 上线`)
            }
            if (data.action == "new_message_received")
            {
                dispatch({ type: "ADD_UNREAD", payload: data.payload.unreadList }); // 标记已读
            }
            else if (data.action == "new_ticket_pended")
            {
                console.log("新的待处理工单")
            }

        },
    });

    const contextValue = useMemo(() => ({ sendMessage }), [sendMessage]);

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketContext()
{
    return useContext(WebSocketContext);
}
