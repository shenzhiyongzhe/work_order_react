import { useState, useEffect } from "react";
import { MainView } from "../../components/MainView"
import http from '../../utils/axios'
import { useNavigate } from 'react-router-dom';

const AddUser = () =>
{
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        account: "",
        department: "",
        position: "",
        user_name: "",
        password: ""
    });
    const handleChange = (e) =>
    {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const res = await http.post('/user/create', formData)
        if (res.msg == "创建角色成功")
        {
            alert("创建角色成功")
        }
        else
        {
            alert("创建失败")
        }
        setFormData({
            account: "",
            department: "",
            position: "",
            user_name: "",
            password: ""
        });
    };

    useEffect(() =>
    {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin')
        {
            navigate('/unauthorized'); // 或跳转首页
            return;
        }
    }, [])
    return (
        <MainView>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4  flex-1 flex justify-center items-center flex-col">
                <h2 className="text-lg font-semibold">添加用户</h2>
                <div>
                    <label className="block text-sm mb-1">姓名</label>
                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">账号</label>
                    <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">部门</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">岗位</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">密码</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    提交
                </button>
            </form>
        </MainView>
    )
}

export default AddUser
