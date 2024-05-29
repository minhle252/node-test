const query = require('../../config/db-connection');
const { multipleColumnSet, multipleColumnGet } = require('../utils/common.utils');
class PermissionModel{
  tableName = 'permission';
  tableNameGroupPermission = 'group_permission';
  tableNameUser = 'users';
  
  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;
    if (!Object.keys(params).length) {
      return await query(sql);
    }
    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };
  findSidebartPermission = async (userId) => {
    let sql = `SELECT * FROM ${this.tableName} where page = 1 and 
                id in (SELECT ${this.tableNameGroupPermission}.per_id FROM ${this.tableNameGroupPermission}
                left join ${this.tableNameUser} on ${this.tableNameGroupPermission}.user_id = ${this.tableNameUser}.id
                where ${this.tableNameGroupPermission}.user_id = ${userId})`;
    return await query(sql);
  }
  findGroupPermissionInUser = async (userId) => {
    let sql = `SELECT * FROM ${this.tableNameGroupPermission} where user_id = ${userId}`;
    return await query(sql);
  }

  create = async (data) => {
    const {columnSet, countKeys, values} = multipleColumnGet(data)
    const sql = `INSERT INTO ${this.tableNameGroupPermission} (${columnSet}) VALUES (${countKeys})`;
    const result = await query(sql, values);
    return result ? result.affectedRows : 0;
  };

  delete = async (user_id,per_id) => {
    const sql = `DELETE FROM ${this.tableNameGroupPermission} WHERE user_id = ${user_id} and per_id = ${per_id}`;
    const result = await query(sql);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };
  
  update = async (request, id) => {
    const { columnSet, values } = multipleColumnSet(request);
    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;
    const result = await query(sql, [...values, id]);
    return result;
  }
}

module.exports = new PermissionModel();
