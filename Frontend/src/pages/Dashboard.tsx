import React from "react"
import Appbar from "../components/Appbar"
import Balance from "../components/Balance"
import Users from "../components/Users"

export default function Dashboard() {

    return <div>
        <React.Suspense>
            <Appbar />
            <div className="p-6 flex flex-col gap-6">
                <Balance />
                <Users />
            </div>
        </React.Suspense>
    </div>
}