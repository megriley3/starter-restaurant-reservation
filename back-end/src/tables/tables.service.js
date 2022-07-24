const knex = require("../db/connection");

function list(){
    return knex("tables").select("*").sortBy("table_name")
}

function update(updatedTable){
    return knex("tables")
        .select("*")
        .where({table_id: updatedTable.table_id})
        .update(updatedTable, "*")
}

module.exports = {
    list,
    update,
}