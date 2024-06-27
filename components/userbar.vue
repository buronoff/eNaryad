<template lang="">
  <SplitButton icon="pi pi-user" label="user" :model="items" class="p-button-text p-button-secondary" />
</template>

<script>
import SplitButton from 'primevue/splitbutton';

export default {
  components: {
    SplitButton
  },

	data() {
		return {
			items: [
				{
					label: '192.168.48.83',
					icon: 'pi pi-info-circle',
				},
				{
					label: 'ЦРУ Рудник Мурунтау',
					icon: 'pi pi-users',
				},
				{
					label: 'Выход',
					icon: 'pi pi-power-off',
				}
			]
		}
	}
}
</script>

<style lang="">

</style>
