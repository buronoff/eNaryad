const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer')
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const requestIp = require('request-ip');
const { queryData } = require('./db_connection')

const auth_controller = require('./auth_controller')

const app = express()
app.use(requestIp.mw());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



/* ЗАГРУЗКА ФАЙЛОВ */
function ifExistsDir(dir_name){
  let dir = path.join(__dirname, 'excel_files', dir_name)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir
}
function clearDir(dir){
  fs.readdir(dir, (err, files) => {
    if (err) {
      return err;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.unlink(filePath, err => {
        if (err) {
          return err;
        }
      });
    });
  });
  return dir
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ip = req.clientIp
    let uploadDir = ifExistsDir(ip)
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const utf8name = decodeURIComponent(escape(originalname));
    cb(null, utf8name);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (req.file.path) {

    setTimeout(async ()=>{
      let log = await readExcelFile(req.file.path)
      res.status(200).json({ res: log});
    },500)

  } else {
    res.status(400).json({ res: 'ошибка пи загрузке файла'});
  }
});

app.post('/cleardir', (req, res) => {
  try {
    const ip = req.clientIp
    let dir = ifExistsDir(ip)
    clearDir(dir)
    res.status(200).json({ res: 'каталог очищен'});
  }
  catch(err) {
    res.status(400).json({ res: err});
  }
});


/* ЗАПИСЬ ДАННЫХ */
app.post('/addval', (req, res) => {
  let ip = req.clientIp
  let user_name = 'test'

  let file_name = req.body.file_name
  let c_date = req.body.c_date
  let karyer = req.body.karyer
  let passport_name = req.body.passport_name
  let blok = req.body.blok
  let qatlam = req.body.qatlam
  let tartib_raqami = req.body.tartib_raqami
  let quduqlar_soni = req.body.quduqlar_soni
  let quduqlar_guruhi = req.body.quduqlar_guruhi
  let pogona_balandligi = req.body.pogona_balandligi
  let quduq_diametri = req.body.quduq_diametri
  let ortiqcha_burgulash = req.body.ortiqcha_burgulash
  let oraliq_masofa_a = req.body.oraliq_masofa_a
  let oraliq_masofa_b = req.body.oraliq_masofa_b
  let solishtirma_sarf = req.body.solishtirma_sarf
  let quduqda_joylashgan_zaryad = req.body.quduqda_joylashgan_zaryad
  let kol_vo_boyevikov = req.body.kol_vo_boyevikov
  let nalichiye_vodi = req.body.nalichiye_vodi
  let obyom_vzrivchatki = req.body.obyom_vzrivchatki
  let zaryad = req.body.zaryad
  let zaboyka = req.body.zaboyka


  let reqText = "exec dbo.sp_add_values "+
    "'" + ip + "'," +
    "'" + user_name + "'," +
    "'" + file_name + "'," +
    "'" + c_date + "'," +
    "'" + karyer + "'," +
    "'" + passport_name + "'," +
    "'" + blok + "'," +
    "'" + qatlam + "'," +
    "" + tartib_raqami + "," +
    "" + quduqlar_soni + "," +
    "'" + quduqlar_guruhi + "'," +
    "" + pogona_balandligi + "," +
    "" + quduq_diametri + "," +
    "" + ortiqcha_burgulash + "," +
    "" + oraliq_masofa_a + "," +
    "" + oraliq_masofa_b + "," +
    "" + solishtirma_sarf + "," +
    "" + quduqda_joylashgan_zaryad + "," +
    "" + kol_vo_boyevikov + "," +
    "'" + nalichiye_vodi + "'," +
    "" + obyom_vzrivchatki + "," +
    "" + zaryad + "," +
    "" + zaboyka


  queryData(reqText).then(rows => {
    var obj = rows
    if (obj.data) {
      res.status(200).json({'status': 'OK', 'data': obj.data})
    } else {
      res.status(400).json({'status': 'Error', 'data': obj.error.originalError.info.message})
    }
  }).catch((err)=> {
    res.status(400).json({'status': 'Error', 'data': err})
  })
});

app.post('/hasRows', (req, res) => {

  let c_date = req.body.c_date
  let file_name = req.body.file_name
  let passport_name = req.body.passport_name

  let reqText = "exec dbo.sp_select_values_by '" + c_date + "','" + file_name + "','" + passport_name + "'"

  queryData(reqText).then(rows => {
    var obj = rows
    if (obj.data) {
      res.status(200).json({'status': 'OK', 'data': obj.data})
    } else {
      res.status(400).json({'status': 'Error', 'data': obj.error.originalError.info.message})
    }
  }).catch((err)=> {
    res.status(400).json({'status': 'Error', 'data': err})
  })
});

