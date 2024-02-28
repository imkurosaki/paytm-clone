import { useRecoilState } from "recoil"
import { BalanceAtom } from "../atom/atom";
import { useEffect } from "react";
import axios from "axios";

export default function Balance() {
    const [balance, setBalance]: number | any = useRecoilState(BalanceAtom);

    useEffect(() => {
        const balanceFetch: Function = async(): Promise<void> => {
            const { data } = await axios.get('http://localhost:8000/api/v1/account/balance', {
                headers: {
                    'Authorization': `${JSON.parse(localStorage.getItem("user") || "").token}`
                }
            });
            setBalance(data.message);
        }
        balanceFetch();
    }, []);

    return <p className="font-bold text-lg">Your Balance Rs {balance}</p>
}