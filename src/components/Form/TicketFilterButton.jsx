/* eslint-disable react/prop-types */
import { useState, Fragment } from "react";
import { useGlobalState } from "../Provider/GlobalStateProvider";
// import { Input } from "../Form/Input";
import { Select } from "./Select";
import { Dialog, Transition } from "@headlessui/react";
import { priorityOptions, statusOptions } from "../../constants";
import { useNavigate } from 'react-router-dom';

export default function TicketFilterButton()
{
    const navigate = useNavigate();

    const { userList } = useGlobalState();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        priority: "",
        status: '',
        type: "",
        assignee: "",
        cooperator: "",
    });

    const handleChange = (e) =>
    {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilter = () =>
    {
        const dataToSend = {}
        for (let key in formData)
        {
            if (formData[key])
            {
                dataToSend[key] = formData[key]
            }
        }
        let str = Object.entries(dataToSend).map(([key, value]) => `${key}=${value}`).join('&');
        if (str)
        {
            str = '?' + str;
        }
        navigate(`/orderList${str}`);
        setFormData({
            priority: "",
            status: '',
            type: "",
            assignee: "",
            cooperator: "",
        });
        setIsOpen(false);
    };

    const handleCancel = () =>
    {
        setFormData({
            priority: "",
            status: '',
            type: "",
            assignee: "",
            cooperator: "",
        });
        setIsOpen(false);
    }
    return (
        <div>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setIsOpen(true)}
            >
                筛选
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="transition-transform ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition-transform ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                                <Dialog.Title className="text-lg font-semibold mb-4">筛选工单</Dialog.Title>

                                <div className="flex flex-col gap-2">
                                    <Select label="优先级" name="priority" options={priorityOptions} value={formData.priority} onChange={handleChange} />

                                    <Select label="状态" name="status" options={statusOptions} value={formData.status} onChange={handleChange} />
                                    <Select label="创建人" name="creator" options={userList} value={formData.creator} onChange={handleChange} />
                                    <Select label="处理人" name="assignee" options={userList} value={formData.assignee} onChange={handleChange} />
                                    <Select label="配合处理人" name="cooperator" options={userList} value={formData.cooperator} onChange={handleChange} />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        className="px-4 py-2 border rounded text-gray-700"
                                        onClick={handleCancel}
                                    >
                                        取消
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        onClick={handleFilter}
                                    >
                                        搜索
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