app.post('/deleteRows', (req, res) => {

  let c_date = req.body.c_date
  let file_name = req.body.file_name
  let passport_name = req.body.passport_name

  let reqText = "exec dbo.sp_delete_values '" + c_date + "','" + file_name + "','" + passport_name + "'"

  queryData(reqText).then(rows => {
    var obj = rows
    if (obj.data) {
      res.status(200).json({'status': 'OK', 'data': obj.data})
    } else {
      res.status(400).json({'status': 'Error', 'data': obj.error.originalError.info.message})
    }
  }).catch((err)=> {
    res.status(400).json({'status': 'Error', 'data': err})
  })
});

app.get('/getval', (req, res) => {
  let karyer = req.query.karyer

  let reqText = "exec dbo.sp_get_values '" + karyer + "'"

  queryData(reqText).then(rows => {
    var obj = rows
    if (obj.data) {
      res.status(200).json({'status': 'OK', 'data': obj.data})
    } else {
      res.status(400).json({'status': 'Error', 'data': obj.error.originalError.info.message})
    }
  }).catch((err)=> {
    res.status(400).json({'status': 'Error', 'data': err})
  })
});



async function readExcelFile(file) {
  let log = []
  // Читаем файл Excel
  const workbook = XLSX.readFile(file);
// Получаем список названий листов в файле
  const sheetNames = workbook.SheetNames;


  let worksheet = workbook.Sheets['Титул'];
  let c_date = worksheet['H6']?.v
  let passport_name = worksheet['F19']?.v + worksheet['G19']?.v + ' ' + worksheet['H19']?.v + worksheet['J19']?.v + worksheet['K19']?.v
  let blok = worksheet['G19']?.v
  let tempVal =  worksheet['H19']?.v
  tempVal = tempVal[tempVal.length-1]
  let qatlam = tempVal + worksheet['J19']?.v

  worksheet = workbook.Sheets['корректир 1'];
  let rowCount = 0
  for (let j = 12; j < 100; j++) {
    if (worksheet['N'+j]?.v === 'В.В.:') {
      rowCount = j
      break;
    }
  }

  let kol_vo_boyevikov = 0
  for (let j = rowCount; j < (rowCount + 10); j++) {
    let ss = worksheet['R'+j]?.f
    if (ss) {
    let indx = ss.indexOf('*')
      if (indx >= 0 ) {
        kol_vo_boyevikov = ss.slice((indx+1), 10)
        break;
      }
    }
  }

  for (let i = 12; i < rowCount; i++) {
      let quduqlar_soni = worksheet['D'+i]?.v
      let quduqlar_guruhi = worksheet['B' + i]?.v + '-' + worksheet['C' + i]?.v
      let pogona_balandligi = worksheet['F' + i]?.v
      let quduq_diametri = worksheet['G' + i]?.v * 1000
      let ortiqcha_burgulash = worksheet['U' + i]?.v
      let oraliq_masofa_a = worksheet['I' + i]?.v
      let oraliq_masofa_b = worksheet['J' + i]?.v
      let solishtirma_sarf = worksheet['W' + i]?.v
      let quduqda_joylashgan_zaryad = worksheet['N' + i]?.v
      let nalichiye_vodi = worksheet['H' + i]?.v
      let obyom_vzrivchatki = worksheet['R'+rowCount]?.v
      let zaryad = worksheet['M' + i]?.v
      let zaboyka = worksheet['R' + i]?.v

      if (worksheet['H12']?.v !== nalichiye_vodi) {
        nalichiye_vodi = worksheet['H12']?.v
      }

      if (quduqlar_soni > 0) {
      log.push({
        'c_date': c_date,
        'passport_name':passport_name,
        'blok': blok,
        'qatlam': qatlam,
        'tartib_raqami': (i-11),
        'quduqlar_soni': quduqlar_soni,
        'quduqlar_guruhi': quduqlar_guruhi,
        'pogona_balandligi': pogona_balandligi,
        'quduq_diametri': quduq_diametri,
        'ortiqcha_burgulash': ortiqcha_burgulash,
        'oraliq_masofa_a': oraliq_masofa_a,
        'oraliq_masofa_b': oraliq_masofa_b,
        'solishtirma_sarf': solishtirma_sarf,
        'quduqda_joylashgan_zaryad': quduqda_joylashgan_zaryad,
        'kol_vo_boyevikov': kol_vo_boyevikov,
        'nalichiye_vodi': nalichiye_vodi,
        'obyom_vzrivchatki': obyom_vzrivchatki,
        'zaryad': zaryad,
        'zaboyka': zaboyka
      })
    }
  }

  return log
}

/* АВТОРИЗАЦИЯ */
app.post('/auth/login',auth_controller.login);


export default {
  path: '/api',
  handler: app
}
