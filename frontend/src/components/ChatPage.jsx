import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

function ChatPage() {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(
        (store) => store.auth
    );
    const { onlineUsers, messages } = useSelector((store) => store.chat);

    const dispatch = useDispatch();
    async function sendMessageHandler(receiverId) {
        try {
            const res = await axios.post(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/message/send/${receiverId}`,
                { message: textMessage },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log("CHAT PAGE AXIOS CATCH");
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, []);

    return (
        <div className="flex sm:ml-[16%] h-screen">
            <section className="md:w-1/4 my-8">
                <h1 className="font-bold mb-4 px-3 text-xl">
                    {user?.username}
                </h1>
                <hr className="mb-4 border-gray-300" />
                <div className="overflow-y-auto h-[80vh]">
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(
                            suggestedUser?._id
                        );
                        return (
                            <div
                                onClick={(e) => {
                                    dispatch(setSelectedUser(suggestedUser));
                                    dispatch(setMessages([]))
                                }}
                                className={` flex gap-3 items-center p-3 hover:bg-gray-200 cursor-pointer ${
                                    suggestedUser?._id === selectedUser?._id
                                        ? "bg-gray-200"
                                        : " "
                                }`}
                            >
                                <Avatar className="w-14 h-14">
                                    <AvatarImage
                                        src={suggestedUser?.profilePicture}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col  ">
                                    <span className="font-medium">
                                        {suggestedUser?.username}
                                    </span>
                                    <span
                                        className={`text-xs font-bold ${
                                            isOnline
                                                ? "text-green-600"
                                                : "text-red-600"
                                        } `}
                                    >
                                        {isOnline ? "online" : "offline"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            {selectedUser ? (
                <section className="flex-1 border-l  border-l-gray-300 flex flex-col h-[92%] sm:h-full">
                    <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
                        <Avatar>
                            <AvatarImage
                                src={selectedUser?.profilePicture}
                                alt="profile"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span>{selectedUser?.username}</span>
                        </div>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className="flex items-center p-4 border-t border-t-gray-300">
                        <Input
                            type="text"
                            className="flex-1 mr-2 focus-visible:ring-transparent"
                            placeholder="Messages..."
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                        />
                        <Button
                            onClick={() =>
                                sendMessageHandler(selectedUser?._id)
                            }
                        >
                            Send
                        </Button>
                    </div>
                </section>
            ) : (
                <div className="flex flex-col items-center justify-center mx-auto">
                    <MessageCircleCode className="w-32 h-32 my-4" />
                    <h1 className="font-medium">Your messages</h1>
                    <span>Send a message to start a chat.</span>
                </div>
            )}
        </div>
    );
}

export default ChatPage;
