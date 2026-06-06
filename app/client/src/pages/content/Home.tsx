import { ProductCard } from "../../components/ProductCard";
import { DestakCard } from "../../components/DestakCard";


export function Home() {

    return (
        <div className="w-full h-fit gap-4 flex flex-col items-center justify-center">

            <DestakCard
                title="Café Expresso"
                description="Item mais pedido."
                imageUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FmJTIwZXhwcmVzc298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                onClick={() => alert("Produto adicionado ao carrinho!")}
            />

            <div className="w-full h-fit gap-4 flex flex-wrap items-center justify-center">

                <ProductCard
                    name="Café Expresso"
                    itens="Grãos selecionados, torra média, sabor intenso e aroma marcante."
                    price={9.99}
                    promotionPrice={7.99}
                    imageUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FmJTIwZXhwcmVzc298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                    onClick={() => alert("Produto adicionado ao carrinho!")}
                />

                <ProductCard
                    name="Café Expresso"
                    itens="Grãos selecionados, torra média, sabor intenso e aroma marcante."
                    price={9.99}
                    promotionPrice={7.99}
                    imageUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FmJTIwZXhwcmVzc298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                    onClick={() => alert("Produto adicionado ao carrinho!")}
                />

                <ProductCard
                    name="Café Expresso"
                    itens="Grãos selecionados, torra média, sabor intenso e aroma marcante."
                    price={9.99}
                    promotionPrice={7.99}
                    imageUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FmJTIwZXhwcmVzc298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                    onClick={() => alert("Produto adicionado ao carrinho!")}
                />



            </div>
        </div >
    );

}