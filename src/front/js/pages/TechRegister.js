import React, {useState} from "react";

import { Link, useNavigate } from "react-router-dom";

import Input from "../component/globalComponents/Input";
import Button from "../component/globalComponents/Button";

import useForm from "../hooks/useForm"

const TechRegister = () => {

    const navigate = useNavigate();

    const [formState, handleChange] = useForm({
        avatar: "",
        name: "",
        surname: "",
        username: "",
        password: ""
    })

    const [errorFlag, setErrorFlag] = useState(undefined)

    const handleClick = async (e) => {
        //Take care that all fields are filled excep for avatar
        const hasEmptyFields = Object.entries(formState)
        .filter(([key]) => key !== 'avatar')
        .some(([_, value]) => value.trim() === "");


        if (hasEmptyFields) {
            alert("Please, fill all the inputs");
        } else {
            e.preventDefault();

            try {
                const res = await fetch(process.env.BACKEND_URL + '/api/register', {
                    method: "POST",
                    body: JSON.stringify(formState),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    setErrorFlag(data.msg)
                    throw new Error
                }
                if(data[1].check === true){
                    navigate("/")
                }
            } catch (error) {
                console.error("Error al registrar:", error.msg);
            }
        }
    };

    return (
        <>
            <div className="h-lvh flex flex-col items-center justify-center">
                <h1 className="text-5xl fon-bold grow-0 w-full p-5 border-b-2 shadow-md">Digital Tech Inc.</h1>
                <div className="grow flex items-center">
                    <div className="flex flex-col border-2 p-4 w-80 md:w-96 justify-between">
                        <h1 className="font-bold text-3xl mb-6">Register</h1>
                        <div>
                            <Input label="Avatar Url" placeholder="Write an avatar url" name={"avatar"} value={formState.avatar} onChange={handleChange} />
                            <Input label="Name" placeholder="Write your name" name={"name"} value={formState.name} onChange={handleChange} />
                            <Input label="Surname" placeholder="Write your surname" name={"surname"} value={formState.surname} onChange={handleChange} />
                            <Input label="Username" placeholder="Write your username" name={"username"} value={formState.username} onChange={handleChange} />
                            <Input label="Password" placeholder="Write your password" name={"password"} value={formState.password} onChange={handleChange} type="password" />
                        </div>
                        <div className="flex gap-2 mt-1 md:mt-0">
                            <Button onClick={handleClick} variant="outlined">Register</Button>
                            <Link to={"/"}>
                                <Button variant="outlined">Back to Login</Button>
                            </Link>
                        </div>
                        {errorFlag &&
                            <small className="mt-2 font-bold">{errorFlag}</small>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default TechRegister
