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



// Настройка хранилища для Multer
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





async function readExcelFile(file) {
  let log = []
  // Читаем файл Excel
  const workbook = XLSX.readFile(file);
// Получаем список названий листов в файле
  const sheetNames = workbook.SheetNames;

  let tempVal
  let worksheet = workbook.Sheets['Титул'];
  let name_passport = worksheet['F19']?.v + worksheet['G19']?.v + ' ' + worksheet['H19']?.v + worksheet['J19']?.v + worksheet['K19']?.v
  let blok = worksheet['G19']?.v
  tempVal =  worksheet['H19']?.v
  tempVal = tempVal[tempVal.length-1]
  let gorizont = tempVal + worksheet['J19']?.v

  worksheet = workbook.Sheets['Техрасчёт'];
  let obvod = worksheet['E14']?.v
  let ne_obvod = worksheet['E14']?.v
  if (obvod === 'Блок обводнён' || obvod === 'Блок  обводнён' ) {
    obvod = 'да'
    ne_obvod = 'нет'
  } else {
    obvod = 'нет'
    ne_obvod = 'да'
  }

  let obvodnen = obvod
  let ne_obvodnen= ne_obvod

  worksheet = workbook.Sheets['корректир 1'];

  let rowCount = 0
  let boyevik_all = 0
  for (let j = 12; j < 100; j++) {
    if (worksheet['N'+j]?.v === 'В.В.:') {
      rowCount = j
      break;
    }
  }

  let kol_boevik = 0
  for (let j = rowCount; j < (rowCount + 10); j++) {
    let ss = worksheet['R'+j]?.f
    if (ss) {
    let indx = ss.indexOf('*')
      if (indx >= 0 ) {
        kol_boevik = ss.slice((indx+1), 10)
        break;
      }
    }
  }


  let kol_skvazhin_all = 0
  for (let j = 12; j < 100; j++) {
    if (worksheet['A'+j]?.v === 'Подлежит взрыванию') {
      kol_skvazhin_all = worksheet['E'+j]?.v
      break;
    }
  }

  for (let i = 12; i < rowCount; i++) {
      let kol_skvazhin = worksheet['D'+i]?.v
      let numb_numb_skvazhina = worksheet['B' + i]?.v + '-' + worksheet['C' + i]?.v
      let h_ustup = worksheet['F' + i]?.v
      let diametr_skvazhina = worksheet['G' + i]?.v * 1000
      let perebur = worksheet['U' + i]?.v
      let setka_a = worksheet['I' + i]?.v
      let setka_b = worksheet['J' + i]?.v
      let udelniya_rasxod = worksheet['W' + i]?.v
      let zaryad_ves = worksheet['N' + i]?.v
      let zaryad_ves_all = zaryad_ves * kol_skvazhin
      let l_m = (h_ustup + perebur) * kol_skvazhin
      let nalichie_vodi = worksheet['H12']?.v
      let v_vzriv_massi = worksheet['R'+rowCount]?.v
      let zaryad = zaryad_ves
      let boevik_vsego = kol_boevik * kol_skvazhin

      if (kol_skvazhin > 0) {
      log.push({
        'passport_imya':name_passport,
        'blok': blok,
        'gorizont': gorizont,
        'obvod': obvod,
        'ne_obvod': ne_obvod,
        'kol_skvazhin': kol_skvazhin,
        'numb_numb_skvazhina': numb_numb_skvazhina,
        'ustup': h_ustup,
        'diametr': diametr_skvazhina,
        'perebur': perebur,
        'setka_a': setka_a,
        'setka_b': setka_b,
        'udelniy': udelniya_rasxod,
        'zaryad_ves': zaryad_ves,
        'zaryad_ves_vsego': zaryad_ves_all,
        'l_m': l_m,
        'kol_vo_boevikov': kol_boevik,
        'nalichie_vodi': nalichie_vodi,
        'v_vzriv_massi': v_vzriv_massi,
        'zaryad': zaryad,
        'boyevik_vsego': boevik_vsego
      })
    }
  }

  return log
}


app.post('/addval', (req, res) => {

  let  passport_imya=req.body.passport_imya
  let  blok = req.body.blok
  let  gorizont = req.body.gorizont
  let  obvod = req.body.obvod
  let  ne_obvod = req.body.ne_obvod
  let  kol_skvazhin = req.body.kol_skvazhin
  let  numb_numb_skvazhina = req.body.numb_numb_skvazhina
  let  ustup = req.body.ustup
  let  diametr = req.body.diametr
  let  perebur = req.body.perebur
  let  setka_a = req.body.setka_a
  let  setka_b = req.body.setka_b
  let  udelniy = req.body.udelniy
  let  zaryad_ves = req.body.zaryad_ves
  let  zaryad_ves_vsego = req.body.zaryad_ves_vsego
  let  l_m = req.body.l_m
  let  kol_vo_boyevikov = req.body.kol_vo_boyevikov
  let  zaryad = req.body.zaryad
  let  boyevik_vsego = req.body.boyevik_vsego
  let  obyom_vzriv_veshestva = req.body.obyom_vzriv_veshestva
  let  ip = req.clientIp
  let  karyer = req.body.karyer


  let reqText = "exec dbo.add_values  '" + passport_imya + "','" + blok + "', '" + gorizont + "','" + obvod + "','" + ne_obvod + "'," + kol_skvazhin + "," +
                        "'" + numb_numb_skvazhina + "'," + ustup + "," + diametr + "," + perebur + "," + setka_a + "," + setka_b + "," + udelniy + "," + zaryad_ves + "," +
                        zaryad_ves_vsego + "," + l_m + "," + kol_vo_boyevikov + "," + zaryad + "," + boyevik_vsego + "," + obyom_vzriv_veshestva + ",'" + ip + "', '" + karyer + "'"

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




/* АВТОРИЗАЦИЯ */
app.post('/auth/login',auth_controller.login);




export default {
  path: '/api',
  handler: app
}
