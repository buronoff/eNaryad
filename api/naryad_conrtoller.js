import { queryData } from "./db_connection.js"

const user_name = 'bg.buronov'
const user_ip = '192.168.195.77'


const get_api_dtsm_list = (req, res) => {
  let reqText = "exec dkp.v2_api_dtsm_list"
  queryData(reqText).then(rows => {
    let obj = rows
    if (obj.data.length > 0) {
      res.status(200).json(obj.data)
    } else {
      res.status(400).json(obj.error.originalError.info.message)
    }
  }).catch((err)=> {
    res.status(400).json(err)
  })
}

const get_uchastok = (req, res) => {
  let reqText = "exec dkp.v2_api_get_uchastok"
  queryData(reqText).then(rows => {
    let obj = rows
    if (obj.data.length > 0) {
      res.status(200).json(obj.data)
    } else {
      res.status(400).json(obj.error.originalError.info.message)
    }
  }).catch((err)=> {
    res.status(400).json(err)
  })
}

const get_api_narayd_ac = (req, res) => {
  let id_sm = req.query.id_sm
  let id_uchastok = req.query.id_uchastok

  let reqText = "exec dkp.v2_api_narayd_ac_by_idUch " + id_sm + "," + id_uchastok
  queryData(reqText).then(rows => {
    let obj = rows

    if (obj.data.length === 0) {
      res.status(400).json('Данные отсутствуют')
   }


      let obj_by_uchastok = obj.data
      let ekg_list = []
      obj_by_uchastok.forEach((by_ekg) => {
        if (ekg_list.findIndex(item=>item.ekg === by_ekg.ekg ) < 0) {
          ekg_list.push({'ekg' : by_ekg.ekg, 'sxod_vrn_unix': by_ekg.sxod_vrn_unix, 'sxod_vrn': by_ekg.sxod_vrn, 'sxod': by_ekg.sxod_ekg})
        }
      });

      let naryad_arr = []
      ekg_list.forEach((ekg_val)=>{
        let ekg = ekg_val.ekg
        let sxod = ekg_val.sxod
        let sxod_vrn = ekg_val.sxod_vrn
        let sxod_vrn_unix = Number(ekg_val.sxod_vrn_unix)



         let arr_temp = []
         arr_temp = obj_by_uchastok.filter((item) => item.ekg === ekg)

        let skl_list = []
        let ac_list = []

        arr_temp.forEach((el)=>{
          if ( skl_list.findIndex(item=>(item.skl === el.skl && item.vrn === el.skl_vrn && item.vrk === el.skl_vrk)) < 0){
            skl_list.push({'skl': el.skl, 'vrn': el.skl_vrn, 'vrk':el.skl_vrk})
          }

          if (ac_list.indexOf(el.ac) < 0) {
            ac_list.push(el.ac)
          }

        })

        naryad_arr.push({'ekg': ekg, 'sxod_vrn_unix': sxod_vrn_unix, 'sxod_vrn': sxod_vrn, 'sxod': sxod, 'skl_list': skl_list, 'ac_list': ac_list})
      })


      res.status(200).json(naryad_arr)

  }).catch((err)=> {
    res.status(400).json(err)
  })
}



module.exports = {
  get_api_dtsm_list,
  get_api_narayd_ac,
  get_uchastok
};


