/* eslint-disable react/prop-types */

const Popup = ({ isOpen, onClose, title, content }) =>
{
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p className="mb-6 flex justify-center">{content}</p>
                <div className='flex justify-end'>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 "
                    >
                        确认
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Popup;



