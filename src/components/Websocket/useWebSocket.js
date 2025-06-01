import { useEffect, useRef } from 'react';
import { wss_url } from '../../constants';

export default function useWebSocket({ onMessage })
{
    const socketRef = useRef(null);
    const tabId = useRef(null);

    useEffect(() =>
    {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) return;

        let parseUser;
        try
        {
            parseUser = JSON.parse(rawUser);
        } catch (e)
        {
            console.error("解析 user 失败", e);
            return;
        }

        tabId.current = `${parseUser.user_name}`;
        const socket = new WebSocket(wss_url);
        socketRef.current = socket;

        socket.onopen = () =>
        {
            console.log('✅ WebSocket 连接已建立');
            const data = {
                channel: 'private',
                action: 'be_online',
                userId: tabId.current
            };
            socket.send(JSON.stringify(data));
        };

        socket.onmessage = (event) =>
        {
            try
            {
                const data = JSON.parse(event.data);
                onMessage?.(data);
            } catch (err)
            {
                console.error('解析消息失败:', err);
            }
        };

        socket.onerror = (err) =>
        {
            console.error('WebSocket 错误:', err);
        };

        socket.onclose = () =>
        {
            console.log('WebSocket 连接已关闭');
        };

        return () =>
        {
            socket.close();
        };
    }, []);

    const sendMessage = (obj) =>
    {
        if (socketRef.current?.readyState === WebSocket.OPEN)
        {
            socketRef.current.send(JSON.stringify(obj));
        } else
        {
            console.warn('WebSocket 未连接，消息未发送');
        }
    };

    return { sendMessage };
}
