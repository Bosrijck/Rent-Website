import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter} from 'react-router-dom';
import passport from 'passport';
import App from './app';
import '../../config/passport';
const models = require('../db/models');


let router = express.Router();

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true,
}));


router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true,
}));

router.get('/login', (req, res) => {
    const context = {};

    const html = ReactDOMServer.renderToString(
        <StaticRouter
            location={req.url}
            context={context}
        >
            <App/>
        </StaticRouter>
    );

    res.render('login.ejs', {
        html: html,
        message: req.flash('signupMessage')
    });
});

router.get('/signup', function(req, res) {
    let context = {};

    const html = ReactDOMServer.renderToString(
        <StaticRouter
            location={req.url}
            context={context}
        >
            <App/>
        </StaticRouter>
    );
    res.render('signup.ejs', {
        html: html, message: req.flash('loginMessage')
    });
});

export default router;