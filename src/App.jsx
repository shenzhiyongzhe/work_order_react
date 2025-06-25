import { Suspense } from "react";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./page/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import WorkOrderList from "./page/TicketManagement/WorkOrderList";
import CreateWorkOrder from "./page/TicketManagement/CreateWorkOrder";
import WorkOrderDetail from "./page/TicketManagement/WorkOrderDetail";
import UserList from "./page/UsersManagement/UserList";
import AddUser from "./page/UsersManagement/AddUser";
import { GlobalStateProvider } from "./components/Provider/GlobalStateProvider";
import Unauthorized from "./page/Unauthorized";
import { WebSocketProvider } from "./components/Websocket/WebSocketContext";
import Test from "./page/Test";
import OrderList from "./components/OrderList";


export default function App()
{
    return (
        <Router>
            <GlobalStateProvider>
                <Suspense fallback={<BigSpinner />}>
                    <WebSocketProvider >
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route element={<PrivateRoute />}>
                                <Route path="/" element={<WorkOrderList />} />
                                <Route path="/ticket/list" element={<WorkOrderList />} />
                                <Route path="/ticket/create_ticket" element={<CreateWorkOrder />} />
                                <Route path="/ticket/detail/:ticket_id" element={<WorkOrderDetail />} />
                                <Route path="/user/list" element={<UserList />} />
                                <Route path="/user/add" element={<AddUser />} />
                                <Route path="/orderList" element={<OrderList />} />
                            </Route>
                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="/test" element={<Test />} />
                        </Routes>
                    </WebSocketProvider>
                </Suspense>
            </GlobalStateProvider>
        </Router>
    );
}

function BigSpinner()
{
    return <h2>🌀 Loading...</h2>;
}
