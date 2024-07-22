import React from 'react';

function Nav({ spotifyUser }) {
    return (
        <div className="Nav">
            <div>
                <img src={ spotifyUser.images[0].url} />
                {spotifyUser.display_name}
            </div>
            <div><a href="/logout">Logout</a></div>
        </div>
    );
}

export default Nav;
