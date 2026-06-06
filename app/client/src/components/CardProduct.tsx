import { ButtonAddProduct } from "ui-shared/components/ui/ButtonAddProduct";

export interface CardProductProps {
    name: string;
    itens: string;
    price: number;
    promotionPrice?: number;
    imageUrl: string;
    onClick: () => void;
}





export function CardProduct({ name, itens, price, promotionPrice, imageUrl, onClick }: CardProductProps) {

    return (
        <div className="w-52 h-auto p-4 bg-(--Widget-background) rounded-lg flex flex-col items-center justify-center gap-4 shadow-lg">
            <img src={imageUrl} alt={name} className="w-40 h-40 object-cover rounded-md" />

            <div className="flex flex-col items-start gap-2 w-full">

                <h2 className="text-lg font-bold text-white">{name}</h2>
                <p className="text-(--Primary-off) text-sm font-secondary overflow-hidden text-ellipsis line-clamp-2">{itens}</p>
                
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        {promotionPrice !== undefined && (
                            <span className="text-base font-bold text-yellow-400">R$ {promotionPrice.toFixed(2)}</span>
                        )}
                        <span className={`text-base font-bold ${promotionPrice !== undefined ? 'text-gray-400 line-through' : 'text-green-400'}`}>
                            R$ {price.toFixed(2)}
                        </span>
                    </div>

                    <ButtonAddProduct onClick={onClick} />
                </div>
            </div>
        </div>
    );
}