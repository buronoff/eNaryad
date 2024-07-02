const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer')

const auth_controller = require('./auth_controller')
const hadbook_controller = require('./handbook_controller')
const rules_controller = require('./rules_controller')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ЗАГРУЗКА ФАЙЛОВ */
const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ 'res': 'dd' });
  //res.json({ file: req.file });
});


/* АВТОРИЗАЦИЯ */
app.post('/auth/login',auth_controller.login);



/* СПРАВОЧНИК */
app.get('/podrazdeleniya_get', hadbook_controller.podrazdeleniya_get);
app.post('/podrazdeleniya_set', hadbook_controller.podrazdeleniya_set);
app.post('/podrazdeleniya_del', hadbook_controller.podrazdeleniya_del);

app.get('/uchastok_get', hadbook_controller.uchastok_get)
app.post('/uchastok_set', hadbook_controller.uchastok_set)
app.post('/uchastok_del', hadbook_controller.uchastok_del)

app.get('/dolzhnost_get', hadbook_controller.dolzhnost_get)
app.post('/dolzhnost_set', hadbook_controller.dolzhnost_set)
app.post('/dolzhnost_del', hadbook_controller.dolzhnost_del)


/* ПРАВИЛА */
app.get('/rules_list_get',rules_controller.rules_list_get);
app.post('/rules_list_set',rules_controller.rules_list_set);
app.post('/rules_list_del',rules_controller.rules_list_del);

/* ПРАВИЛА ДЛЯ ГРУПП*/
app.get('/rules_list_by_group_get',rules_controller.rules_list_by_group_get);
app.post('/rules_list_by_group_set',rules_controller.rules_list_by_group_set);
app.get('/dolznost_list_by_uchastok_id_get',rules_controller.dolznost_list_by_uchastok_id_get);


export default {
  path: '/api',
  handler: app
}
