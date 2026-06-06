


export interface ButtonAddProductProps {
    onClick: () => void;
}


export const ButtonAddProduct = ({ onClick }: ButtonAddProductProps) => {
    return (
        <button
            type="button"
            className="w-fit h-fit inline-flex items-center justify-center px-3 py-2 rounded-sm bg-(--Button-background) text-white font-primary font-[12px] focus:outline-none ring-0 leading-none"
            onClick={onClick}
        >
            +
        </button>
    );
}
