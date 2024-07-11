<script>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
export default {
  components: {
    Card,
    InputText,
    Button
  },

  data() {
    return {
      login: {
        username: null,
        password: null
      },
    }
  }
}

</script>

<template>
  <div class="flex justify-content-center flex-row align-items-center" style="height: 90vh">
    <Card style="width: 20rem;">
      <template #title>
        Вход
      </template>
      <template #content>
        <div class="flex flex-column">
          <div class="mt-3">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-user" />
              <InputText id="username" type="text" v-model="username" class="w-full" placeholder="Пользователь"/>
            </span>
          </div>

          <div class="mt-5">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-key" />
              <InputText id="username" type="password" v-model="password" class="w-full" placeholder="Пароль"/>
            </span>
          </div>

          <div class="flex justify-content-end mt-4">
            <Button label="Войти" class="p-button-sm"  />
          </div>

        </div>


      </template>
    </Card>
  </div>

</template>

<style>

</style>
