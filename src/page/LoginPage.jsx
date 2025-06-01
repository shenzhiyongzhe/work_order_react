import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../utils/axios'

export default function LoginPage()
{
    const accountRef = useRef()
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleLogin = async (e) =>
    {
        e.preventDefault();
        const res = await http.post('/user/login', { account: accountRef.current.value, password })
        if (res.code == 200)
        {
            console.log("登录成功！！！！")
            localStorage.setItem("user", JSON.stringify(res.user))
            localStorage.setItem("token", res.token)
            navigate('/ticket/list')
            window.location.reload();
        }
        else if (res.code == 1001)
        {
            setError('用户不存在')
        }
        else if (res.code == 1002)
        {
            setError('密码错误')
        }
        else
        {
            alert("登录失败")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#abcadf] via-[#264c81] to-[#064aa8]">
            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-sm transition-all duration-300 animate-fade-in">
                <h2 className="text-white text-2xl font-bold text-center mb-6">欢迎登录</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm text-white block mb-1">账号</label>
                        <input
                            ref={accountRef}
                            type="text"
                            className="w-full p-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="账号"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white block mb-1">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="密码"
                            required
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                    >
                        登录
                    </button>
                </form>
            </div>
        </div>
    );
}
