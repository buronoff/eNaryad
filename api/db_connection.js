import sql from 'mssql'

const dbDataConfig = {
  user: 'sa',
  password: '@Zarafshan*',
  database: 'db_tb',
  //server: 'BG-BURONOV',
  server: 'DESKTOP-GHDOBMJ',
  options: {
      encrypt: false, // for azure
      trustServerCertificate: true, // change to true for local dev / self-signed certs
      requestTimeout: 1600000
  }
}

const queryData = async (sqlQuery) => {

  const cPool = new sql.ConnectionPool(dbDataConfig);
  cPool.on('error', err => console.log('---> SQL Error: ', err));

  try {
      await cPool.connect();
      let result = await cPool.request().query(sqlQuery);
      return { data: result.recordset };
  } catch (err) {
      return { error: err };

  } finally {
      cPool.close(); // <-- closing connection in the end it's a key
  }
};

module.exports = { queryData }
