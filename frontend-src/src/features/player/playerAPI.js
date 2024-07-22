export function getCurrentlyPlaying() {
  fetch('/player/currently-playing')
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error getting currently playing track:', error);
    });
}
