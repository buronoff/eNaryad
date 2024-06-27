const proxyAddr = require('proxy-addr');

export default function ({ req, store }) {
  // Определяем, какие IP-адреса считать доверенными
  const trusted = ['loopback', 'linklocal', 'uniquelocal'];

  // Извлекаем IP-адрес клиента из запроса с учетом прокси
  const ip = proxyAddr(req, trusted);

  // Сохраняем IP-адрес в Vuex store
  store.commit('user/setIP', ip);
}
