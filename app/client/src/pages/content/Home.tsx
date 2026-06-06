import { CardProduct } from "../../components/CardProduct";


export function Home() {

    return (
        <div className="w-full h-full flex items-center justify-center">
            <h1 className=" text-white text-2xl font-bold">
                Bem-vindo ao Black Amber Coffee!
            </h1>

            <CardProduct
                name="Café Expresso"
                itens="Grãos selecionados, torra média, sabor intenso e aroma marcante."
                price={9.99}
                promotionPrice={7.99}
                imageUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FmJTIwZXhwcmVzc298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                onClick={() => alert("Produto adicionado ao carrinho!")}
            />
        </div>
    );

}