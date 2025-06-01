import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import http from '../../utils/axios'
import { MainView } from "../../components/MainView";
const UserList = () =>
{
    const [userList, setUserList] = useState([])
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const navigate = useNavigate();
    const getUserList = async () =>
    {
        try
        {
            const res = await http.post('/user/find')
            setUserList(res.result)
        } catch (error)
        {
            console.log(error)
        }

        //
    }
    const togglePassword = (username) =>
    {
        setVisiblePasswords((prev) => ({
            ...prev,
            [username]: !prev[username],
        }));
    };
    useEffect(() =>
    {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin')
        {
            navigate('/unauthorized'); // 或跳转首页
            return;
        }
        getUserList();
    }, [])

    return (
        <MainView>
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">用户列表</h2>
                <div className="overflow-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm bg-white">
                        <thead className="bg-gray-100 text-gray-700 font-medium">
                            <tr>
                                <th className="px-4 py-2 text-center">姓名</th>
                                <th className="px-4 py-2 text-center">部门</th>
                                <th className="px-4 py-2 text-center">岗位</th>
                                <th className="px-4 py-2 text-center">账号</th>
                                <th className="px-4 py-2 text-center">密码</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {userList.map((user) => (
                                <tr key={user.user_name}>
                                    <td className="px-4 py-2 whitespace-nowrap text-center">{user.user_name}</td>
                                    <td className="px-4 py-2 text-center">{user.department}</td>
                                    <td className="px-4 py-2 text-center">{user.position}</td>
                                    <td className="px-4 py-2 text-center">{user.user_name}</td>
                                    <td className="px-4 py-2 text-center" onClick={() => togglePassword(user.user_name)}>
                                        {visiblePasswords[user.user_name] ? user.password : '••••••••••••'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainView>

    );
};

export default UserList;
