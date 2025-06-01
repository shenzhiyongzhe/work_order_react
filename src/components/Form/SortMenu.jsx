/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { FaSort, } from "react-icons/fa";

const sortOptions = {
    创建时间: ["升序", "降序"],
};
const sortFieldMap = {
    创建时间: 'createdAt',
    优先级: 'priority',
    处理人: 'assignee',
    // 可以继续添加
};
const sortOrderMap = {
    升序: 'ASC',
    降序: 'DESC',
};
const SortMenu = ({ onSort }) =>
{
    const [showMenu, setShowMenu] = useState(false);
    const [activeParent, setActiveParent] = useState(null);
    const menuRef = useRef(null);
    const toggleMenu = () => setShowMenu(prev => !prev);

    const handleSubClick = (category, value) =>
    {
        onSort(sortFieldMap[category], sortOrderMap[value]);
        setShowMenu(false); // 自动关闭菜单
    };

    useEffect(() =>
    {
        const handleClickOutside = (e) =>
        {
            if (menuRef.current && !menuRef.current.contains(e.target))
            {
                setShowMenu(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () =>
        {
            window.removeEventListener("click", handleClickOutside);
        }
    }, [])
    return (
        <div className="relative inline-block text-left " ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
                <FaSort />
                排序
            </button>

            {showMenu && (
                <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg w-40  ">
                    {Object.entries(sortOptions).map(([parent, children]) => (
                        <div
                            key={parent}
                            onMouseEnter={() => setActiveParent(parent)}
                            className="relative group"
                        >
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between">
                                {parent}
                                <span className="ml-2">▶</span>
                            </div>

                            {/* 子菜单 */}
                            {activeParent === parent && (
                                <div className="absolute left-full top-0 w-32 bg-white border rounded shadow-lg">
                                    {children.map((child) => (
                                        <div
                                            key={child}
                                            onClick={() => handleSubClick(parent, child)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {child}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SortMenu;
