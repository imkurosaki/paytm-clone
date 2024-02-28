interface IHeaders {
    header: string,
    subHeader: string
}

export default function Header ({header, subHeader}: IHeaders) {
    return <div className="text-center">
        <p className="font-black text-4xl mb-5">{header}</p>
        <p className="text-gray-500 tracking-wide">{subHeader}</p>
    </div>
}