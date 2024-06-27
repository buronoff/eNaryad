import { queryData } from "./db_connection.js"

const upravleniye = 'bg-buronov'
const token = 'br-buronovToken'


const login = (req, res) => {
  var user = req.body.user
  var pass = req.body.pass

  console.log(user)

  var reqText = "exec users.get_user '" + user + "'"
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


