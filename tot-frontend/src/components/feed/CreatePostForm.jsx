import React, { useState, useRef, useEffect } from "react";
import apiClient from "../../api/apiClient";
import "./CreatePostForm.css";

export default function CreatePostForm({
    onCreatePost,
    categories,
    currentUser,
}) {
    const [body, setBody] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [error, setError] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    const fileInputRef = useRef(null);
    const readerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (readerRef.current) readerRef.current.abort();
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            setError("File too large (max 20MB)");
            return;
        }
        setSelectedFile(file);
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            readerRef.current = new FileReader();
            readerRef.current.onloadend = () => {
                setPreview(readerRef.current.result);
                readerRef.current = null;
            };
            readerRef.current.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || uploading) return;
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            const { data } = await apiClient.post("/media/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMediaUrl(data.data.url);
            setMediaType(data.data.type);
            setSelectedFile(null);
            setPreview(null);
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryId) {
            setError("Please choose a category.");
            return;
        }
        const postData = {
            body: body.trim() || null,
            media_url: mediaUrl || null,
            media_type: mediaType || null,
            category_id: Number(categoryId),
        };
        if (!postData.body && !postData.media_url) {
            setError("Please add text or media.");
            return;
        }
        setPosting(true);
        setError(null);
        try {
            await onCreatePost(postData);
            setBody("");
            setMediaUrl(null);
            setMediaType(null);
            setCategoryId("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            setError("Failed to create post.");
        } finally {
            setPosting(false);
        }
    };

    const removeMedia = () => {
        setMediaUrl(null);
        setMediaType(null);
        setSelectedFile(null);
        setPreview(null);
        setError(null);
    };

    const handleButtonClick = () => fileInputRef.current?.click();

    //for categoryselectedimg
    const getSelectedImage = () => {
        if (!categoryId) return "/assets/images/app.png";

        const category = categories?.find(
            (c) => String(c.id) === String(categoryId)
        );
        if (!category) return "/assets/images/app.png";

        switch (category.name.toLowerCase()) {
            case "entertainment":
                return "/assets/images/tv.png";
            case "news":
                return "/assets/images/news.png";
            case "announcement":
                return "/assets/images/announce.png";
            case "memes":
                return "/assets/images/memes.png";
            case "study":
                return "/assets/images/study.png";
            default:
                return "/assets/images/app.png";
        }
    };

    return (
        <article className="create-post-form boxshadow px-4 py-3 rounded-2xl mt-3 mb-2   mx-auto shadow-lg ">
            <form
                className="createContainer pb-3"
                onSubmit={handleSubmit}
                aria-label="Create new post"
            >
                <div className=" flex gap-3 items-center">
                    <div className="rounded-full w-fit">
                        <img
                            src={
                                currentUser?.avatar ||
                                currentUser?.profile_picture ||
                                "assets/images/users.png"
                            } // Use avatar or profile_picture, fallback to placeholder
                            alt={`${currentUser?.name || "User"}'s avatar`}
                            className="post-author-avatar rounded-2xl w-12 h-12 object-cover"
                        />
                    </div>
                    <textarea
                        className="post-textarea text-xl w-full resize-none bg-transparent outline-none placeholder-black focus:placeholder-black/10"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="What's on your mind?"
                        rows="1"
                        maxLength="1000"
                        aria-label="Post content"
                    ></textarea>
                </div>

                {/* ---- CATEGORY PICKER ---- */}
                <div className="flex  justify-between items-end mt-4 w-full -mb-3">
                    <div className="shareOptions flex flex-col gap-3">
                        <div className="category-picker flex gap-2 items-center mb-1 ">
                            <select
                                className="hover:scale-110 duration-300 boxshadow"
                                id="cat"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                style={{
                                    backgroundImage: `url(${getSelectedImage()})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "20px",
                                }}
                            >
                                <option
                                    className="boxshadow"
                                    value=""
                                    style={{
                                        backgroundSize: "16px",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        cursor: "pointer",
                                        backgroundImage: `url('/assets/images/app.png')`,
                                    }}
                                ></option>
                                {categories?.length > 0 &&
                                    categories.map((c) => {
                                        let label = "";
                                        let img = "";
                                        switch (c.name.toLowerCase()) {
                                            case "entertainment":
                                                label = "Entertainment";
                                                img = "/assets/images/tv.png";
                                                break;

                                            case "news":
                                                label = "News";
                                                img = "/assets/images/news.png";
                                                break;

                                            case "announcement":
                                                label = "Announcement";
                                                img =
                                                    "/assets/images/announce.png";
                                                break;

                                            case "memes":
                                                label = "Memes";
                                                img =
                                                    "/assets/images/memes.png";
                                                break;

                                            case "study":
                                                label = "Study";
                                                img =
                                                    "/assets/images/study.png";
                                                break;

                                            default:
                                                label = "";
                                                break;
                                        }
                                        return (
                                            <option
                                                className="boxshadow"
                                                key={c.id}
                                                value={c.id}
                                                title={label}
                                                style={{
                                                    backgroundSize: "16px",
                                                    backgroundRepeat:
                                                        "no-repeat",
                                                    backgroundPosition:
                                                        "center",
                                                    cursor: "pointer",
                                                    backgroundImage: `url(${img})`,
                                                }}
                                            ></option>
                                        );
                                    })}
                            </select>
                            <span className="text-sm">Category</span>
                        </div>

                        <div className="">
                            <div className=" flex justify-between items-center mb-2">
                                {/* file-upload-section */}
                                <div className="mr-1 flex items-center gap-2 ">
                                    <button
                                        type="button"
                                        onClick={handleButtonClick}
                                        className="choose-file-btn w-7 h-7 cursor-pointer hover:scale-125 duration-300 bg-[url('assets/images/gallery.png')] bg-cover bg-center bg-no-repeat "
                                        disabled={uploading || posting}
                                        aria-label="Choose media file to upload"
                                    ></button>
                                    <span className="shareOptionText text-sm font-medium ">
                                        Photo or Video
                                    </span>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*,audio/*,video/*"
                                    disabled={uploading || posting}
                                    style={{ display: "none" }}
                                    aria-hidden="true"
                                />
                                {selectedFile && !mediaUrl && (
                                    <button
                                        type="button"
                                        onClick={handleUpload}
                                        disabled={uploading || posting}
                                        className="boxshadow  px-2 rounded-xl"
                                        aria-label="Upload selected media"
                                    >
                                        {uploading
                                            ? "⏳ Uploading..."
                                            : "⬆️ Upload Media"}
                                    </button>
                                )}
                            </div>
                            {error && (
                                <p className="text-red-500 cherry-bomb absolute text-xl left-120 z-99 top-5">
                                    {error}
                                </p>
                            )}

                            {(preview || mediaUrl) && (
                                <div className="media-preview-container">
                                    {preview && !mediaUrl && (
                                        <>
                                            {selectedFile?.type.startsWith(
                                                "image/"
                                            ) && (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="media-preview max-h-90 max-w-90"
                                                />
                                            )}
                                            {selectedFile?.type.startsWith(
                                                "video/"
                                            ) && (
                                                <video
                                                    controls
                                                    src={preview}
                                                    className="media-preview"
                                                    aria-label="Video preview"
                                                />
                                            )}
                                        </>
                                    )}
                                    {mediaUrl && (
                                        <div className="flex flex-col items-end">
                                            <button
                                                type="button"
                                                onClick={removeMedia}
                                                className="remove-media-btn text-3xl  text-red-500 cursor-pointer cherry-bomb"
                                                aria-label="Remove media"
                                            >
                                                ×
                                            </button>
                                            {mediaType === "image" && (
                                                <img
                                                    src={mediaUrl}
                                                    alt="Uploaded media"
                                                    className="media-preview max-h-90 max-w-90"
                                                />
                                            )}
                                            {mediaType === "video" && (
                                                <video
                                                    controls
                                                    src={mediaUrl}
                                                    className="media-preview"
                                                    aria-label="Uploaded video"
                                                />
                                            )}
                                            {mediaType === "audio" && (
                                                <audio
                                                    controls
                                                    src={mediaUrl}
                                                    className="audio-player"
                                                    aria-label="Uploaded audio"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={uploading || posting}
                            className={`post-btn w-6 h-6 bg-[url('/assets/images/send.png')] bg-cover bg-center cursor-pointer hover:bg-[url('/assets/images/sends.png')] hover:scale-125 duration-300 ${
                                posting ? "loading" : ""
                            }`}
                            aria-label="Publish post"
                        ></button>
                    </div>
                </div>
                <div className="w-full my-1 text-center">
                    {posting ? "🚀 Posting..." : ""}
                </div>
            </form>
        </article>
    );
}
