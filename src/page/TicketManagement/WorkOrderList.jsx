import { useEffect, useState } from "react";
import { MainView } from "../../components/MainView"
import http from '../../utils/axios'
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header";
import * as XLSX from "xlsx";
import { useGlobalState } from "../../components/Provider/GlobalStateProvider";
import { statusColors } from "../../constants";


const WorkOrderList = () => {
    const navigate = useNavigate();
    const { userList } = useGlobalState();
    const { user } = useGlobalState();
    const [ticketList, setTicketList] = useState([])

    const [showReviewerMenu, setShowReviewerMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        ticket: null,
    });

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        ticket: null,
    });

    const getTicketList = async () => {
        const res = await http.get('/ticket/get_ticket_list')
        setTicketList(res.result)
    }

    const handleContextMenu = (event, ticket) => {
        if (user.role != "admin") {
            return;
        }
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            ticket,
        });
    };

    const handleCloseMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, ticket: null });
    };
    const handleCloseReviewerModal = () => {
        setShowReviewerMenu({ visible: false, x: 0, y: 0, ticket: null });
    }
    const handleSettingReviewer = (event, ticket) => {

        event.stopPropagation(); // 关键：阻止冒泡，避免立即触发关闭
        handleCloseMenu()
        setShowReviewerMenu({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            ticket,
        });
    };
    const handleSelectReviewer = (name) => {
        const newList = ticketList.map(item => {
            if (item?.ticket_id == showReviewerMenu.ticket.ticket_id) {
                item.reviewer = name
                http.post('/ticket/update_ticket', item)
            }
            return item
        })
        setTicketList(newList)
        handleCloseReviewerModal()
    }

    const handleReopen = () => {
        alert(`编辑工单：${contextMenu.ticket.ticket_id}`);
        // 或者导航到编辑页，或打开编辑对话框
        handleCloseMenu();
    };

    const handleDoubleClick = (ticket) => {
        navigate(`/ticket/detail/${ticket.ticket_id}`)
    };


    const handleSearch = async (keyword) => {
        const res = await http.get('/ticket/search_ticket', { keyword })
        setTicketList(res.result)
    };

    const handleSortToggle = async (category, value) => {
        try {
            const res = await http.post('/ticket/sort_ticket', { sortField: category, sortOrder: value })
            if (Array.isArray(res.result)) {
                setTicketList(res.result)

            }
            else {
                setTicketList([])
            }
        } catch (error) {
            console.log(error)
        }

        console.log(category, value)
    };

    const handleClickMyOwn = async () => {
        try {
            const res = await http.get('/ticket/get_my_own')
            if (Array.isArray(res.result)) {
                setTicketList(res.result)
            }
            else {
                setTicketList([])
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleExport = () => {
        const fieldMap = {
            ticket_id: "工单号",
            type: "工单类型",
            clue_type: "线索值类型",
            clue: "线索值",
            client_id: "客户ID",
            client_contact: "客户联系方式",
            status: "状态",
            priority: "优先级",
            creator: "创建人",
            assignee: "处理人",
            cooperator: "配合处理人",
            reviewer: "审核人",
            start_dealing_at: "开始处理时间",
            closed_at: "关闭时间",
            created_at: "创建时间",
            updated_at: "更新时间",
            settled_at: "解决时间"
            // 你可以继续添加其它字段映射
        };
        // 只导出映射字段
        const exportData = ticketList.map(item => {
            const obj = {};
            Object.keys(fieldMap).forEach(key => {
                obj[fieldMap[key]] = item[key];
            });
            return obj;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        worksheet['!cols'] = Object.keys(fieldMap).map(() => ({ wch: 16 }));
        worksheet['!rows'] = exportData.map(() => ({ hpx: 20 }));
        worksheet['!rows'].unshift({ hpx: 15 });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "工单");
        XLSX.writeFile(workbook, "工单列表.xlsx");
    }
    useEffect(() => {
        getTicketList()

        window.addEventListener("click", handleCloseMenu);
        window.addEventListener("click", handleCloseReviewerModal);
        return () => {
            window.removeEventListener("click", handleCloseMenu);
            window.removeEventListener("click", handleCloseReviewerModal);
        }
    }, [])
    // useTicketSSE((newTicket) =>
    // {
    //     setTicketList((prev) => [newTicket, ...prev]); // prepend
    // });
    return (
        <MainView>
            <Header onSearch={handleSearch} onSort={handleSortToggle} onMyOwn={handleClickMyOwn} onExport={handleExport}></Header>
            <div className="p-2">
                <div className="overflow-auto border rounded-lg">
                    <table className="min-w-full bg-white divide-y divide-gray-200 text-xs">
                        <thead className="bg-gray-100 text-gray-700 font-medium">
                            <tr>
                                <th className="px-4 py-2 text-center">序号</th>
                                <th className="px-4 py-2 text-center">工单号</th>
                                <th className="px-4 py-2 text-center">线索值类型</th>
                                <th className="px-4 py-2 text-center">线索值</th>
                                <th className="px-4 py-2 text-center">工单类型</th>
                                <th className="px-4 py-2 text-center">处理人</th>
                                <th className="px-4 py-2 text-center">配合处理人</th>
                                <th className="px-4 py-2 text-center">创建人</th>
                                <th className="px-4 py-2 text-center">审核人</th>
                                <th className="px-4 py-2 text-center">当前状态</th>
                                <th className="px-4 py-2 text-center">创建时间</th>
                                <th className="px-4 py-2 text-center">解决时间</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ticketList.map((ticket, index) => (
                                <tr key={ticket.ticket_id} onContextMenu={(e) => handleContextMenu(e, ticket)} >
                                    <td className="px-4 py-2 whitespace-nowrap  text-center">{++index}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-blue-400 text-center hover:cursor-pointer" onDoubleClick={() => handleDoubleClick(ticket)}>{ticket.ticket_id}</td>
                                    <td className="px-4 py-2 text-center">{ticket.clue_type}</td>
                                    <td className="px-4 py-2 text-center">{ticket.clue}</td>
                                    <td className="px-4 py-2 text-center">{ticket.type}</td>
                                    <td className="px-4 py-2 text-center">{ticket.assignee}</td>
                                    <td className="px-4 py-2 text-center">{ticket.cooperator}</td>
                                    <td className="px-4 py-2 text-gray-600 text-center">{ticket.creator}</td>
                                    <td className="px-4 py-2 text-gray-600 text-center" >{ticket.reviewer}</td>
                                    <td className="px-4 py-2 text-center">
                                        <div className={`"px-4 py-2 rounded text-xs font-medium appearance-none cursor-not-allowed  focus:outline-none focus:ring-2 ${statusColors[ticket.status]} text-white"`}>
                                            {ticket.status ?? "---"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center">{ticket.created_at}</td>
                                    <td className="px-4 py-2 text-center">{ticket.settled_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {contextMenu.visible && (
                <div
                    className="absolute z-50 bg-white border border-gray-300 rounded shadow-md text-sm"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={handleCloseMenu}
                    onContextMenu={(e) => e.preventDefault()} // 防止菜单自己再次触发
                >

                    <button
                        onClick={(e) => handleSettingReviewer(e, contextMenu.ticket)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        设置审核人
                    </button>
                    <button
                        onClick={handleReopen}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        重新打开
                    </button>
                </div>
            )}
            {showReviewerMenu.visible && (
                <div
                    className="absolute z-50 bg-white border border-gray-300 rounded shadow-md text-sm"
                    style={{ top: showReviewerMenu.y, left: showReviewerMenu.x }}
                >
                    <div className="p-2 border-b text-gray-700 font-medium text-sm">选择审核人</div>
                    {userList.map((name) => (
                        <button
                            key={name}
                            onClick={() => handleSelectReviewer(name)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}
        </MainView>
    )
}

export default WorkOrderList
