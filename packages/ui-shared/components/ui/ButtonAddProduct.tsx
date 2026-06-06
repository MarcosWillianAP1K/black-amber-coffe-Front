


export interface ButtonAddProductProps {
    onClick: () => void;
}


export const ButtonAddProduct = ({ onClick }: ButtonAddProductProps) => {
    return (
        <button
            type="button"
            className="px-6 py-3 rounded-md bg-(--Button-background) text-white font-primary font-medium"
            onClick={onClick}
        >
            +
        </button>
    );
}
