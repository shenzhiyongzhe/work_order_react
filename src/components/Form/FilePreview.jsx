/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";

const FilePreview = ({ file }) =>
{
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() =>
    {
        let objectUrl = "";

        if (file && (file instanceof File || file instanceof Blob))
        {
            objectUrl = URL.createObjectURL(file);
            setUrl(objectUrl);
        } else if (typeof file === "object" && file.previewUrl)
        {
            setUrl(file.previewUrl.startsWith("http")
                ? file.previewUrl
                : `${BASE_URL}${file.previewUrl}`
            );
        }

        // 清理 URL 对象，避免内存泄漏
        return () =>
        {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    const fileName = file.name || "";
    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(fileName);
    const isAudio = /\.(mp3|wav)$/i.test(fileName);
    const isVideo = /\.(mp4|mov|webm)$/i.test(fileName);

    const handleClick = () =>
    {
        if (isImage || isVideo) setIsPreviewOpen(true);
    };

    const handleClose = () =>
    {
        setIsPreviewOpen(false);
    };

    return (
        <>
            <div
                className="cursor-pointer"
                onClick={handleClick}
                title={isImage || isVideo ? "点击查看大图/视频" : ""}
            >
                {isImage && <img src={url} alt="预览图" className="w-20 h-20 object-cover rounded border" />}
                {isAudio && <audio controls src={url} className="w-24" />}
                {isVideo && (
                    <video
                        src={url}
                        className="w-20 h-20 object-cover rounded border"
                        onLoadedMetadata={(e) => e.target.currentTime = 1}
                        muted
                    />
                )}
                {!isImage && !isAudio && !isVideo && (
                    <div className="w-20 h-20 flex items-center justify-center border rounded bg-gray-100 text-xs">附件</div>
                )}
            </div>

            {isPreviewOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={handleClose}
                >
                    <div
                        className="max-w-[80%] max-h-[80%] bg-black p-2 rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isImage && <img src={url} alt="大图" className="max-w-full max-h-full object-contain" />}
                        {isVideo && <video src={url} controls className="max-w-full max-h-full object-contain rounded" />}
                    </div>
                </div>
            )}
        </>
    );
};

export default FilePreview;

