// src/components/profile/UserList.jsx
import React from "react";
// Remove the useSocket import since we're passing data directly
// import { useSocket } from '../../SocketContext'; // Adjust path as necessary
import "./UserList.css"; // Create this CSS file for styling

export default function UserList({
    users,
    currentUser,
    onFollow,
    onUnfollow,
    onViewProfile,
    onChat,
    onReportUser,
    // --- RECEIVE THE NEW PROP ---
    onlineUsers,
    // --- END RECEIVE ---
}) {
    // --- CHECK IF USER IS ONLINE ---
    const isUserOnline = (userId) => {
        return onlineUsers?.has(userId); // Use optional chaining if onlineUsers might be null initially
    };
    // --- END CHECK ---

    const validUsers = Array.isArray(users) ? users : [];

    if (validUsers.length === 0) {
        return (
            <section className="user-list font-balthazar flex-1 flex-col items-center outline-cyan-50 outline-1 rounded-3xl w-full mr-4 my-4 p-3  bg-gray-400/10 overflow-hidden scroll-y-auto no-scrollbar">
                <div className="flex flex-col items-center my-2 p-3">
                    <img
                        className="w-7"
                        src="assets/images/friends.png"
                        alt=""
                    />
                    <p className="text-2xl text-blue-900">Trendmates</p>
                </div>
                <p className="no-users text-teamcolor">No other users found.</p>
                ;
            </section>
        );
    }

    return (
        <section className=" flex-1 mr-4">
            <div className="user-list font-balthazar overflow-y-auto no-scrollbar h-[calc(100vh-35px)] overflow-hidden outline-cyan-50 outline-1 rounded-3xl w-full my-4 p-3  bg-gray-400/10 ">
                <div className="flex flex-col items-center my-2 p-3">
                    <img
                        className="w-7"
                        src="assets/images/friends.png"
                        alt=""
                    />
                    <p className="text-2xl text-blue-900">Trendmates</p>
                </div>
                <ul className="users-grid ">
                    {validUsers
                        .filter((user) => user.id !== currentUser.id)
                        .map((user) => {
                            // Determine online status using the helper function and the passed state
                            const online = isUserOnline(user.id);
                            return (
                                <li key={user.id} className="user-card mb-4 ">
                                    <button
                                        className="profile-link flex gap-1 text-sm cursor-pointer pb-2 border-b-1 border-b-blue-300"
                                        onClick={() => onViewProfile(user.id)}
                                        aria-label={`View profile of ${user.name}`}
                                    >
                                        <div className="user-avatar-container relative">
                                            <img
                                                src={
                                                    user.avatar ||
                                                    "assets/images/users.png"
                                                }
                                                alt={`${user.name}'s avatar`}
                                                className="user-avatar min-w-12 min-h-12 max-w-12 max-h-12 bg-gray-300  p-1  rounded-xl object-cover"
                                            />
                                            {/* Apply the dynamically determined online status */}
                                            <div
                                                className={`online-status absolute bottom-0 -right-5 ${
                                                    online
                                                        ? "online"
                                                        : "offline"
                                                }`}
                                            >
                                                <span
                                                    className={`status-text px-2 py-1 rounded-md text-xs ${
                                                        online
                                                            ? "bg-green-500/78 text-white"
                                                            : "bg-gray-400/78 text-white"
                                                    }`}
                                                >
                                                    {online ? "Here" : "Out"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="user-info flex flex-col">
                                            <strong className="chicle-regular  cursor-pointer wrap-break-word">
                                                {user.name}
                                            </strong>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </section>
    );
}
