const express = require('express')
const bodyParser = require('body-parser');
const requestIp = require('request-ip');

const auth_controller = require('./auth_controller')
const naryad_conrtoller = require('./naryad_conrtoller')

const app = express()
app.use(requestIp.mw());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* АВТОРИЗАЦИЯ */
app.post('/auth/login',auth_controller.login);
app.post('/auth/logout',auth_controller.logout);
app.post('/auth/create_login',auth_controller.create_login);
app.get('/auth/user',auth_controller.user);


/* НАРЯД АВТОСАМОСВАЛОВ */
app.get('/get_api_dtsm_list',naryad_conrtoller.get_api_dtsm_list);
app.get('/get_api_narayd_ac',naryad_conrtoller.get_api_narayd_ac);
app.get('/get_uchastok',naryad_conrtoller.get_uchastok);

export default {
  path: '/api',
  handler: app
}
