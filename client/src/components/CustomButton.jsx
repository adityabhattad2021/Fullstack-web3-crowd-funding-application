function CustomButton({
    buttonType,
    title,
    styles,
    handleClick
}){
    return(
        <button
            type={buttonType}
            className={`font-epilogue font-semibold text-[16px] leading-[16px] text-white min-h-[52px] px-4 rounded-xl ${styles}`}
            onClick={handleClick}
        >
            {title}
        </button>
    )
}


export default CustomButton;