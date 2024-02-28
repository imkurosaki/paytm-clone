import axios from "axios";
import { useRef, useState } from "react"
import Header from "../components/Header";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import InputPassword from "../components/InputPassword";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface ISignup {
    firstName: string,
    lastName: string,
    username: string,
    password: string
}

export default function Signup() {
    const [signup, setSignup] = useState<ISignup>({
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    })
    const debouncingRef = useRef<number>(0);
    const navigate: NavigateFunction = useNavigate();

    const signupHandler: Function = (e: any): void => {
        clearTimeout(debouncingRef.current)
        debouncingRef.current = setTimeout(() => {
            setSignup({ ...signup, [e.target.name]: e.target.value })
        }, 300);
    }

    const submitHandler: Function = async (): Promise<void> => {
        try {
            const { data } = await axios.post('http://localhost:8000/api/v1/user/signup', signup)
            toast.success(data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            setTimeout(() => {
                navigate('/login')
            }, 1000);
        } catch (error: any) {
            toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    }

    return <div className="flex justify-center items-center h-screen">
        <div className="w-[450px] flex flex-col gap-5 border p-9 rounded-lg">
            <Header header={"Sign Up"} subHeader={"Enter your information to create an account"} />
            <div className="flex flex-col gap-3">
                <InputBox name={"firstName"} label={"First Name"} placeholder={"John"} onClick={signupHandler} />
                <InputBox name={"lastName"} label={"Last Name"} placeholder={"Doe"} onClick={signupHandler} />
                <InputBox name={"username"} label={"Email"} placeholder={"hakirat@gmail.com"} onClick={signupHandler} />
                <InputPassword signupHandler={signupHandler} />
                <Button label={"Sign Up"} onClick={() => submitHandler()} />
                <p className="tracking-wide text-center">Already have an account? <Link to={"/signin"} className="underline">Login</Link></p>
                <ToastContainer />
            </div>
        </div>
    </div>
}