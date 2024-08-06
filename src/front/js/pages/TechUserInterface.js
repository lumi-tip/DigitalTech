import React, { useEffect, useState, useContext } from "react"

import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

import Input from "../component/globalComponents/Input"
import Button from "../component/globalComponents/Button"

import useForm from "../hooks/useForm";

const TechUserInterface = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate()

    const [formState, handleChange] = useForm({
        image: '',
        message: '',
        location: '',
        status: 0
    });

    const [onOpen, setOnOpen] = useState(false)

    useEffect(() => {
        if (!store.userToken) navigate("/")
        actions.getPosts(store.userToken.token)
    }, [])

    function timeAgo(createdAt) {
        const now = new Date();
        const postDate = new Date(createdAt);

        const diffInMs = now - postDate;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInHours <= 23) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else if (diffInDays < 1) {
            return 'Today';
        } else if (diffInDays === 1) {
            return '1 day ago';
        } else {
            return `${diffInDays} days ago`;
        }
    }

    const handleLikeToggle = async (postId, type) => {
        console.log("AAAAAAAAAAA", `${process.env.BACKEND_URL}/api/posts/${postId}/${type}`)
        console.log(type)
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/posts/${postId}/${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.userToken.token}`
                }
            });
            if (!res.ok) {
                throw new Error("Failed to like/unlike post");
            }
            actions.getPosts(store.userToken.token); // Refresh posts to update likes
        } catch (error) {
            console.log(error);
        }
    };

    const handlePost = async () => {
        if (formState.image === "" || formState.message === "") {
            alert("All inputs are required, except location");
        } else {
            actions.publish(formState, store.userToken.token);
        }
    };

    console.log(store.posts)
    console.log(store.userToken.token)
    return (
        <div className="flex flex-col h-lvh">
            <div className="flex flex-col md:flex-row items-start justify-between w-full p-5 border-b-2 shadow-md">
                <div className="flex gap-5">
                    <h1 className="text-5xl font-bold text-zinc-400 text-nowrap">DTech Inc</h1>
                    <Input placeholder={"search bar"}></Input>
                </div>
                <Button variant="solid" onClick={() => setOnOpen(!onOpen)}>
                    Publish
                </Button>
            </div>
            <div className="flex flex-col md:flex-row grow">
                <div className="flex flex-col p-4 md:bg-zinc-100 md:w-96">
                    <h2 className="text-2xl font-bold">Your Info</h2>
                    <div className="flex gap-2 gap-5 items-center">
                        <img className="h-8 w-8 rounded-full object-cover"
                            src={
                                store.userToken.identity.avatarurl ?
                                    store.userToken.identity.avatarurl :
                                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                            }
                        />
                        <div className="flex flex-col">
                            <p>{store.userToken.identity.username}</p>
                            <p>{store.posts && store.posts.filter(e => e.author === store.userToken.identity.username).length} publicaciones</p>
                        </div>
                    </div>
                    <hr className="mt-6 bg-black"></hr>
                </div>
                <div className="grow flex justify-center">
                    <div className="p-4">
                        {store.posts && store.posts.map((post, index) => (
                            <>
                                {post.status == 0 &&
                                    <div key={post.id} className={`bg-white border rounded-sm max-w-md w-96 ${index > 0 && "mt-4"}`}>
                                        <div className="flex items-center px-4 py-3">
                                            <img className="h-8 w-8 rounded-full object-cover" src={post.author_image} />
                                            <div className="ml-3 ">
                                                <span className="text-sm font-semibold antialiased block leading-tight">{post.author}</span>
                                                <span className="text-gray-600 text-xs block">{post.location}</span>
                                            </div>
                                        </div>
                                        <img className="object-cover w-96" src={post.image} />
                                        <div className="flex items-center justify-between mx-4 mt-3 mb-2">
                                            <div className="flex gap-5">
                                                <svg
                                                    fill={post.likes.includes(store.userToken.identity.username) ? "red" : "#262626"}
                                                    height="24"
                                                    viewBox="0 0 48 48"
                                                    width="24"
                                                    onClick={() => post.likes.includes(store.userToken.identity.username) ? handleLikeToggle(post.id, "unlike") : handleLikeToggle(post.id, "like")}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                                                </svg>
                                                <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
                                                <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>
                                            </div>
                                            <div className="flex">
                                                <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path></svg>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-sm mx-4 mt-2 mb-4">{post.likes.length} likes</div>
                                        <div className="font-semibold text-sm mx-4 mt-1 mb-4">{post.message}</div>
                                        <div className="font-semibold text-sm mx-4 mt-3 mb-4">{timeAgo(post.created_at)}</div>
                                    </div>
                                }
                            </>
                        ))
                        }
                    </div>
                </div>
            </div>


            {onOpen &&
                <div className="absolute w-96 border-2 shadow-md m-3 md:m-0 p-5 top-52 md:top-64 bg-white">
                    <h2 className="text-lg font-bold">You are about to post something!</h2>
                    <div className="mt-3">
                        <Input label="Image url" placeholder="Paste your image URL" name={"image"} value={formState.image} onChange={handleChange} />
                        <Input label="Message" placeholder="Write a message" name={"message"} value={formState.message} onChange={handleChange} />
                        <Input label="Location" placeholder="Write a location" name={"location"} value={formState.location} onChange={handleChange} />
                    </div>
                    <div className="flex gap-5">
                        <Button onClick={handlePost}>
                            Post
                        </Button>
                        <Button onClick={() => setOnOpen(!onOpen)}>
                            Close
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default TechUserInterface