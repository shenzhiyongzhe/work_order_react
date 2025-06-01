import { MainView } from "../../components/MainView"
import TicketForm from "../../components/TicketForm";
import http from '../../utils/axios'
import { useNavigate } from 'react-router-dom';

const CreateWorkOrder = () =>
{
    const navigate = useNavigate();
    return (
        <MainView>
            <TicketForm
                onSubmit={(formData) =>
                {
                    http.upload('/ticket/create_ticket', formData
                    ).then((res) =>
                    {
                        if (res.code == 200)
                        {
                            const ticket = res.result;
                            navigate(`/ticket/detail/${ticket.ticket_id}`)
                        }
                        else
                        {
                            alert("上传失败")
                        }
                    });
                }}
            />
        </MainView>
    )
}

export default CreateWorkOrder
