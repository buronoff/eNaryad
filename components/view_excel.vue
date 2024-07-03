<script>
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import Panel from 'primevue/panel';
import Listbox from 'primevue/listbox';
import {forEach} from "core-js/stable/dom-collections";

export default  {

components: {
  FileUpload,
  Toast,
  Panel,
  Listbox
},

  data(){
  return {
    selectedFile: null,
    uploadUrl: '/api/upload', // URL для загрузки файлов
    fileList: [], // Список файлов для загрузки
    files_to_list: []

  }
  },

  methods: {
    handleFileChange(event) {
      this.fileList.push(event.target.files);
      this.files_to_list = []
      for (let file of this.fileList) {
        this.files_to_list.push(file[0])
      }
     },


    async customUploadHandler(file) {
      let files = file.files
      for await (file of files) {
        await this.sendFile(file)
      }
    },
    onFileUpload(event) {
      // Обработка успешной загрузки файла
      console.log('Файл(ы) успешно загружены:', event.files);
    },

    async sendFile(file) {
      let formData = new FormData(); // Инициализация, если необходимо

      // Пользовательская логика загрузки
      formData.append('file', file); // Добавление файла в formData

      // Выполнение фактической загрузки с использованием axios или fetch
      return this.$axios.post(this.uploadUrl, formData)
        .then(response => {
          // Обработка успешного ответа от сервера
          console.log('Файл успешно загружен:', response.data);
          return response.data; // Возвращение данных, если необходимо
        })
        .catch(error => {
          // Обработка ошибки загрузки
          console.error('Ошибка при загрузке файла:', error);
          throw error; // Проброс ошибки для дальнейшей обработки
        });
    },

    selectFile(event){
      this.fileList.push(event.files)
      console.log(this.fileList)
    }


  }

}
</script>

<template>
<div>
  <Toast />

  <div class="grid">
    <div class="col-7">
      <!--
      <FileUpload mode="basic"
                  accept=".xls,.xlsx"
                  name="file"
                  :auto="false"
                  @uploader="customUploadHandler"
                  :customUpload="true"
                  chooseLabel="Добавить"
                  uploadLabel="Загрузить"
                  cancelLabel="Очистить"

                  />

                  <FileUpload mode="basic"
                        accept=".xls,.xlsx"
                        name="file"
                        :auto="false"
                        @uploader="customUploadHandler"
                        :customUpload="true"
                        @select="selectFile"
                        chooseLabel="Добавить"
                        uploadLabel="Загрузить"
                        cancelLabel="Очистить"

            />
      -->
      <Panel header="Log">
        <template #header>
          <div class="flex justify-content-between align-items-center w-full h-2rem">
            <span style="font-weight: bold">Импорт файлов</span>
          </div>
          <div>
           <label class="input-file">
              <input type="file" name="file" accept=".xls,.xlsx" @change="handleFileChange">
              <span>Выберите файл</span>
            </label>

            <!--<button @click="uploadFile">Загрузить</button>-->
          </div>
        </template>
        <Listbox v-model="selectedFile" :options="files_to_list" :optionLabel="files_to_list.file" />

      </Panel>

    </div>
    <div class="col-5">
      <Panel header="Log">
        <template #header>
          <div class="flex justify-content-between align-items-center w-full h-2rem">
            <span style="font-weight: bold">Лог</span>
          </div>
        </template>
      </Panel>
    </div>
  </div>



</div>
</template>

<style>
.p-panel-content {
  height: 90vh;

}

.p-fileupload-content {
  height: 90vh;
  overflow-y: auto
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
  border-radius: 4px;
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
