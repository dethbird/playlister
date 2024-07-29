import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getFavoritePlaylists,
    selectFavoriteStatus,
    selectFavoritePlaylists,
    selectFavoriteDialogIsOpen,
    toggleFavoriteDialog
} from '../managedPlaylists/managedPlaylistsSlice';



import {FavoritePlaylistItem } from './FavoritePlaylistItem';


export function FavoritePlaylists() {

    const favoritePlaylists = useSelector(selectFavoritePlaylists);
    const favoriteDialogIsOpen = useSelector(selectFavoriteDialogIsOpen);
    const favoriteStatus = useSelector(selectFavoriteStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFavoritePlaylists());
    }, [dispatch]);

    if (!favoriteDialogIsOpen) {
        return null;
    }

    const renderItems = () => {

        if (favoriteStatus === 'rejected') {
            return <div>Error...</div>;
        }

        if (['pending', 'idle'].includes(favoriteStatus) && !favoritePlaylists) {
            return <div aria-busy="true"></div>;
        }

        return favoritePlaylists.map(item => {
            return <FavoritePlaylistItem playlist={item} />;
        })
    }

    return (
        <dialog open={favoriteDialogIsOpen} className='FavoritePlaylistsList'>
            <article>
                <header>
                    <button onClick={() => { dispatch(toggleFavoriteDialog()) }}>Close</button>
                    <p></p>
                </header>
                <div>{renderItems()}</div>
            </article>
        </dialog>
    );
}
