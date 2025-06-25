import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from "./Modal/ChangePasswordModal";
import ChangeAvatarModal from "./Modal/ChangeAvatarModal";
import http from "../utils/axios";
import { BASE_URL } from "../constants";
import { useGlobalDispatch, useGlobalState } from "./Provider/GlobalStateProvider";
export default function UserAvatarMenu()
{
    const navigate = useNavigate();

    const { unreadList, } = useGlobalState();
    const dispatch = useGlobalDispatch();

    const avatarMenuRef = useRef()
    const msgRef = useRef(null);

    const [showMenu, setShowMenu] = useState(false);
    const [userAvatar, setUserAvatar] = useState('/avatar.png');
    const [showChangePwd, setShowChangePwd] = useState(false);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [showMsgPopup, setShowMsgPopup] = useState(false);

    const [userName, setUserName] = useState('')
    const logout = () =>
    {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate('/login')
    }
    const getUserAvatar = async (user_name) => 
    {
        try
        {
            const res = await http.post("/user/getUserAvatar", { user_name });
            if (res.code == 200)
            {
                const url = `${BASE_URL}/uploads/avatars/${res.result}`
                setUserAvatar(url)
            }
        }
        catch (err)
        {
            console.error("获取头像失败:", err.message);
        }
    };

    const getUnreadList = async (userId) =>
    {
        try
        {
            const res = await http.get('/message/get_unread_list', { userId })
            if (res.code == 200)
            {
                // console.log("unread list:", JSON.stringify(res.result, null, 2))
                dispatch({ type: 'ADD_UNREAD', payload: res.result })
            }
        } catch (error)
        {
            console.log(error.message)
        }
    }

    const makeAsRead = async (id) =>
    {
        try
        {
            const res = await http.get('/message/make_as_read', { id })
            if (res.code == 200)
            {
                return true;
            }
        } catch (error)
        {
            console.log(error.message)
        }
        return false
    }

    const handleClickMessage = async (msg) =>
    {
        const res = await makeAsRead(msg.id)
        console.log("res,", res)
        if (res)
        {
            // console.log("消息已读成功")
            dispatch({ type: "MARK_AS_READ", payload: msg.id }); // 标记已读
            navigate(`/ticket/detail/${msg.payload.ticket_id}`) // 跳转到对应页面
            setShowMsgPopup(false);
        }
    };
    // const getUser
    useEffect(() =>
    {
        const user = localStorage.getItem('user')
        if (!user)
        {
            navigate('/login')
        }
        const parseUser = JSON.parse(user)
        setUserName(parseUser.account || "未知用户")
        getUserAvatar(parseUser.user_name)
        getUnreadList(parseUser.user_name)
    }, [])

    useEffect(() =>
    {
        function handleClickOutside(event)
        {
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target))
            {
                setShowMenu(false)
            }
            if (!msgRef.current?.contains(event.target))
            {
                setShowMsgPopup(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            className="relative"
            onClick={() => setShowMenu(!showMenu)}
            ref={avatarMenuRef}
        >
            <div className="flex items-center gap-2 p-2">
                <img
                    src={userAvatar}// 你的头像图片路径
                    alt="用户头像"
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                />
                <span>{userName}</span>
                {/* 🔴 消息徽标 */}
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMsgPopup(!showMsgPopup) }}
                        className="relative"
                    >&nbsp;
                        {unreadList?.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                                {unreadList.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {showMenu && (
                <div className="absolute left-0 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowChangeAvatar(true)}
                    >
                        👤 修改头像
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowChangePwd(true)}
                    >
                        🔒 修改密码
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={logout}
                    >
                        🚪 退出登录
                    </button>
                </div>
            )}
            {/* 📬 消息弹窗 */}
            {showMsgPopup && (
                <div
                    ref={msgRef}
                    className="absolute left-0 top-12 w-80 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-96 overflow-auto"
                >
                    <div className="p-2 font-semibold border-b">📬 消息通知</div>
                    {unreadList?.length > 0 ? (
                        unreadList.map((msg) => (
                            <div
                                key={msg.id}
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b flex gap-2 items-center"
                                onClick={() => handleClickMessage(msg)}
                            >
                                <span></span>
                                <span>{msg.payload.status}</span>
                                <span>{msg.payload.type}</span>
                                <span>{msg.payload.clue_type}</span>
                                <span>{msg.payload.clue}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">暂无新消息</div>
                    )}
                </div>
            )}
            {showChangePwd && <ChangePasswordModal onClose={() => setShowChangePwd(false)} />}
            {showChangeAvatar && <ChangeAvatarModal onClose={() => setShowChangeAvatar(false)} />}
        </div>
    );
}
