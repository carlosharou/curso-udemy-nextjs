import { FavoritePokemons } from "@/pokemons/index";
import { IoHeartOutline } from "react-icons/io5";


export const metadata = {
    title: 'Favoritos',
    description: 'Descripción en la meta de Favoritos'
}


export default async function PokemonsPage() {
    return (
        <div className="flex flex-col">
            <span className="text-5xl my-2">Pokémons Favoritos <small className="text-blue-500">Global State</small></span>
            
            <FavoritePokemons />
        </div>
    );
}