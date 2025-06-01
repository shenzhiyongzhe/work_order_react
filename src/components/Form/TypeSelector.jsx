/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Input } from "./Input";
import http from "../../utils/axios";
import { useGlobalState } from "../Provider/GlobalStateProvider";

const TypeSelector = ({ name, value, onChange, disabled, required }) =>
{
    const [options, setOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const { account } = useGlobalState();
    const customizeRef = useRef()

    const handleSelectChange = (e) =>
    {
        const selected = e.target.value;
        if (selected === "自定义")
        {
            setShowModal(true);
        } else
        {
            onChange({ target: { name, value: selected } });
        }
    };

    const handleCustomSubmit = async (e) =>
    {
        e.preventDefault()
        if (!customValue.trim()) return;
        try
        {
            // 提交到后端保存
            await http.post('/ticket_custom_fields/create_custom_field', { field_key: name, field_value: customValue, operator: account });

            // 更新本地选项
            const newOptions = options.slice(0, -1); // 移除“自定义”
            const allOptions = [...newOptions, customValue, "自定义"];
            setOptions(allOptions);

            // 回传给父组件
            onChange({ target: { name, value: customValue } });

            // 重置
            setCustomValue("");
            setShowModal(false);
        } catch (error)
        {
            alert("自定义类型保存失败:" + error.message);
        }
    };
    const getTypeOption = async () =>
    {
        try
        {
            const res = await http.post('/ticket_custom_fields/query_custom_field', { "field_key": "type" })
            setOptions([...res.result, "自定义",])
        } catch (error)
        {
            console.log(error.message)
        }
    }
    // 点击空白区域隐藏
    useEffect(() =>
    {
        function handleClickOutside(event)
        {
            if (customizeRef.current && !customizeRef.current.contains(event.target))
            {
                setShowModal(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() =>
    {
        getTypeOption()
    }, [])
    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-1">类型</label>
            <select
                name={name}
                value={value}
                onChange={handleSelectChange}
                disabled={disabled}
                required={required}
                className={`w-full border px-2 py-1 rounded text-sm  ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
            >
                <option value="">请选择</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>

            {/* 弹窗输入框 */}
            {showModal && (
                <div className="absolute left-0 top-full mt-1 w-full bg-gray-300 border border-gray-300 rounded shadow z-10 p-3" ref={customizeRef}>
                    <div className="mb-2">
                        <Input
                            name="custom_type"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            placeholder="请输入自定义类型"
                        />
                    </div>
                    <button
                        onClick={handleCustomSubmit}
                        className="w-full py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        添加并选择
                    </button>
                </div>
            )}
        </div>
    );
};

export default TypeSelector;
