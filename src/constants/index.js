

import { FaChartBar, } from "react-icons/fa";
const base_ip = '192.168.21.51:8000'
// const base_ip = 'localhost:7999'
export const BASE_URL = `http://${base_ip}`;
export const wss_url = `ws://${base_ip}/ws`
export const statusColors = {
    "待分配": "bg-gray-300 text-white",
    "待领取": "bg-orange-300 text-white",
    "处理中": "bg-green-300 text-white",
    "待回复": "bg-green-300 text-white",
    "已回复": "bg-green-300 text-white",
    "已解决": "bg-blue-400 text-white",
    "关闭": "bg-gray-400 text-white",
};

export const statusOptions = ["待分配", "待领取", "处理中", "待回复", "已回复", "已解决", "关闭"]
export const priorityOptions = ["低", "中", "高"]
export const sidebarLinks = [
    {
        title: "工单管理",
        subMenu: [
            {
                href: "/ticket/list",
                icon: FaChartBar,
                text: "总表",
            },
            {
                href: "/ticket/create_ticket",
                icon: FaChartBar,
                text: "新建",
            },
        ],
    },
    {
        title: "个人列表",
        subMenu: [
            {
                href: "/orderList?status=待处理",
                icon: FaChartBar,
                text: "待处理",
            },
            {
                href: "/orderList?status=待回复",
                icon: FaChartBar,
                text: "待回复",
            },
        ],
    },
    {
        title: "用户管理",
        subMenu: [
            {
                href: "/user/list",
                icon: FaChartBar,
                text: "用户列表",
            },
            {
                href: "/user/add",
                icon: FaChartBar,
                text: "添加用户",
            },
        ],
    },
];




