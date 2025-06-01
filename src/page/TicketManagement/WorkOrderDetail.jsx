import { useEffect, useState } from "react";
import { MainView } from "../../components/MainView"
import TicketForm from "../../components/TicketForm";
import http from '../../utils/axios'
import { useParams } from 'react-router-dom';
const WorkOrderDetail = () =>
{
    const { ticket_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState(null);
    async function fetchTicket()
    {
        setTicket(null); // 清空旧数据
        try
        {
            const res = await http.get(`/ticket/detail/${ticket_id}`);
            setTicket(res.result);
        } catch (err)
        {
            console.error("工单获取失败", err);
        }
    }
    // 👉 提交更新
    const handleSubmit = async (formData) =>
    {
        try
        {
            setLoading(true);
            const res = await http.upload('/ticket/update_ticket', formData)
            if (res.code === 200)
            {
                setTicket(res.result); // 更新页面数据
                return { success: true };  // ✅ 返回结果给子组件
            } else
            {
                return { success: false, message: "更新失败" };
            }
        } catch (error)
        {
            return { success: false, message: error.message };
        } finally
        {
            setLoading(false);
        }
    }

    useEffect(() =>
    {
        fetchTicket()
    }, [ticket_id])

    return (
        <MainView>
            {loading && <div className="fixed left-1/2 top-1/2">更新中...</div>}
            <TicketForm
                initialData={ticket}
                onSubmit={handleSubmit}
            />
        </MainView>
    )
}

export default WorkOrderDetail
