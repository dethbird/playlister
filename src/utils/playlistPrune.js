// Helper utilities to prune Spotify playlist objects down to the minimal metadata
// the frontend requires. This keeps API responses small and consistent.

function prunePlaylist(p) {
    if (!p) return null;
    return {
        id: p.id,
        name: p.name,
        images: p.images || [],
        tracks: { total: (p.tracks && (typeof p.tracks.total !== 'undefined')) ? p.tracks.total : (p.tracks || {}).total || 0 },
        uri: p.uri,
        snapshot_id: p.snapshot_id,
        owner: { id: (p.owner && p.owner.id) ? p.owner.id : null }
    };
}

function prunePage(body) {
    if (!body) return { items: [] };
    const items = (body.items || []).map(prunePlaylist);
    return Object.assign({}, body, { items });
}

module.exports = { prunePlaylist, prunePage };
