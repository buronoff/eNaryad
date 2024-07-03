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
import {forEach} from "core-js/stable/dom-collections";

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
  Dropdown
},

  data(){
  return {
    selectedFile: null,
    uploadUrl: '/api/upload', // URL для загрузки файлов
    fileList: [], // Список файлов для загрузки
    send_status: null, // 0-отправка  1-ок 2-ошибка 3-отказано
    send_fileList: [],
    karyer_list: ['Рудник Мурунтау', 'Карьер Бесапантау', 'Карьер Балпантау'],
    karyer_name: null

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
      await this.clearDir()
      let files = this.fileList
      for await (let file of files) {
        await this.sendFile(file[0])
      }
      this.fileList = []
    },

    async sendFile(file) {
      this.send_status = 0

      this.send_fileList.push({'file': file.name, 'status':this.send_status, 'val': null})

      let formData = new FormData();
      formData.append('file', file);
      return this.$axios.post(this.uploadUrl, formData)
        .then(response => {
          this.send_status = 1

          let last_item = this.send_fileList[this.send_fileList.length - 1]
          last_item.status = this.send_status

          console.log('Файл успешно загружен:', response.data);
          return response.data; // Возвращение данных, если необходимо
        })
        .catch(error => {
          this.send_status = 3

          let last_item = this.send_fileList[this.send_fileList.length - 1]
          last_item.status = this.send_status
          console.error('Ошибка при загрузке файла:', error);
          throw error; // Проброс ошибки для дальнейшей обработки
        });
    },

    async clearDir(){
      return this.$axios.post('/api/clear_dir')
        .then(response => {
          return response.data; // Возвращение данных, если необходимо
        })
        .catch(error => {
          console.error('Ошибка при загрузке файла:', error);
          throw error; // Проброс ошибки для дальнейшей обработки
        });
    }

  }

}
</script>

<template>
<div>
  <Toast />

  <div class="grid">
    <div class="col-6">

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
              <Button label="Загрузить" icon="pi pi-check" class="p-button-sm" @click="upload_files" />
            </div>
        </div>

      </Panel>

    </div>
    <div class="col-6">
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
                <i class="pi-info-circle" style="font-size: 1rem; color: orangered" v-if="file.status === 2" ></i>
                <i class="pi-times-circle" style="font-size: 1rem; color: red" v-if="file.status === 3" ></i>
              </div>
            </div>
          </template>
          {{file.val}}
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

</style>
