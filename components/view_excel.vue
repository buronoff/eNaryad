<script>
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import Panel from 'primevue/panel';
import Listbox from 'primevue/listbox';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import BlockUI from 'primevue/blockui';

export default  {

components: {
  FileUpload,
  Toast,
  Panel,
  Listbox,
  Button,
  ScrollPanel,
  Accordion,
  AccordionTab,
  Dropdown,
  DataTable,
  Column,
  BlockUI
},

  data(){
  return {
    selectedFile: null,
    uploadUrl: '/api/upload', // URL для загрузки файлов
    fileList: [], // Список файлов для загрузки
    send_status: null, // 0-отправка  1-ок 2-ошибка 3-отказано
    send_fileList: [],
    karyer_list: ['Рудник Мурунтау', 'Карьер Бесапантау', 'Карьер Балпантау'],
    karyer_name: null,
    resultTableList: [],
    blockedPanel: false,
    isLoading: false

  }
  },

  methods: {
    handleFileChange(event) {
      this.fileList.push(event.target.files);
    },

    remove_file_to_list(index) {
      this.fileList.splice(index, 1); // Удаление элемента по индексу
    },


    async upload_files() {

      if (this.karyer_name) {

        this.$axios.post('/api/cleardir')
          .then(async (response) => {
            this.blockedPanel = true
            let files = this.fileList
            for await (let file of files) {
              await this.sendFile(file[0])
            }
            this.fileList = []
            this.blockedPanel = false
            this.$toast.add({severity:'success', summary: 'Сообщение', detail:'Данные готовы для записи в БД, для записи раскройте таблицу с данными...', life: 5000});
          })
          .catch(error => {
            return error
          });
      } else {
        this.$toast.add({severity:'error', summary: 'Ошибка', detail:'Выберите карьер', life: 3000});
      }

    },

    async sendFile(file) {
      this.send_status = 0
      this.send_fileList.push({'file': file.name, 'status':this.send_status, send_text: [], result_table: []})
      let last_item = await this.send_fileList[this.send_fileList.length - 1]
      try {
        let response_data = await this.upload(file)
        last_item.result_table = response_data.res
        this.resultTableList.push({listName:file.name, val: response_data.res})
        this.send_status = 1
        last_item.status = this.send_status
      }
      catch(err){
        let response_data = await this.upload(file)
        last_item.result_table = response_data.res
        this.resultTableList.push({listName:file.name, val: response_data.res})
        this.send_status = 3
        last_item.status = this.send_status
      }


    },

    async upload(file) {

          let formData = new FormData();
          formData.append('file', file);
          return this.$axios.post(this.uploadUrl, formData)
            .then(response => {
              return response.data
            })
            .catch(error => {
              return error
            });

    },

    async addTo_db(listName){
      this.isLoading = true
      let arr = this.resultTableList.filter((item) => item.listName === listName)

      for await (let el of arr[0].val) {

        let data = ({
          'passport_imya': el.passport_imya,
          'blok': el.blok,
          'gorizont': el.gorizont,
          'obvod': el.obvod,
          'ne_obvod': el.ne_obvod,
          'kol_skvazhin': el.kol_skvazhin,
          'numb_numb_skvazhina': el.numb_numb_skvazhina,
          'ustup': el.ustup,
          'diametr': el.diametr,
          'perebur': el.perebur,
          'setka_a': el.setka_a,
          'setka_b': el.setka_b,
          'udelniy': el.udelniy,
          'zaryad_ves': el.zaryad_ves,
          'zaryad_ves_vsego': el.zaryad_ves_vsego,
          'l_m': el.l_m,
          'kol_vo_boyevikov': el.kol_vo_boevikov,
          'zaryad': el.zaryad,
          'boyevik_vsego': el.boyevik_vsego,
          'obyom_vzriv_veshestva': el.v_vzriv_massi,
          'karyer': this.karyer_name
        })

          this.$axios.post('/api/addval', data)
            .then(response => {
              // console.log(response.data)
            })
            .catch(error => {
              this.$toast.add({severity:'error', summary: 'Ошибка', detail:error, life: 3000});
            });
        }
      this.isLoading = false
      this.$toast.add({severity:'success', summary: 'Сообщение', detail:'Данные записаны в БД...', life: 3000});
    },




  }

}
</script>

