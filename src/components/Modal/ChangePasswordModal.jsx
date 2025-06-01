/* eslint-disable react/prop-types */
import { useState } from "react";
import http from '../../utils/axios'
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordModal({ onClose })
{
    const navigate = useNavigate();
    const [pwd, setPwd] = useState("");

    const handleSave = async () =>
    {
        // 提交修改密码逻辑
        const res = await http.post('/user/changePassword', { password: pwd })
        if (res.code == 200)
        {
            alert("修改密码成功")
            navigate('/login')
        }
        else
        {
            alert("修改密码失败")
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-md w-80 transform transition-all duration-300 scale-100">
                <h2 className="text-lg font-semibold mb-4">修改密码</h2>
                <input
                    type="password"
                    className="border p-2 rounded w-full mb-4"
                    placeholder="新密码"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                />
                <div className="flex justify-between">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                        保存
                    </button>
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}
