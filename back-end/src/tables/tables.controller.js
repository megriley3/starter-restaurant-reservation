const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next){
    const data = await tablesService.list();
    return res.json({data})
}

//add validation that gets the reservation_id and people and checks it against the table.capacity
//return 400 for an error

//add validation checking if the table is occupied, return 400
/*async function update(req, res, next){
    //figure out how to go from table_name and reservation_id to update
}*/

module.exports = {
    list: asyncErrorBoundary(list),
    //update: asyncErrorBoundary(update),
}