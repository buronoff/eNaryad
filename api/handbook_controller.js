import { queryData } from "./db_connection.js"

const user_name = 'bg.buronov'
const user_ip = '192.168.195.77'


/* podrazdeleniya */
const podrazdeleniya_get = (req, res) => {
 var reqText = "exec handbook.podrazdeleniya_get"
 queryData(reqText).then(rows => {
        var obj = rows.data
        res.status(200).json({'status': 'OK', 'data': obj})
 }).catch((err)=> {
    res.status(400).json({'status': 'Error', 'data': err})
 })
}

const podrazdeleniya_set = (req, res) => {
  var id = req.body.id
  var nm = req.body.nm


  if (nm === '' || nm === null)  {
    res.status(418).json({'status': 'Error', 'data': 'Введите наименование подразделения!'})
    return null
  }

  var reqText = "exec handbook.podrazdeleniya_set " + id + ",'" + nm + "','" + upravleniye + "','" + user_name + "','" + user_ip + "'"
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
 }

const podrazdeleniya_del = (req, res) => {
  var id = req.body.id
  var nm = req.body.nm

  var reqText = "exec handbook.podrazdeleniya_del " + id + ",'" + nm + "','" + upravleniye + "','" + user_name + "','" + user_ip + "'"
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
 }

/* uchastki */
 const uchastok_get = (req, res) => {
  var reqText = "exec handbook.uchastok_get"
  queryData(reqText).then(rows => {
         var obj = rows.data
         res.status(200).json({'status': 'OK', 'data': obj})
  }).catch((err)=> {
     res.status(400).json({'status': 'Error', 'data': err})
  })
 }

 const uchastok_set = (req, res) => {
  var id = req.body.id
  var nm = req.body.nm

  if (nm === '' || nm === null)  {
    res.status(418).json({'status': 'Error', 'data': 'Введите наименование учаска, отдела или цеха!'})
    return null
  }

  var reqText = "exec handbook.uchastok_set " + id + ",'" + nm + "','" + user_name + "','" + user_ip + "'"
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
 }

const uchastok_del = (req, res) => {
  var id = req.body.id
  var nm = req.body.nm

  var reqText = "exec handbook.uchastok_del " + id + ",'" + nm + "','" + user_name + "','" + user_ip + "'"
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
 }

 /* dolzhnosti */
 const dolzhnost_get = (req, res) => {
  var reqText = "exec handbook.dolzhnost_get"
  queryData(reqText).then(rows => {
         var obj = rows.data
         res.status(200).json({'status': 'OK', 'data': obj})
  }).catch((err)=> {
     res.status(400).json({'status': 'Error', 'data': err})
  })
 }

 const dolzhnost_set = (req, res) => {
  var id = req.body.id
  var nm = req.body.nm

  if (nm === '' || nm === null)  {
    res.status(418).json({'status': 'Error', 'data': 'Введите наименование должности!'})
    return null
  }

  var reqText = "exec handbook.dolzhnost_set " + id + ",'" + nm + "','" + user_name + "','" + user_ip + "'"
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
 }

const dolzhnost_del = (req, res) => {
  var id = req.body.id
  var nm = req.body.nm

  var reqText = "exec handbook.dolzhnost_del " + id + ",'" + nm + "','" + user_name + "','" + user_ip + "'"
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
 }



module.exports = {

  podrazdeleniya_get,
  podrazdeleniya_set,
  podrazdeleniya_del,

  uchastok_get,
  uchastok_set,
  uchastok_del,

  dolzhnost_get,
  dolzhnost_set,
  dolzhnost_del

};


