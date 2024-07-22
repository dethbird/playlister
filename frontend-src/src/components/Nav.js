import React from 'react';

function Nav({ spotifyUser }) {

    const renderLoggedIn = () => {
        return <>
            <div>
                <img src={ spotifyUser.images[0].url} />
                {spotifyUser.display_name}
            </div>
            <div><a href="/logout">Logout</a></div>
            </>
    }

    const renderLoggedOut = () => {
        return <a href='/auth/spotify'>Login with Spotify</a>;
    }

    return (
        <div className="Nav">
            {spotifyUser.display_name ? renderLoggedIn() : renderLoggedOut()}
        </div>
    );
}

export default Nav;
