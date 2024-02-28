
const capitalizeFirstLetter: Function = (inputString: string): string => {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export {
    capitalizeFirstLetter
}