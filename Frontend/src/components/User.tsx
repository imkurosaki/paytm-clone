import { NavigateFunction, useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../lib/capitalizeLetter";

interface IProfile {
    _id: string,
    firstName: string,
    lastName: string,
}

export default function User({ _id, firstName, lastName }: IProfile) {
    const navigate: NavigateFunction = useNavigate();
    const buttonHandler: Function = (): void => {
        navigate(`/send?_id=${_id}&firstName=${firstName}&lastName=${lastName}`);
    }

    return <div className="flex justify-between group cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
        <div className="flex items-center gap-4">
            <p className="px-4 py-2 bg-gray-200 font-semibold rounded-full cursor-pointer group-hover:bg-green-400 group-hover:text-white">{capitalizeFirstLetter(firstName[0])}</p>
            <p className="font-bold">{capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}</p>
        </div>
        <button className="bg-black text-white px-4 rounded-lg" onClick={() => buttonHandler()}>Send Money</button>
    </div>
}