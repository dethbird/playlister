const request = require('supertest');
const passport = require('passport');
const app = require('./app');

const mockUser = {};
const mockSpotifyUser = {};

describe('GET /hello', () => {
    it('should respond with a helo world message', async () => {
        const response = await request(app).get('/hello');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Hello, World!');
    });
});

describe('GET /', () => {
    it('should render the index template and pass empty user info if not logged in', async () => {
        const renderSpy = jest.spyOn(app.response, 'render');
        await request(app).get('/');
        expect(renderSpy).toHaveBeenCalledWith('index', { "_locals": {}, "spotifyUserJson": "{}", "title": "Spotify Playlister", "user": undefined });
    });
    // it('should render the index template with user info if logged in', async () => {
    //     const mockSession = {
    //         user: mockUser,
    //         spotifyUser: mockSpotifyUser
    //     };
    //     app.use((req, res, next) => {
    //         req.user = mockSession;
    //         next();
    //     });
    //     const renderSpy = jest.spyOn(app.response, 'render');
    //     await request(app).get('/');
    //     expect(renderSpy).toHaveBeenCalledWith('index');
    // });
    // it('should render the index template with user info if logged in', async () => {
    //     const mockSession = {
    //         user: mockUser,
    //         spotifyUser: mockSpotifyUser
    //     };

    //     jest.mock('passport', () => ({
    //         authenticate: jest.fn(() => (req, res, next) => {
    //             console.log('here');
    //             req.isAuthenticated = () => true;
    //             req.user = mockSession;
    //             next();
    //         }),
    //     }));
    //     console.log(passport.authenticate());
    //     const renderSpy = jest.spyOn(app.response, 'render');
    //     await request(app).get('/');
    //     expect(renderSpy).toHaveBeenCalledWith('index');
    // });
});
