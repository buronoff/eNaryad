<template>

  <Menubar :model="items">
    <template #start>
        <img alt="logo" src="@/static/img_logo.png" height="40" class="mr-2">
    </template>

    <template #end>
      <Userbar />
    </template>
  </Menubar>

</template>

<script>
import Menubar from 'primevue/menubar';
import Userbar from '@/components/userbar'

export default {
  components: {
    Menubar,
    Userbar
  },

  data() {
        return {
            items: [
                {
                   label:'Протоколы',
                   icon:'pi pi-fw pi-book',
                   to: '/protocol_page'
                },
                {
                   label:'Правила',
                   icon:'pi pi-fw pi-list',
                   to: '/rules_page'
                },
                {
                   label:'Статистика и анализ',
                   icon:'pi pi-fw pi-chart-bar',
                   to: '/statistic_page'
                },
                {
                   label:'Инструменты',
                   icon:'pi pi-fw pi-wrench'

                },
                {
                   label:'Справочник',
                   icon:'pi pi-fw pi-cog',
                   to: '/handbook_page'
                }
             ]
        }
    }

}
</script>
