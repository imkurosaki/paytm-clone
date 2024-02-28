import { useRef, useState } from "react"
import Header from "../components/Header"
import InputBox from "../components/InputBox"
import InputPassword from "../components/InputPassword"
import Button from "../components/Button"
import { Bounce, ToastContainer, toast } from "react-toastify"
import { Link, NavigateFunction, useNavigate } from "react-router-dom"
import axios from "axios"
import { useSetRecoilState } from "recoil"
import { UserProfileAtom } from "../atom/atom"
import { capitalizeFirstLetter } from "../lib/capitalizeLetter"

interface ISignin {
    username: string,
    password: string
}

export default function Signin() {
    const [signin, setSignin] = useState<ISignin>({
        username: "",
        password: ""
    });
    const debouncingRef = useRef<number>(0);
    const navigate: NavigateFunction = useNavigate();
    const setUserProfileAtom: Function = useSetRecoilState(UserProfileAtom)

    const signinHandler: Function = (e: any): void => {
        clearTimeout(debouncingRef.current)
        debouncingRef.current = setTimeout(() => {
            setSignin({ ...signin, [e.target.name]: e.target.value })
        }, 300);
    }

    const submitHandler: Function = async(): Promise<void> => {
        try {
            const { data } = await axios.post('http://localhost:8000/api/v1/user/signin', signin)
            // toast.success('Account successfully created', {
            //     position: "top-center",
            //     autoClose: 2000,
            //     hideProgressBar: true,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            //     transition: Bounce,
            // });
            localStorage.setItem("user", JSON.stringify(data));
            setUserProfileAtom({
                firstName: capitalizeFirstLetter(data.firstName),
                lastName: capitalizeFirstLetter(data.lastName),
                created_at: data.created_at,
            })
            navigate("/dashboard");
        } catch(error: any) {
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
            <Header header={"Sign In"} subHeader={"Enter your credentials to access your account"} />
            <div className="flex flex-col gap-3">
                <InputBox name={"username"} label={"Email"} placeholder={"johndoe@example.com"} onClick={signinHandler} />
                <InputPassword signupHandler={signinHandler} />
                <Button label={"Sign In"} onClick={submitHandler} />
                <p className="tracking-wide text-center">Don't have an account? <Link to={"/signup"} className="underline">Sign Up</Link></p>
                <ToastContainer />
            </div>
        </div>
    </div>
}