<template>
<div>
  <Toast />

  <div class="grid">
    <div class="col-4">

      <BlockUI :blocked="blockedPanel">


      <Panel header="Log">
        <template #header>
          <div class="flex justify-content-between align-items-center w-full h-2rem">
            <span>Импорт файлов</span>
            <div>
              <Dropdown v-model="karyer_name" :options="karyer_list"  placeholder="Выберите карьер" />
            </div>
            <div>
              <label class="input-file">
                <input type="file" name="file" accept=".xls,.xlsx" @change="handleFileChange">
                <span>Выберите файл</span>
              </label>
            </div>
          </div>

        </template>
        <div class="flex flex-column justify-content-between h-full">
          <div class="div_li_list mb-1">
              <ul v-if="fileList.length > 0">
                <li v-for="(file, index) in fileList" :key="index" class="li_list">
                  <div class="flex justify-content-between align-items-center m-2">
                    <div>{{ file[0].name }}</div>
                    <div>
                      <i class="pi pi-times" @click="remove_file_to_list(index)"></i>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="flex justify-content-end">
              <Button label="Выгрузить данные" icon="pi pi-check" class="p-button-sm" @click="upload_files" v-if="fileList.length > 0" />
            </div>
        </div>

      </Panel>

      </BlockUI>

    </div>
    <div class="col-8">
      <Panel header="Обработанные файлы">
      <div class="div_send_list h-full">
      <Accordion>
        <AccordionTab v-for="(file, index) in this.send_fileList" :key="index" >
          <template #header>
            <div class="flex justify-content-between align-items-center flex-10">
              <span>{{file.file}}</span>
              <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div>
                <i class="pi pi-spin pi-spinner" style="font-size: 1rem" v-if="file.status === 0" ></i>
                <i class="pi pi-check-circle" style="font-size: 1rem; color: green" v-if="file.status === 1" ></i>
                <i class="pi pi-info-circle" style="font-size: 1rem; color: orangered" v-if="file.status === 2" ></i>
                <i class="pi pi-times-circle" style="font-size: 1rem; color: red" v-if="file.status === 3" ></i>
              </div>
            </div>
          </template>

          <ScrollPanel style="width: 100%; height: 40vh">
          <DataTable :value="file.result_table" showGridlines class="p-datatable-sm" :rowHover="true" :autoLayout="true">
            <Column field="passport_imya" header="Паспорт"></Column>
            <Column field="blok" header="Блок"></Column>
            <Column field="gorizont" header="Гор."></Column>
            <Column field="obvod" header="Обвод"></Column>
            <Column field="ne_obvod" header="Не Обвод"></Column>
            <Column field="kol_skvazhin" header="Кол-во скв."></Column>
            <Column field="numb_numb_skvazhina" header="№№ скв."></Column>
            <Column field="ustup" header="Уступ"></Column>
            <Column field="diametr" header="Диаметр"></Column>
            <Column field="perebur" header="Перебур"></Column>
            <Column field="setka_a" header="Сетка А"></Column>
            <Column field="setka_b" header="Сетка Б"></Column>
            <Column field="udelniy" header="Удельный расход"></Column>
            <Column field="zaryad_ves" header="Вес заряда"></Column>
            <Column field="zaryad_ves_vsego" header="Заряд всего"></Column>
            <Column field="l_m" header="L(m)"></Column>
            <Column field="kol_vo_boevikov" header="Кол-во боевиков"></Column>
            <Column field="v_vzriv_massi" header="V ВМ"></Column>
            <Column field="zaryad" header="Заряд"></Column>
            <Column field="boyevik_vsego" header="Кол-во Боевиков всего"></Column>
          </DataTable>
          </ScrollPanel>

          <Button label="Запись в БД" icon="pi pi-save" class="p-button-success p-button-sm mt-3 float-end" @click="addTo_db(file.file)" :loading="isLoading" />

        </AccordionTab>
      </Accordion>
      </div>
      </Panel>
    </div>
  </div>



</div>
</template>

<style>
.p-accordion-header-link {
  justify-content: space-between
}

.pi-times:hover {
  border: 1px solid silver;
}

.li_list {
  list-style: none;
  border-bottom: 1px solid silver;
}

.li_list:hover {
  color: red
}

.div_li_list {
  overflow-y: auto;
  border: 1px solid silver;
  padding-right: 10px

}

.div_send_list {
  overflow-y: auto;
}

.p-panel-header {
  height: 4em
}

.p-panel-content {
  height: 90vh;

}

.p-fileupload .p-fileupload-content {
  padding: 0;
}
.p-fileupload-row {
  align-content: flex-start;
  border-bottom: 1px solid #F8F9F9 ;
  padding: 0;
}

.p-fileupload-row > div {
  flex: auto;
}

.p-fileupload-row > div:first-child {
  width: 0;
}
.p-fileupload-row > div:last-child {
  width: 10%;
}

.input-file {
  position: relative;
  display: inline-block;
}
.input-file span {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  font-size: 14px;
  vertical-align: middle;
  color: rgb(255 255 255);
  text-align: center;
  border-radius: 0px;
  background-color: #419152;
  line-height: 22px;
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
  border: none;
  margin: 0;
  transition: background-color 0.2s;
  width: 150px;
}
.input-file input[type=file] {
  position: absolute;
  z-index: -1;
  opacity: 0;
  display: block;
  width: 0;
  height: 0;
}

/* Focus */
.input-file input[type=file]:focus + span {
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

/* Hover/active */
.input-file:hover span {
  background-color: #59be6e;
}
.input-file:active span {
  background-color: #2E703A;
}

/* Disabled */
.input-file input[type=file]:disabled + span {
  background-color: #eee;
}

.p-column-title {
  text-align: center;
}

.isNullStyle {
  background-color: red;
}

</style>
