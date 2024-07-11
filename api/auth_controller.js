import { queryData } from "./db_connection.js"
import jwt  from 'jsonwebtoken'

const login = (req, res) => {
  var user = req.body.user
  var pass = req.body.pass

  var reqText = "exec auth.get_user '" + user + "'"
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
  login,
};


