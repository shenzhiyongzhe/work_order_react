import { useNavigate } from 'react-router-dom';
import { useEffect } from "react"
const WaitingForSettlement = () =>
{
    const navigate = useNavigate();

    useEffect(() =>
    {
        navigate('/ticket/list?status=待处理')
    }, [])
    return null;
}

export default WaitingForSettlement
