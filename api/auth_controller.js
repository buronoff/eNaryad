import { queryData } from "./db_connection.js"
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import requestIp from "request-ip";

const secretKey = 'farida'

const login = (req, res) => {
  var user_name = req.body.user_name
  var password_normal = req.body.password_normal

  var reqText = "exec auth.get_user '" + user_name + "'"
  queryData(reqText).then(async rows => {
        var obj = await rows
         if (obj.data.length > 0) {
            let user_id = await obj.data[0].id
            let password_hash = await obj.data[0].password_hash
            let match = await bcrypt.compare(password_normal, password_hash);
            if (match === true) {

              let ip = req.clientIp
              let user = {
                          'user_id': user_id,
                          'user_name': user_name,
                          'ip': ip
                        }

              let token = jwt.sign(user, secretKey, { expiresIn: '1h' });

              res.status(200).json({token})
            } else {
              res.status(400).json('Не верный пароль')
            }


         } else {
            res.status(400).json('Пользователь:"' + user_name + '" не зарегистрирован!')
         }
  }).catch((err)=> {
     res.status(400).json({'error': err})
  })
 }

 const user = (req, res) => {
  let authHeader = req.headers['authorization'];
  let token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      res.status(401).json(err)
    }
    res.status(200).json(user)
  })

 }

const refresh = (token) => {
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log(err)
      return err
    }
    let token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    return token
  })

}



 const logout = (req, res) => {

  let authHeader = req.headers['authorization'];
  let token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      res.status(401).json('Пользователь не авторизован')
    }
    res.status(200).json('Сессия очищена')
  })

 }



const create_login = async (req, res) => {
  let user_name = req.body.user_name
  let password_normal = req.body.password_normal
  let details = req.body.details

  let salt = await bcrypt.genSalt(13);
  let password_hash = await bcrypt.hash(password_normal, salt);


  var reqText = "exec auth.set_user '" + user_name + "', '" + password_hash + "','" + password_normal + "', '" + details + "'"
  queryData(reqText).then(rows => {
    console.log(rows)
    var obj = rows
    if (obj.data) {
      res.status(200).json({'msg': obj.data})
    } else {
      res.status(400).json({'error': obj})
    }
  }).catch((err)=> {
    console.log(err)
    res.status(400).json({'error': err})
  })
}



module.exports = {
  login,
  logout,
  create_login,
  user
};


