import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = () =>
{
    const token = localStorage.getItem('token');
    if (!token) return false;
    try
    {
        const { exp } = jwtDecode(token);
        return Date.now() < exp * 1000; // 还未过期
    } catch
    {
        return false;
    }
};

const PrivateRoute = () =>
{
    return isTokenValid() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
