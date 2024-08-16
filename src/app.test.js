const request = require('supertest');
const app = require('./app');
const SpotifyStrategy = require('passport-spotify').Strategy;

const { mockSessionUser } = require('../testutils/mocks/contants');

// mock spotify strategy to set the session user
jest.mock('passport-spotify', () => {
    const Strategy = jest.fn();
    Strategy.prototype.name = 'spotify';
    Strategy.prototype.authenticate = jest.fn(function (req) {
        this.success(mockSessionUser);
    });
    return { Strategy };
});


/* Health check */
describe('GET /hello', () => {
    it('should respond with a helo world message (healthcheck)', async () => {
        const response = await request(app).get('/hello');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Hello, World!');
    });
});

/* React root route */
describe('GET /', () => {

    let agent;

    beforeEach(() => {
        // a new agent for each test
        agent = request.agent(app);
    });

    it('should render the index template and pass empty user info if not logged in', async () => {
        const renderSpy = jest.spyOn(app.response, 'render');
        await request(app).get('/');
        expect(renderSpy).toHaveBeenCalledWith('index', { "_locals": {}, "spotifyUserJson": "{}", "title": "Spotify Playlister", "user": undefined });
    });

    it('should render the index template with user info if logged in', async () => {

        // authenticate the user
        await agent.get('/auth/spotify/callback?code=valid-code')

        const renderSpy = jest.spyOn(app.response, 'render');
        const response = await agent.get('/');
        expect(renderSpy).toHaveBeenCalledWith('index', { "_locals": {}, "spotifyUserJson": "{\"id\":\"1267654234\",\"display_name\":\"David Coldplay\",\"images\":[{\"url\":\"https://i.scdn.co/image/ab67757000003b82bfe4a87bb89364982a8ea74d\"}]}", "title": "Spotify Playlister", "user": { "accessToken": "XXXX", "spotifyUser": { "display_name": "David Coldplay", "id": "1267654234", "images": [{ "url": "https://i.scdn.co/image/ab67757000003b82bfe4a87bb89364982a8ea74d" }] }, "user": { "theme": "dark" } } });
    });
});
