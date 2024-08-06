import React,{useState, useContext} from "react";

import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

import Input from "../component/globalComponents/Input";
import Button from "../component/globalComponents/Button";

import useForm from '../hooks/useForm';

const TechLogin = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate()

    //------------USE STATES-------------
    const [errorFlag, setErrorFlag] = useState(undefined)
    const [formState, handleChange] = useForm({
        username: '',
        password: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault()
        const logged = await actions.handleLogin(formState)
        if (logged) navigate("/interface")
        else setErrorFlag(true)
    }

    //------------------LOGS----------------------
    // console.log(formState.username)
    // console.log(formState.password)

    return (
        <>
            <div className="h-lvh flex flex-col items-center justify-center">
                <h1 className="text-5xl fon-bold grow-0 w-full p-5 border-b-2 shadow-md">Digital Tech Inc.</h1>
                <div className="grow flex items-center">
                    <div className="flex flex-col border-2 p-4 w-80 md:h-96 md:w-96 justify-between ">
                        <h1 className="font-bold text-3xl mb-6 md:mb-0">Login</h1>
                        <div>
                            <Input label="Username" placeholder="Write your username" name={"username"} value={formState.username} onChange={handleChange} />
                            <Input label="Password" placeholder="Write your password" name={"password"} value={formState.password} onChange={handleChange} type="password" />
                        </div>
                        <div className="flex gap-2 mt-1 md:mt-0">
                            <Button variant="outlined" onClick={handleLogin}>Login</Button>
                            <Link to="/register">
                                <Button variant="outlined">Register</Button>
                            </Link>
                        </div>
                        {errorFlag &&
                            <small className="mt-2 font-bold">Usuario o contraseña incorrectos</small>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default TechLogin