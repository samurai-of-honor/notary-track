export const ADODB = require('node-adodb');

const filesource = './src/Access.accdb';
export const connection = ADODB
  .open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${filesource};Persist Security Info=False;`);

export const DBController = {
  async getData(query) {
    try {
      const users = await connection.query(query);

      return await users;

      // console.log(JSON.stringify(users, null, 2));
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  },
  async writeData(query) {
    try {
      const users = await connection.execute(query);

      console.log(JSON.stringify(users, null, 2));
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }
};
