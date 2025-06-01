import { useNavigate } from 'react-router-dom';

const Unauthorized = () =>
{
    const navigate = useNavigate();

    return (
        <div className="p-10 text-center text-red-500 text-lg">
            <p className="mb-6">您没有权限访问此页面</p>
            <button
                onClick={() => navigate('/ticket/list')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                返回上一页
            </button>
        </div>
    );
};

export default Unauthorized;
