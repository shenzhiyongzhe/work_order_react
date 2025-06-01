/* eslint-disable react/prop-types */


import FilePreview from "./FilePreview";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";

const ContentInput = forwardRef((props, ref) =>
{
    const [fileList, setFileList] = useState([]);
    const fileInputRef = useRef();
    const contentRef = useRef();

    // 向父组件暴露方法
    useImperativeHandle(ref, () => ({
        getContent: () => contentRef.current?.value || '',
        getFileList: () => fileList,
        reset: () =>
        {
            setFileList([]);
            if (contentRef.current) contentRef.current.value = '';
        }
    }));

    const handleSelectingFileBtn = () =>
    {
        fileInputRef.current.click(); // 触发文件选择
    };

    const MAX_TOTAL_SIZE = 10 * 1024 * 1024 * 10; // 限制总大小：10MB

    const handleChange = (e) =>
    {
        const newFiles = Array.from(e.target.files);
        const filteredNewFiles = newFiles.filter(newFile =>
            !fileList.some(existing =>
                existing.file.name === newFile.name && existing.file.size === newFile.size
            )
        )
            .map(file => ({
                file,
                customId: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`
            }));

        if (filteredNewFiles.length === 0)
        {
            alert("你选择的文件已经添加过了");
            e.target.value = null;
            return;
        }

        const totalSize = [...fileList, ...filteredNewFiles].reduce((acc, item) => acc + (item.file?.size || item.size), 0);

        if (totalSize > MAX_TOTAL_SIZE)
        {
            alert('文件总大小不能超过 100MB');
            return;
        }

        setFileList([...fileList, ...filteredNewFiles]);
        e.target.value = null;
    };

    const removeFile = (targetFile) =>
    {
        setFileList(fileList.filter(item =>
            !(item.file.name === targetFile.name && item.file.size === targetFile.size)
        ));
    };

    return (
        <div className="border rounded-xl p-2 h-[32vh] flex flex-col">
            <textarea
                className="w-full h-[80%] rounded px-3 py-2 text-sm outline-none resize-none"
                ref={contentRef}
            ></textarea>

            <div className="mt-6 flex text-sm gap-4 flex-1 min-h-[100px]">
                <div className="flex flex-col-reverse mr-4 min-w-10">
                    <button
                        type="button"
                        onClick={handleSelectingFileBtn}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        上传文件
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={handleChange}
                    className="hidden"
                />

                {fileList.length > 0 && (
                    <div className="flex gap-1 group">
                        {fileList.map(({ file, customId }) => (
                            <div key={customId} className="flex flex-col gap-1 relative w-[90px] h-[120px]">
                                <FilePreview file={file} />
                                <div
                                    onClick={() => removeFile(file)}
                                    className="absolute top-1 right-1 w-5 h-5 bg-gray-300 text-white rounded-full flex 
                justify-center items-center text-xs cursor-pointer z-10 hover:bg-red-500
                opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    ×
                                </div>
                                <p className="text-sm text-gray-500 truncate w-[100px]">
                                    {file.name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});
ContentInput.displayName = 'Comment';
export default ContentInput;
