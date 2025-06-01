/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { sidebarLinks } from "../../constants";
import { useGlobalState, useGlobalDispatch } from "../Provider/GlobalStateProvider";

import UserAvatarMenu from "../UserAvatarMenu";

const LinkItem = ({ title, subMenu }) =>
{
    // const { expandedSubMenu, setExpandedSubMenu } = useSidebar("工单管理");
    const { expandedSubMenu } = useGlobalState();
    const dispatch = useGlobalDispatch();
    const handleToggle = (title) =>
    {
        if (expandedSubMenu === title)
        {
            dispatch({ type: "EXPAND_SUB_MENU", payload: null }); // 收起当前展开的子菜单
        } else
        {
            dispatch({ type: "EXPAND_SUB_MENU", payload: title }); // 展开指定的子菜单
        }
        console.log("expand sub menu :" + expandedSubMenu)

    };

    // useEffect(() =>
    // {
    //     // 如果没有任何菜单展开，默认展开第一个
    //     if (!expandedSubMenu)
    //     {
    //         dispatch({ type: "EXPAND_SUB_MENU", payload: "工单管理" }); // 替换成你真实的菜单标题
    //     }
    // }, [])

    return (
        <div>
            <div
                className="flex items-center justify-between  cursor-pointer hover:bg-gray-100 p-2  rounded-lg"
                onClick={() => handleToggle(title)}
            >
                <div>{title}</div>
                {/* <div className="pr-6">
                    <IoIosArrowDown />
                </div> */}
            </div>
            {/* {expandedSubMenu === title && ( */}
            <ul className="pl-4 ">
                {subMenu.map(({ href, icon: Icon, text }, index) => (
                    <li key={index} >
                        <Link
                            to={href}
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100
                            dark:hover:bg-gray-700"
                        >
                            <Icon className="mr-3" />
                            <span className="flex-1 me-3">{text}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            {/* )} */}
        </div>
    );
};

const Sidebar = () =>
{
    return (
        <aside
            className={`flex flex-col z-40 w-48 h-screen
        pl-4 bg-white border-r border-gray-200
        `}
        >
            <div className="h-30 flex items-center gap-2 mt-2">
                <UserAvatarMenu />
            </div>
            <div className="flex-1 flex flex-col gap-2 mt-5">
                {sidebarLinks.map((link, index) => (
                    <LinkItem
                        key={index}
                        {...link}
                    />
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
