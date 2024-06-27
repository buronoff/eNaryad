import { queryData } from "./db_connection.js"

const user_name = 'bg.buronov'
const user_ip = '192.168.195.77'


/* pravila */
const rules_list_get = (req, res) => {
 var podrazdeleniye_name = req.query.podrazdeleniye_name
 var reqText = "exec rules.rules_list_get '" + podrazdeleniye_name + "'"
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

const rules_list_set = (req, res) => {
  var id = req.body.id
  var nm = req.body.nm
  var count_month = req.body.count_month
  var podrazdeleniye_name = req.body.podrazdeleniye_name

  var reqText = "exec rules.rules_list_set " + id + ",'" + nm + "','" + podrazdeleniye_name + "', " + count_month + ",'" + user_name + "','" + user_ip + "'"

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

 const rules_list_del = (req, res) => {
  var id = req.body.id

  var reqText = "exec rules.rules_list_del " + id + ",'" + user_name + "','" + user_ip + "'"

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

/* pravila dlya dolzhnostey */
 const rules_list_by_group_get = (req, res) => {
   var podrazdeleniye_name = req.query.podrazdeleniye_name
   var uchastok_name = req.query.uchastok_name
   var dolzhnost_name = req.query.dolzhnost_name

   var reqText = "exec rules.rules_list_by_group_get '" + podrazdeleniye_name + "', '" + uchastok_name + "','" + dolzhnost_name + "'"
   queryData(reqText).then(rows => {
      var obj = rows
      if (obj.data) {
         var response_data = obj.data
         var rules_list = new Array()  
         var rules_list_by_group = new Array()

         response_data.forEach(el => {
            if (el.by_group === 0) {
               rules_list.push({'id': el.id, 'nm': el.nm}) 
            } else {
               rules_list_by_group.push({'id': el.id, 'nm': el.nm})
            }
         });   

         var result_data = new Array()
         result_data.push({'rules_list': rules_list, 'rules_list_by_group': rules_list_by_group})
         
         res.status(200).json({'status': 'OK', 'data': result_data})
      } else {
         res.status(400).json({'status': 'Error', 'data': obj.error.originalError.info.message})
      }
   }).catch((err)=> {
      res.status(400).json({'status': 'Error', 'data': err})
   })
  }

  const rules_list_by_group_set = async (req, res) => {
   var podrazdeleniye_name = req.body.podrazdeleniye_name
   var uchastok_name = req.body.uchastok_name
   var dolzhnost_name = req.body.dolzhnost_name
   var rules_name = req.body.rules_name
  
   var reqText = "exec rules.rules_list_by_group_set '" + podrazdeleniye_name + "', '" + uchastok_name + "','" + dolzhnost_name + "','" + rules_name + "','" + user_name + "','" + user_ip + "'"
   console.log(reqText)
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

 const dolznost_list_by_uchastok_id_get = (req, res) => {
   var podrazdeleniye_name = req.query.podrazdeleniye_name
   var uchastok_name = req.query.uchastok_name

   var reqText = "exec rules.dolznost_list_by_uchastok_id_get'" + podrazdeleniye_name + "', '" + uchastok_name + "'"
   queryData(reqText).then(rows => {
      var obj = rows
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

  rules_list_get,
  rules_list_set,
  rules_list_del,

  rules_list_by_group_get,
  rules_list_by_group_set,
  dolznost_list_by_uchastok_id_get



};


