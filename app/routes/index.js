import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter} from 'react-router-dom';
import reducers from '../views/src/reducers/index';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ADD_ITEM } from '../views/src/actions/list_actions';
import passport from 'passport';
import App from './app';

let router = express.Router();

router.get('/', (req, res) => {
    const context = {};
    const store = createStore(reducers);

    store.dispatch({
        type: ADD_ITEM,
        payload: {
            name: 'Components',
            description: 'Description for components'
        }
    });

    const finalState = JSON.stringify(store.getState());
    const html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter
                location={req.url}
                context={context}
            >
                <App/>
            </StaticRouter>
        </Provider>
    );
    res.render('index.ejs', {
        initialState: finalState,
        html: html,
    });
    // res.status(200).send(renderFullPage(html, finalState));
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    }),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/' + req.user.username);
    });

router.get('/signup', function(req, res) {
    const context = {};
    const store = createStore(reducers);

    store.dispatch({
        type: ADD_ITEM,
        payload: {
            name: 'Components',
            description: 'Description for components'
        }
    });

    const finalState = store.getState();
    const html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter
                location={req.url}
                context={context}
            >
                <App/>
            </StaticRouter>
        </Provider>
    );

    res.status(200).send(renderFullPage(html, finalState));
    // res.render('register', {message: req.flash('message')});
});


router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }));

router.get('/login', (req, res) => {
    const context = {};

    const finalState = store.getState();
    const html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter
                location={req.url}
                context={context}
            >
                <App/>
            </StaticRouter>
        </Provider>
    );

    res.status(200).send(renderFullPage(html, finalState));
});

function renderFullPage(html, initialState) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    	<!-- Required meta tags always come first -->
    	<meta charset="utf-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    	<meta http-equiv="x-ua-compatible" content="ie=edge">
    	<title>React Router Redux Express</title>

    	<!-- Bootstrap CSS -->
    	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" integrity="sha384-y3tfxAZXuh4HwSYylfB+J125MxIs6mR5FOHamPBG064zB+AFeWH94NdvaCBm8qnd" crossorigin="anonymous">
    	<link rel="stylesheet" href="../stylesheets/main.css">
    </head>
    <body>

    	<div id="reactbody"><div>${html}</div></div>
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
          </script>
    	<script src="../bin/app.bundle.js"></script>
    	<!-- jQuery first, then Bootstrap JS. -->
    	<script src="https://www.atlasestateagents.co.uk/javascript/tether.min.js"></script>
    	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js" integrity="sha384-vZ2WRJMwsjRMW/8U7i6PWi6AlO1L79snBrmgiDpgIWJ82z8eA5lenwvxbMV1PAh7" crossorigin="anonymous"></script>
    </body>
    </html>
    `
}

export default router;
