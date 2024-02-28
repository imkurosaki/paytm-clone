interface InputBox {
    name: string,
    label: string,
    placeholder: string,
    onClick: Function
}

export default function InputBox({ name, label, placeholder, onClick }: InputBox) {
    return <div>
        <p className="font-bold tracking-wide mb-2">{label}</p>
        <input type="text" name={name} placeholder={placeholder} onChange={(e) => { onClick(e) }} className="px-4 py-3 border rounded-md w-full" />
    </div>
}