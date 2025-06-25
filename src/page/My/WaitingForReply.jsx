import { useEffect } from "react"
import { useNavigate } from 'react-router-dom';


const WaitingForReply = () =>
{
    const navigate = useNavigate();

    useEffect(() =>
    {
        navigate('/ticket/list?status=待回复')
    }, [])
    return null;
}

export default WaitingForReply
