import { useRecoilValue } from "recoil"
import { UserProfileAtom } from "../atom/atom"

interface IProfile {
    firstName: string,
    lastName: string,
}

export default function Appbar() {
    const { firstName, lastName }: IProfile = useRecoilValue(UserProfileAtom);

    return <div className="flex justify-between items-center border-b-2 p-4 shadow-sm">
        <p className="font-bold text-2xl">Payments App</p>
        <div className="flex gap-5 text-lg">
            <p className="flex items-center">Hello, {firstName} {lastName}</p>
            <p className="px-4 py-2 bg-gray-200 rounded-full cursor-pointer">{firstName[0]}</p>
        </div>
    </div>
}