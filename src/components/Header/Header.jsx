/* eslint-disable react/prop-types */
import { FaFileExport } from "react-icons/fa";
import SortMenu from "../Form/SortMenu";
import SearchBox from "../Form/SearchBox";
import TicketFilterButton from "../Form/TicketFilterButton";

const WorkOrderHeader = ({ onSearch, onFilter, onSort, onMyOwn, onExport }) =>
{
    return (
        <div className="p-2">
            <div className="flex  sm:flex-row items-start sm:items-center justify-between p-4 bg-white border rounded shadow-sm gap-3 sm:gap-4">
                <div className="flex items-center flex-1 gap-4">
                    <SearchBox onSearch={onSearch} />
                    <SortMenu onSort={onSort} />
                    <TicketFilterButton onFilter={onFilter} />
                    <div className="px-4 py-2 bg-blue-500 text-white rounded hover:cursor-pointer hover:bg-blue-700" onClick={onMyOwn}>我的</div>
                </div>
                <div className="flex gap-4">

                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={onExport}
                    >
                        <FaFileExport />
                        导出 Excel
                    </button>

                </div>

            </div>
        </div>

    );
};

export default WorkOrderHeader;
