/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/axios'
// 默认状态

const initialState = {
    expandedSubMenu: '',
    userList: [],
    theme: 'light',
    user: {},
    unreadList: [], // 未读消息列表
};

function reducer(state, action)
{
    switch (action.type)
    {
        case 'EXPAND_SUB_MENU':
            return { ...state, expandedSubMenu: action.payload };
        case 'SET_USER_LIST':
            return { ...state, userList: [...new Set([...state.userList, ...action.payload])] };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'ADD_UNREAD': {
            const map = new Map();
            [...state.unreadList, ...action.payload].forEach(item =>
            {
                map.set(item.id, item);
            });
            return { ...state, unreadList: Array.from(map.values()) };
        }
        case 'MARK_AS_READ':
            return { ...state, unreadList: state.unreadList.filter(msg => msg.id !== action.payload) };
        case 'MARK_ALL_AS_READ':
            return { ...state, unreadList: [] };
        default:
            return state;
    }
}

// 创建 Context
const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

// Provider 组件
export const GlobalStateProvider = ({ children }) =>
{
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();

    // 封装获取用户列表的方法
    const fetchUserList = async () =>
    {
        try
        {
            const res = await http.get('/user/getUserList');
            dispatch({ type: 'SET_USER_LIST', payload: res?.result || [] });
        } catch (err)
        {
            console.error('获取用户列表失败：', err);
        }
    };

    useEffect(() =>
    {
        const init = async () =>
        {
            const localUser = localStorage.getItem('user');
            if (!localUser)
            {
                navigate('/login');
                return;
            }
            dispatch({ type: 'SET_USER', payload: JSON.parse(localUser) });
            await fetchUserList();
        };
        init();
    }, []);

    return (
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                {children}
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
};

// 封装的 hooks
export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);
