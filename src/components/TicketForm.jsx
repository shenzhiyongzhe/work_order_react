/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, useRef } from "react";
import { useGlobalState } from "./Provider/GlobalStateProvider";
import { Select, LabeledInputWithSelect } from "./Form/Select";
import HistoryLog from "./HistoryLog";
import Comment from "./Comment";
import { useModalSelect } from './Modal/useModalSelect';
import { getDateTime } from "../utils/tool";
import TypeSelector from "./Form/TypeSelector";
import { AlphaNumericInput, Input } from "./Form/Input";
import ContentInput from "./Form/ContentInput";
import http from '../utils/axios'
import { useNavigate } from 'react-router-dom';

const priorities = ["低", "中", "高"];
const clueTypeOptions = [
    { label: "订单号", value: "订单号" },
    { label: "物流单号", value: "物流单号" },
    { label: "手机号", value: "手机号" },
    { label: "序列号", value: "序列号" },
    { label: "客户ID", value: "客户ID" },
]
const DEFAULT_FORM = {
    clue: "",
    clue_type: '',
    type: " ",
    client_id: "",
    client_contact: "",
    priority: "",
    status: '待创建',
    assignee: "",
    cooperator: "",
    reviewer: "",
    content: '',
    attachments: ''
};

const TicketForm = ({ initialData = {}, onSubmit }) => {

    const { userList, user } = useGlobalState();

    const [formData, setFormData] = useState({ ...DEFAULT_FORM, });

    const contentInputRef = useRef();

    const [isCreator, setIsCreator] = useState(false);
    const [isAssignee, setIsAssignee] = useState(false);
    const [isCooperator, setIsCooperator] = useState(false);

    const fieldEditability = {
        clue: isAssignee || formData.status === '待创建',
        client_id: formData.status === '待创建',
        client_contact: formData.status === '待创建',
        type: isAssignee || formData.status === '待创建',
        priority: isAssignee || formData.status === '待创建',
        assignee: formData.status === '待创建',
        status: formData.status === '待创建',
        cooperator: isAssignee || formData.status === '待创建',
        comment: isCreator || isAssignee || isCooperator
    };

    const [openSelectModal, selectModal] = useModalSelect();

    // 触发刷新历史记录的标志
    const [refreshLog, setRefreshLog] = useState(false);

    const navigate = useNavigate();

    // 切换状态来触发 useEffect
    const triggerLogRefresh = () => setRefreshLog(prev => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = new FormData()
        if (formData.status == "待创建") {
            // setFormData(prev => ({ ...prev, status: '待分配' }));
            formData.status = "待分配"
            if (formData.assignee) {
                formData.status = "待领取"
            }
            const content = contentInputRef.current.getContent()
            const fileList = contentInputRef.current.getFileList()
            formData.content = content;
            for (let key in formData) {
                dataToSend.append(key, formData[key])
            }
            fileList.forEach(item => {
                dataToSend.append("attachments", item.file);
            });
        }
        if (onSubmit) {
            onSubmit(dataToSend);
        }
    };

    const handleModalSelectConfirm = async () => {
        const selected = await openSelectModal(userList);
        if (selected) {
            return selected;
        } else {
            return null;
        }
    };

    const handleTicketInfoUpdate = async (type) => {
        const dataToSend = { ...formData }

        if (type == "assign_handler") {
            const select = await handleModalSelectConfirm()
            if (!select) {
                return;
            }
            dataToSend.assignee = select;
            dataToSend.status = "待领取"
        }
        else if (type == "resign_handler") {
            const select = await handleModalSelectConfirm()
            if (!select) {
                return;
            }
            dataToSend.assignee = select;
        }
        else if (type == "confirm_dealing") {
            dataToSend.status = "处理中";
            dataToSend.start_dealing_at = getDateTime()
        }
        else if (type == "settled") {
            dataToSend.status = "已解决"
            dataToSend.settled_at = getDateTime()
        }
        else if (type == "close") {
            dataToSend.status = "关闭"
            dataToSend.settled_at = getDateTime()
        }
        else if (type == "reject") {
            dataToSend.status = "待分配"
            dataToSend.assignee = ''
        }
        else if (type == "reopen") {
            dataToSend.status = "处理中"
        }
        else if (type == "add_cooperator") {
            const select = await handleModalSelectConfirm()
            if (!select) {
                return;
            }
            dataToSend.status = "待回复"
            dataToSend.cooperator = select;
        }

        const res = await onSubmit(dataToSend)
        if (res.success) {
            setFormData({ ...dataToSend })
        }
        else {
            console.log(res.message)
        }
    }

    const deleteTicketForm = async (ticket_id) => {
        console.log(ticket_id)
        try {
            const res = await http.delete(`/ticket/${ticket_id}`)
            if (res.code == 200) {
                alert("删除成功")
                navigate('/ticket/list')
            }
            else {
                alert("删除失败")
            }
        } catch (error) {
            console.log(error)
            alert("删除失败")
        }

    }
    const action = useMemo(() => {
        const dynamicActions = [
            {
                status: '待创建',
                label: '创建工单',
                type: 'submit',
                onClick: null,
                allow: null, // 创建工单按钮始终可见（比如在新增模式下）
            },
            {
                status: '待分配',
                label: '分配处理人',
                onClick: () => handleTicketInfoUpdate('assign_handler'),
                allow: { role: "creator", permission: isCreator },
            },
            {
                status: '待领取',
                label: '确认处理',
                onClick: () => handleTicketInfoUpdate('confirm_dealing'),
                allow: { role: "assignee", permission: isAssignee },
            },
            {
                status: '处理中',
                label: '已解决',
                onClick: () => handleTicketInfoUpdate('settled'),
                allow: { role: "assignee", permission: isAssignee },
            },
            {
                status: '待回复',
                label: '已解决',
                onClick: () => handleTicketInfoUpdate('settled'),
                allow: { role: "assignee", permission: isAssignee },
            },
            {
                status: '已回复',
                label: '已解决',
                onClick: () => handleTicketInfoUpdate('settled'),
                allow: { role: "assignee", permission: isAssignee },
            },
            {
                status: '已解决',
                label: '关闭',
                onClick: () => handleTicketInfoUpdate('close'),
                allow: { role: "creator", permission: isCreator },
            },
            {
                status: '关闭',
                label: '重新打开',
                onClick: () => handleTicketInfoUpdate('reopen'),
                allow: { role: "creator", permission: isCreator },
            },
        ];
        return dynamicActions.find(item => {
            if (item.status === "待创建") {
                // 只有在没有 ticket_id（新增模式）时才返回
                return !formData.ticket_id;
            }

            if (item.status !== formData.status) return false;

            const allow = item.allow;
            if (!allow) return false;
            // 校验：必须权限为 true 且 formData 的 assignee/creator 等字段是当前用户
            return allow.permission && formData[allow.role] === user.user_name;
        });
    }, [formData.status, formData.creator, formData.assignee, isCreator, isAssignee, isCooperator, user.user_name]);


    useEffect(() => {
        if (initialData && initialData.ticket_id) {
            setFormData({ ...DEFAULT_FORM, ...initialData }); // 统一重置表单，避免残留
            triggerLogRefresh();
            setIsCreator(initialData.creator === user?.user_name);
            setIsAssignee(initialData.assignee === user?.user_name);
            setIsCooperator(initialData.cooperator?.includes(user?.user_name));
        }

    }, [initialData]);


    useEffect(() => {
        console.log("form data:", JSON.stringify(formData))

    }, [initialData])

    return (

        <form onSubmit={handleSubmit} className="flex-1 flex px-6 py-8 gap-8">
            {/* 中间表单主要内容 */}
            <div className="flex-1 flex flex-col gap-4">
                <HistoryLog ticket_id={initialData?.ticket_id} refreshLog={refreshLog} />
                {
                    formData.status == "待创建" && (
                        <ContentInput ref={contentInputRef} />
                    )
                }
                <Comment ticket_id={initialData?.ticket_id} onCommentSubmit={triggerLogRefresh} hasPermission={fieldEditability.comment} hasCommentPermission={isCooperator} />
            </div>

            {/* 右侧信息区 */}
            <div className="w-60 flex flex-col gap-5 text-sm">
                <LabeledInputWithSelect disabled={!fieldEditability.clue} required
                    selectOptions={clueTypeOptions} selectValue={formData.clue_type} inputValue={formData.clue}
                    onSelectChange={(e) => setFormData((prev) => ({ ...prev, ["clue_type"]: e.target.value }))}
                    onInputChange={(e) => setFormData(prev => ({ ...prev, ["clue"]: e.target.value.replace(/[^a-zA-Z0-9]/g, '') }))}
                />
                <AlphaNumericInput label="客户ID" name="client_id" value={formData.client_id} onChange={handleChange} disabled={!fieldEditability.client_id} />
                <AlphaNumericInput label="联系方式" name="client_contact" value={formData.client_contact} onChange={handleChange} disabled={!fieldEditability.client_contact} />
                <TypeSelector name='type' value={formData.type} onChange={handleChange} disabled={!fieldEditability.type} required />
                <Select label="优先级" name="priority" options={priorities} value={formData.priority} onChange={handleChange} disabled={!fieldEditability.priority} />
                <Select label="处理人" name="assignee" options={userList} value={formData.assignee} onChange={handleChange} disabled={!fieldEditability.assignee} />

                {formData.status != "待创建" && (
                    <div className="flex flex-col gap-4">
                        <Input label="状态" name="status" value={formData.status} onChange={handleChange} disabled={!fieldEditability.status} />
                        <Select label="配合处理人" name="cooperator" options={userList} value={formData.cooperator} onChange={handleChange} disabled={!fieldEditability.assignee} />
                        <div className="text-gray-400">创建人：{formData.creator}</div>
                        <div className="text-gray-400">创建时间：{formData.created_at}</div>
                        <div className="text-gray-400">{formData.start_dealing_at && (<span>领取时间：</span>)}{formData.start_dealing_at}</div>
                        <div className="text-gray-400">{formData.closed_at && (<span>关闭时间：</span>)}{formData.closed_at}</div>
                    </div>
                )}
                <div className="flex flex-1 gap-8 flex-col-reverse pb-20">
                    {action && (
                        <button
                            type={action.type || 'button'}
                            className="w-full py-2 rounded transition bg-blue-600 text-white hover:bg-blue-700"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </button>
                    )}
                    {
                        isAssignee && formData.status == "待领取" && (
                            <button type="button" className="py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleTicketInfoUpdate("reject")}>
                                驳回
                            </button>
                        )

                    }
                    {
                        isAssignee && ["处理中", "待回复", "已回复"].includes(formData.status) && (
                            <button type="button" className="py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => handleTicketInfoUpdate("resign_handler")} >
                                改派
                            </button>
                        )
                    }
                    {
                        isAssignee && ["处理中", "待回复", "已回复"].includes(formData.status) && (
                            <button type="button" className="py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => handleTicketInfoUpdate("add_cooperator")} >
                                添加配合处理人
                            </button>
                        )
                    }
                    {
                        isCreator && ["待领取"].includes(formData.status) && (
                            <button type="button" className="py-2 rounded bg-red-500 text-white hover:bg-red-800"
                                onClick={() => deleteTicketForm(formData.ticket_id)} >
                                删除
                            </button>
                        )
                    }
                </div>
            </div>
            {selectModal}
        </form>
    );
};

export default TicketForm;
