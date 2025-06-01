/* eslint-disable react/prop-types */

import FilePreview from "./Form/FilePreview";
import { useState, useRef } from "react";
import http from '../utils/axios'
import { useWebSocketContext } from "./Websocket/WebSocketContext";

const Comment = ({ ticket_id, onCommentSubmit, hasPermission = true, hasCommentPermission = false }) =>
{
    const { sendMessage } = useWebSocketContext();
    const [fileList, setFileList] = useState([]);

    const fileInputRef = useRef();
    const contentRef = useRef()

    const handleSelectingFileBtn = () =>
    {
        fileInputRef.current.click(); // 触发文件选择
    };
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024 * 3; // 限制总大小：10MB

    if (!hasPermission) return null; // ❗️无权限则不渲染组件

    const handleChange = (e) =>
    {
        const newFiles = Array.from(e.target.files);

        const filteredNewFiles = newFiles.filter(newFile =>
            !fileList.some(existing => existing.file.name === newFile.name && existing.file.size === newFile.size)
        ).map(file => ({
            file,
            customId: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`
        }));

        if (filteredNewFiles.length === 0)
        {
            alert("你选择的文件已经添加过了");
            e.target.value = null; // 清空 input，允许再次选择相同文件
            return;
        }

        const totalSize = [...fileList, ...filteredNewFiles].reduce((acc, item) => acc + (item.file?.size || item.size), 0);

        if (totalSize > MAX_TOTAL_SIZE)
        {
            alert('文件总大小不能超过 30MB');
            return;
        }

        setFileList([...fileList, ...filteredNewFiles]);

        e.target.value = null; // 清空 input，允许重新选择
    };

    const removeFile = (targetFile) =>
    {
        setFileList(fileList.filter(item =>
            !(item.file.name === targetFile.name && item.file.size === targetFile.size)
        ));
    };

    const handleComment = async () =>
    {
        sendMessage({ "channel": "private", "action": "new_order_created", "status": "success", "message": "成功加入房间", "from": null, "to": null, "payload": { "userId": "meixuan" } }
        )
        const content = contentRef.current.value;
        if (!content && fileList.length == 0)
        {
            alert("请评论或上传附件")
            return false;
        }
        const formData = new FormData()
        formData.append("ticket_id", ticket_id)
        formData.append("content", content)
        // ✅ 正确添加多个文件：一个个 append 同名字段
        fileList.forEach(item =>
        {
            formData.append("attachments", item.file);
        });

        try
        {
            const res = await http.upload('/comment/post_comment', formData);
            if (res.code == 200)
            {
                setFileList([])
                onCommentSubmit?.();
                contentRef.current.value = ''
            }
        } catch (err)
        {
            console.error("上传失败：", err);
        }
    }
    const handleReply = async () =>
    {
        try
        {
            await http.post('/ticket/update_ticket', { ticket_id, status: "已回复" })
            await handleComment()
        } catch (error)
        {
            console.log(error.message)
        }

    }
    return (
        < div className="border rounded-xl p-2 h-[32vh]  flex flex-col" >
            <textarea className="w-full h-[80%]  rounded px-3 py-2 text-sm outline-none resize-none" ref={contentRef} ></textarea>

            <div className="mt-6  flex text-sm gap-4 flex-1 min-h-[100px]">
                <div className=" flex flex-col-reverse mr-4 min-w-10">
                    <button
                        type="button"
                        onClick={handleSelectingFileBtn}
                        className="px-4 py-2 bg-blue-500 text-white rounded "
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
                {
                    fileList.length > 0 && (
                        <div className="flex gap-1 group">
                            {
                                fileList.map(({ file, customId }) => (
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
                                ))

                            }
                        </div>
                    )
                }
            </div>
            <div className="flex gap-12 justify-center">
                {
                    ticket_id && !hasCommentPermission && (
                        <div className="flex justify-center pt-8">
                            <button type="button" className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded text-white" onClick={handleComment}>评论</button>
                        </div>
                    )
                }
                {
                    hasCommentPermission && (
                        <div className="flex justify-center pt-8">
                            <button type="button" className="bg-blue-500 py-2 px-4 rounded text-white hover:bg-blue-600" onClick={handleReply}>回复</button>
                        </div>
                    )
                }
            </div>

        </div >
    )
}

export default Comment
