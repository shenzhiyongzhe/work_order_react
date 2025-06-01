/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import http from '../utils/axios'
import { BASE_URL } from "../constants";
const avatarCache = {}; // 缓存，避免重复请求
async function getAvatarUrlByAccount(user_name)
{
    if (avatarCache[user_name])
    {
        return avatarCache[user_name]; // 有缓存就直接返回
    }
    try
    {
        const res = await http.post("/user/getUserAvatar", { user_name });
        if (res.code == 200)
        {
            const url = `${BASE_URL}/uploads/avatars/${res.result}`
            avatarCache[user_name] = url; // 缓存
            return url;
        }

    } catch (err)
    {
        console.error("获取头像失败:", err);
    }
    return "/avatar.png"; // fallback 默认头像
}
function AttachmentPopover({ attachments })
{
    const [show, setShow] = useState(false);
    const wrapperRef = useRef(null);

    // 点击空白区域隐藏
    useEffect(() =>
    {
        function handleClickOutside(event)
        {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target))
            {
                setShow(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={wrapperRef}>
            <span
                className="text-blue-700 font-medium cursor-pointer select-none"
                onClick={() => setShow(prev => !prev)}
            >
                附件
            </span>

            {show && (
                <div className="absolute left-[-100px] top-6 z-10 bg-white border shadow-lg p-2 rounded w-64">
                    <div className="text-sm text-gray-700 font-medium mb-1">附件列表</div>
                    <ul className="space-y-1 max-h-48 overflow-auto">
                        {attachments.map((url) => (
                            <li key={url}>
                                <a
                                    href={`${BASE_URL}/uploads/${url.replace(/^\/?uploads\/?/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-sm underline hover:text-blue-800 break-all"
                                >
                                    {`${BASE_URL}/uploads/${url.replace(/^\/?uploads\/?/, '')}`}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
const LogCard = ({ log }) =>
{
    const [avatar, setAvatar] = useState("/avatar.png");
    useEffect(() =>
    {
        if (log.operator)
        {
            getAvatarUrlByAccount(log.operator).then(setAvatar);
        }
    }, [log.operator]);
    return (
        <div className="flex  gap-2 pb-2 border-b-2  w-full text-sm text-gray-500">
            <div className="w-15 flex flex-col justify-center  items-center gap-2">
                <div className="w-12 h-12 ">
                    <img src={avatar} alt="" className="rounded-full" />
                </div>
                {log.operator}
                {
                    (() =>
                    {
                        try
                        {
                            const statusList = log.operator_status ? JSON.parse(log.operator_status) : [];
                            return Array.isArray(statusList) ? statusList.map(item => (
                                <div key={item}>
                                    <div>{item}</div>
                                </div>
                            )) : null;
                        } catch (err)
                        {
                            console.error("Invalid JSON in operator_status:", err.message);
                            return null;
                        }
                    })()
                }
            </div>
            <div className="flex-1 pl-2">
                {
                    log.type == "创建工单" && (
                        <div>
                            <span className="text-gray-300">创建工单:</span>
                            {
                                log.field_changed.map((item, index) =>
                                {
                                    let parsedValue = {};
                                    try
                                    {
                                        parsedValue = JSON.parse(item.newValue || '{}');
                                    } catch (e)
                                    {
                                        console.log(e.message)
                                        return <div key={index} className="text-red-500 text-sm">数据损坏</div>;
                                    }
                                    return <div key={index} className="flex gap-2 flex-col">
                                        <div className="flex gap-4">
                                            {parsedValue["线索值"] && <span>{`线索值: ${parsedValue["线索值"]}`}</span>}
                                            {parsedValue["类型"] && <span>{`类型: ${parsedValue["类型"]}`}</span>}
                                            {parsedValue["客户ID"] && <span>{`客户ID: ${parsedValue["客户ID"]}`}</span>}
                                            {parsedValue["客户联系方式"] && <span>{`客户联系方式: ${parsedValue["客户联系方式"]}`}</span>}
                                            {parsedValue["状态"] && <span>{`状态: ${parsedValue["状态"]}`}</span>}
                                            {parsedValue["处理人"] && <span>{`处理人: ${parsedValue["处理人"]}`}</span>}
                                            {parsedValue["审核人"] && <span>{`审核人: ${parsedValue["审核人"]}`}</span>}
                                        </div>
                                        <div>
                                            {parsedValue["详情"] && <span>{`详情: ${parsedValue["详情"]}`}</span>}
                                        </div>
                                    </div>
                                }
                                )
                            }
                        </div>
                    )
                }
                {
                    log.type == "修改工单" && (
                        <div>
                            <span className="text-gray-300">修改订单:</span>
                            {
                                log.field_changed.map((item, index) => (<div key={index}>
                                    <span className="text-blue-400 rounded">{item.fieldLabel}
                                    </span> 从 <span className="text-yellow-300">
                                        {item.oldValue || "---"}</span> 修改为：
                                    <span className="text-green-400">{item.newValue}</span></div>))
                            }</div>
                    )
                }
                {
                    log.type == "评论工单" && (
                        <div className="flex  h-full pl-2">
                            <span className="text-gray-300">评论: </span>
                            {
                                log.field_changed.map((change, index) =>
                                {
                                    let parsedValue = {};
                                    try
                                    {
                                        parsedValue = JSON.parse(change.newValue || '{}');
                                    } catch (e)
                                    {
                                        console.log(e.message)
                                        return <div key={index} className="text-red-500 text-sm">评论数据损坏</div>;
                                    }
                                    if (!parsedValue.content) return <span key={index} className="text-gray-400">上传附件</span>;
                                    else return parsedValue.content
                                })
                            }
                        </div>
                    )
                }

            </div>
            <div className="w-30  p-4 rounded space-y-2">
                <div className="text-sm text-gray-600">{log.operated_at}</div>

                {log.field_changed.map((change, index) =>
                {
                    if (change.field == 'comment' || change.field == "create") 
                    {
                        let parsedValue = {};
                        try
                        {
                            parsedValue = JSON.parse(change.newValue || '{}');
                        } catch (e)
                        {
                            console.log(e.message)
                            return <div key={index} className="text-red-500 text-sm">评论数据损坏</div>;
                        }

                        let attachments = [];
                        try
                        {
                            attachments = JSON.parse(parsedValue.attachments || '[]');
                        } catch (e)
                        {
                            console.log(e.message)
                            // attachments 解析失败也可以跳过
                        }

                        if (!attachments.length) return null;

                        return <AttachmentPopover key={index} attachments={attachments} />;
                    }


                })}

            </div>


        </div>
    );
};

const HistoryLog = ({ ticket_id = '', refreshLog }) =>
{
    const [logs, setLogs] = useState([])

    const getTicketLogs = async () =>
    {
        if (!ticket_id)
        {
            return;
        }
        const res = await http.get('/ticket_log/get_logs', { ticket_id })
        if (res.code == 200)
        {
            setLogs(res.result)
        }
    }
    useEffect(() =>
    {
        getTicketLogs()

    }, [ticket_id, refreshLog])
    if (!ticket_id || logs.length === 0)
    {
        return <div className="text-gray-500 w-full border p-4 flex-1 rounded-xl">暂无历史记录</div>;
    }

    return (
        <div className="flex flex-col gap-4 w-full p-4 h-[60vh] overflow-y-auto border rounded-xl">
            {logs.map((log, index) => (
                <LogCard key={index} log={log} />
            ))}
        </div>
    );
};

export default HistoryLog;
