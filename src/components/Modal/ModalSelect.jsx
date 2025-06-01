/* eslint-disable react/prop-types */
import { useState } from "react";

const ModalSelect = ({ visible, options, onConfirm, onCancel }) =>
{
    const [selected, setSelected] = useState("");

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">请选择一个选项</h2>
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="border rounded p-2 w-full mb-4"
                >
                    <option value="">请选择</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded"
                        onClick={onCancel}
                    >
                        取消
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => onConfirm(selected)}
                        disabled={!selected}
                    >
                        确定
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSelect;
