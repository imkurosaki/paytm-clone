import axios from "axios";
import { useEffect, useRef, useState } from "react"
import User from "./User";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const debouncingRef = useRef<number>(0);

    const searchHandler: Function = (e: any): any => {
        clearTimeout(debouncingRef.current);
        debouncingRef.current = setTimeout(() => setFilter(e.target.value), 300)
    }

    useEffect(() => {
        const usersFetch: Function = async (): Promise<void> => {
            try {
                const { data } = await axios.get(`http://localhost:8000/api/v1/user/bulk?filter=${filter}`, {
                    headers: {
                        'Authorization': `${JSON.parse(localStorage.getItem('user') || "").token}`
                    }
                });
                setUsers(data.users);
            } catch (error: any) {
                setUsers([]);
            }
        }
        usersFetch();
    }, [filter]);

    return (
        <div className="flex flex-col gap-6">
            <p className="font-bold text-lg">Users</p>
            <input type="text" onChange={(e) => searchHandler(e)} placeholder="Search users..." className="border rounded-md px-4 py-2 w-full" />
            <div className="flex flex-col gap-2">
                {users.length === 0
                    ?
                    <p>User not found</p>
                    :
                    users.map((user: any, index: number): any => {
                        return <User key={index} _id={user._id} firstName={user.firstName} lastName={user.lastName} />
                    })
                }
            </div>
        </div>
    );
}