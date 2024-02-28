interface IButton {
    label: string,
    onClick: Function
}

export default function Button({ label, onClick }: IButton) {
    return <button onClick={() => { onClick() }} className="w-full text-center py-3 bg-black rounded-md">
        <p className="text-white text-lg">{label}</p>
    </button>
}