import { SimplePokemon } from "@/pokemons";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface PokemonsState {
    favorites: {
        [key: string]: SimplePokemon
    }
}


/*const getInitialState = () => {
    const favorites = JSON.parse(localStorage.getItem('favorite-pokemons') ?? '{}');

    return favorites;
};*/


const initialState: PokemonsState = {
    //'1': { id: '1', name: 'bulbasaur' }
    //...getInitialState()
    favorites: {}
}


const pokemonsSlice = createSlice({
    name: 'pokemons',
    initialState,
    reducers: {
        toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
            const pokemon = action.payload;
            const { id } = pokemon;

            if (!!state.favorites[id]) {
                delete state.favorites[id];
                //return;
            } else {
                state.favorites[id] = pokemon;
            }

            // TODO; No se debe de hacer en redux
            localStorage.setItem('favorite-pokemons', JSON.stringify(state.favorites));
        },
        setFavoritePokemons(state, action: PayloadAction<{ [key: string]: SimplePokemon }>) {
            state.favorites = action.payload;
        }
    }
});


export const { toggleFavorite, setFavoritePokemons } = pokemonsSlice.actions;
export default pokemonsSlice.reducer;