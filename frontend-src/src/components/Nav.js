import React from 'react';

function Nav({ spotifyUser }) {
    return (
        <div className="Nav row">
            <div className="col-xs-offset-9 col-xs-3">
                <div className="UserDetails">
                    <img src={spotifyUser.images[0].url} className="UserImage" />
                    {spotifyUser.display_name}
                    <br />
                    <a href="/logout">Logout</a>
                </div>

            </div>

        </div>
    );
}

export default Nav;
