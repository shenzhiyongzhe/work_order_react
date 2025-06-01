/* eslint-disable react/prop-types */


// import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';

export const MainView = ({ children }) =>
{
    return (
        <div className='flex overflow-visible'>
            <Sidebar />
            <div className='flex flex-1 flex-col'>
                {children}
            </div>

        </div>
    )
}


