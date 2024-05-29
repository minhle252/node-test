const query = require("../../config/db-connection");
const { multipleColumnSet,multipleColumnGet } = require("../utils/common.utils");
class UserModel {
  tableName = "users";

  find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;
    if (!Object.keys(params).length) {
      return await query(sql);
    }
    const { columnSet, values } = multipleColumnSet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };
  findOne = async (params) => {
    const { columnSet, values } = multipleColumnSet(params);
    const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;
    const result = await query(sql, [...values]);
    // return back the first row (user)
    return result[0];
  };
  findByListkey =  async (params) => {
    let sql = `SELECT distinct * FROM ${this.tableName}`;
    if(params.id){
      sql += ` WHERE id IN (${params.id})`;
    }
    const result = await query(sql);
    return result;
  };

  create = async (data) => {
    const {columnSet, countKeys, values} = multipleColumnGet(data)
    const sql = `INSERT INTO ${this.tableName} (${columnSet}) VALUES (${countKeys})`;
    const result = await query(sql, values);
    return result ? result.affectedRows : 0;;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM ${this.tableName}
    WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };
}

module.exports = new UserModel();
