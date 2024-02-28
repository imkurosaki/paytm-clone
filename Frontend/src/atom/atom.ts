import { atom, selector } from "recoil";
import { capitalizeFirstLetter } from "../lib/capitalizeLetter";
import axios from "axios";

const UserProfileAtom: any = atom({
    key: "UserProfileAtom",
    default: selector({
        key: "UserProfileSelector",
        get: () => {
            const user: any = JSON.parse(localStorage.getItem("user") || "")
            return {
                firstName: capitalizeFirstLetter(user.firstName),
                lastName: capitalizeFirstLetter(user.lastName),
                created_at: user.created_at,
            }
        }
    })
});

const BalanceAtom: any = atom({
    key: "BalanceAtom",
    default: selector({
        key: "Balance/Default",
        get: async (): Promise<number> => {
            const { data } = await axios.get('http://localhost:8000/api/v1/account/balance', {
                headers: {
                    'Authorization': `${JSON.parse(localStorage.getItem("user") || "").token}`
                }
            });
            return data.message;
        }
    })
});

export {
    UserProfileAtom,
    BalanceAtom,
}