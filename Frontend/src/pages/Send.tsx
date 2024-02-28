import axios from "axios";
import { capitalizeFirstLetter } from "../lib/capitalizeLetter";
import { useRef, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";

export default function Send() {
    const queryParameter: URLSearchParams = new URLSearchParams(window.location.search);
    const id: string | any = queryParameter.get("_id")
    const firstName: string | any = queryParameter.get("firstName")
    const lastName: string | any = queryParameter.get("lastName")
    const [amount, setAmount]: number | any = useState(0);
    const debouncingRef = useRef<number>(0);
    const navigate: NavigateFunction = useNavigate();

    const sendMoneyHandler: Function = async (): Promise<void> => {
        try {
            if (amount <= 0) throw Error;

            const { data }: any = await axios.post(`http://localhost:8000/api/v1/account/transfer`, {
                "to": id,
                "amount": parseInt(amount)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${JSON.parse(localStorage.getItem('user') || "").token}`
                }
            });
            toast.success(data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (error: any) {
            toast.error((amount <= 0) ? `Please enter an amount` : error.response.data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            })
        }
    }

    const amountHandler: Function = (e: any): void => {
        if (e.target.value > 0) {
            clearTimeout(debouncingRef.current);
            debouncingRef.current = setTimeout(() => {
                setAmount(e.target.value);
            }, 300);
        } else {
            setAmount(0);
        }
    }

    return <div className="flex items-center h-screen justify-center bg-gray-100">
        <div className="bg-white w-[450px] p-10 rounded-lg shadow-lg">
            <p className="font-black text-3xl text-center mb-20">Send Money</p>
            <div>
                <div className="flex items-center gap-4 ">
                    <p className="px-4 py-2 bg-green-500 text-white font-bold text-lg rounded-full cursor-pointer">{capitalizeFirstLetter(firstName[0])}</p>
                    <p className="font-bold text-xl">{capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}</p>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium">Amount (in Rs)</p>
                    <input type="text" placeholder="Enter amount" onChange={(e) => amountHandler(e)} className="border rounded-md px-3 py-2" />
                    <button onClick={() => sendMoneyHandler()} className="text-white font-semibold bg-green-500 rounded-md py-2">Initiate Transfer</button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    </div>
}1