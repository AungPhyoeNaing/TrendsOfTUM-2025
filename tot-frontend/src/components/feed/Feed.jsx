// src/components/Feed.jsx (Updated - no more category filtering UI)
import React, { useState, useEffect } from "react";
import CreatePostForm from "./CreatePostForm.jsx";
import Post from "./Post.jsx";
import "./Feed.css";

const Feed = ({
    user,
    posts,
    onCreatePost,
    onDeletePost,
    socket,
    onViewProfile,
    categories,
    selectedCats, // Receive filtered posts from parent
    toggleCat,
}) => {
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        if (selectedPost) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [selectedPost]);

    // Filter posts based on selected categories passed from parent
    const filtered =
        selectedCats.length === 0
            ? posts
            : posts.filter((p) => selectedCats.includes(p.category_id));

    const handleViewOriginalPost = (postId) => {
        const originalPost = posts.find((p) => p.id === postId);
        if (originalPost) {
            setSelectedPost(originalPost);
        } else {
            setSelectedPost({ id: postId, loading: true });
        }
    };

    const handleBackToFeed = () => setSelectedPost(null);

    if (selectedPost) {
        return (
            <div className="h-[calc(100vh-35px)] overflow-y-auto no-scrollbar flex-8">
                <div className="single-post-view mr-3  ">
                    <div className="flex justify-between items-center">
                        <h3 className="py-2 px-3 border-2 rounded-2xl border-teamcolor w-fit cherry-bomb my-6">
                            Original Post
                        </h3>
                        <button
                            onClick={handleBackToFeed}
                            className="back-button boxshadow rounded-2xl py-2 px-3 my-6  cursor-pointer "
                        >
                            ← Back to Feed
                        </button>
                    </div>

                    <Post
                        post={selectedPost}
                        currentUser={user}
                        onDeletePost={onDeletePost}
                        onViewProfile={onViewProfile}
                        onViewOriginalPost={handleViewOriginalPost}
                        socket={socket}
                    />
                </div>
            </div>
        );
    }

    return (
        <section className="flex-8 max-h-screen ">
            <div className="feed overflow-y-auto no-scrollbar h-[calc(100vh-35px)] outline-cyan-50 outline-1 rounded-3xl  w-full mx-auto my-4 bg-gray-400/10 font-balthazar overflow-hidden">
                <div className="border-b-1 border-b-cyan-50 py-2 px-8">
                    <header>
                        <h3 className="text-center text-2xl text-blue-900 font-black mt-4">
                            Hello, {user?.name}! Ready to explore?
                        </h3>
                    </header>
                    <CreatePostForm
                        onCreatePost={onCreatePost}
                        categories={categories}
                        currentUser={user}
                    />
                </div>

                {/* Category filter UI on the Feed */}
                <div className="flex justify-center gap-4 py-6 border-b border-white/20 relative z-10">
                    {categories?.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => toggleCat(cat.id)}
                            className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all duration-300 backdrop-blur-md shadow-lg ${
                                selectedCats.includes(cat.id)
                                    ? "bg-blue-500/80 text-white border-blue-400/50 shadow-[0_4px_12px_rgba(59,130,246,0.5)] scale-105"
                                    : "bg-white/40 text-gray-800 border-white/50 hover:bg-white/60 hover:scale-105"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                <div className="posts-grid p-4 grid grid-cols-2 gap-4">
                    {filtered.length ? (
                        filtered.map((post) => (
                            <Post
                                key={post.id}
                                post={post}
                                currentUser={user}
                                onDeletePost={onDeletePost}
                                onViewProfile={onViewProfile}
                                onViewOriginalPost={handleViewOriginalPost}
                                socket={socket}
                            />
                        ))
                    ) : (
                        <p className="error-message text-red-400/10 cherry-bomb mt-10 text-xl">
                            No posts match the selected categories.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Feed;
