const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer')
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const requestIp = require('request-ip');

const auth_controller = require('./auth_controller')


const app = express()
app.use(requestIp.mw());

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
      console.error(`Ошибка чтения папки ${dir}:`, err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Ошибка удаления файла ${filePath}:`, err);
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
    clearDir(uploadDir)
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

if (req.file.size) {
  res.status(200).json({ res: 'файл загружен, подождите идет обработка данных...'});
} else {
  res.status(400).json({ res: 'ошибка пи загрузке файла'});
}

});

app.post('/clear_dir', (req, res) => {
  const ip = req.clientIp
  let uploadDir = clearDir(ip)
  res.status(200).json({ res: 'папка для загрузки готова' });
});

app.get('/get_result',async (req, res) => {
  let ip = await req.clientIp
  let fileName = await ifFileExists(ip)
    if (fileName) {
      let readFile = await readExcelFile(fileName)
      res.status(200).json({ res: readFile});
    } else {
      res.status(400).json({ res: 'Ошибка чтения файла'});
    }

});
function ifFileExists(ip) {
  let directoryPath = ifExistsDir(ip)
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err); // В случае ошибки отклоняем промис
        return ;
      }
      // Проверяем, есть ли файлы в каталоге
      if (files.length === 0) {
        reject(new Error('Каталог пуст.')); // Отклоняем промис, если каталог пуст
        return;
      }
      // Получаем абсолютный путь к первому файлу
      const firstFile = files[0];
      const absoluteFilePath = path.resolve(directoryPath, firstFile);
      // Разрешаем промис с абсолютным путем к первому файлу
      resolve(absoluteFilePath);
    });
  });
}
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
  for (let i = 12; i < 53; i++) {

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
      let kol_boevik = worksheet['R55']?.v / worksheet['E57']?.v
      let nalichie_vodi = worksheet['H12']?.v
      let v_vzriv_massi = worksheet['X61']?.v
      let zaryad = zaryad_ves
      let boevik_vsego = kol_boevik * kol_skvazhin

      if (boevik_vsego > 0) {
    log.push({
      'name_passport':name_passport,
      'blok': blok,
      'gorizont': gorizont,
      'obvod': obvod,
      'ne_obvod': ne_obvod,
      'kol_skvazhin': kol_skvazhin,
      'numb_numb_skvazhina': numb_numb_skvazhina,
      'h_ustup': h_ustup,
      'diametr_skvazhina': diametr_skvazhina,
      'perebur': perebur,
      'setka_a': setka_a,
      'setka_b': setka_b,
      'udelniya_rasxod': udelniya_rasxod,
      'zaryad_ves': zaryad_ves,
      'zaryad_ves_all': zaryad_ves_all,
      'l_m': l_m,
      'kol_boevik': kol_boevik,
      'nalichie_vodi': nalichie_vodi,
      'v_vzriv_massi': v_vzriv_massi,
      'zaryad': zaryad,
      'boevik_vsego': boevik_vsego
    })
      }
  }

  return log

}




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* АВТОРИЗАЦИЯ */
app.post('/auth/login',auth_controller.login);




export default {
  path: '/api',
  handler: app
}
