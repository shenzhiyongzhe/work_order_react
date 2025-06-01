/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage"; // 👇 下面我们会实现这个工具函数
import http from '../../utils/axios'


export default function ChangeAvatarModal({ onClose })
{
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const customizeRef = useRef()
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedPixels) =>
    {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleSelectImage = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };
    const triggerFileSelect = () =>
    {
        if (fileInputRef.current)
        {
            fileInputRef.current.click();
        }
    };
    const handleSave = async () =>
    {
        const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
        const formData = new FormData();
        formData.append("avatar", croppedBlob, "avatar.jpg");

        // 你可以替换成自己的上传接口
        const res = await http.post("/user/modifyAvatar", formData);
        if (res.code == 200)
        {
            alert("头像上传成功！");
        }
        else
        {
            alert("头像上传失败")
        }

        onClose();
    };
    useEffect(() =>
    {
        function handleClickOutside(event)
        {
            if (customizeRef.current && !customizeRef.current.contains(event.target))
            {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-between h-[40vh] bg-white rounded p-4 w-[90%] max-w-lg" ref={customizeRef}>
                <h2 className="text-xl font-semibold mb-4 ">修改头像</h2>

                {!image ? (
                    <div className="h-[20%]">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleSelectImage} className="hidden" />
                        <button
                            onClick={triggerFileSelect}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            选择图片
                        </button>
                    </div>

                ) : (
                    <div className="relative w-full h-72 bg-gray-100">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                )}

                {image && (
                    <div className="mt-4 flex justify-between">
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                                保存
                            </button>
                            <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                                取消
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
