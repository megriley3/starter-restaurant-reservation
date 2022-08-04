const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("../reservations/reservations.service")

async function list(req, res, next){
    const data = await tablesService.list();
    return res.json({data})
}

function bodyHasProperty(property) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[property]) {
        return next();
      }
      console.log(`missing ${property}`)
      next({ status: 400, message: `Must include a ${property}` });
    };
  }

  function validTableName(){
    return function(req, res, next) {
    const table = req.body.data;
    if(table.table_name.length<2){
        console.log("invalid table name", table.table_name)
         return next({
            status: 400,
             message: 'table_name must be at least 2 characters long.'
            });
    } 
        res.locals.table = table;
        next();
    
    }
}

function validCapacity(){
    return function(req, res, next){
        const {table} = res.locals;
        const isNumber = Number.isInteger(table.capacity)
        if(table.capacity<1 || (!isNumber)){
            console.log("invalid capacity", table.capacity)
            return next({status: 400, message: 'Table capacity must be a number with a value at least 1.'})
        } 
        next()
}
}


async function create(req, res, next){
    const {table} = res.locals;
    const data = await tablesService.create(table);
    res.status(201).json({data});
}

async function resExists(req, res, next){
    const {reservation_id} = req.body.data;
    const reservation = await reservationsService.read(reservation_id);
    if(!reservation){
        return next({status: 404, message: `reservation_id, ${reservation_id} does not exist`})
    }
    res.locals.reservation = reservation;
    res.locals.reservation_id = reservation_id;
    next();
}

async function enoughCapacity(req, res, next){
    const {people} = res.locals.reservation;
    const {table_id} = req.params;
    const table = await tablesService.read(table_id);
    if(table.capacity<people){
       return next({status: 400, message: 'Table capacity is less than the reservation people.'})
    } else {
        res.locals.table = table;
        next();
    }
}

async function tableIsFree(req, res, next){
    const {table} = res.locals;
    if(!table.reservation_id){
        res.locals.table = table;
        next()
    } else{
        next({status: 400, message: 'Table is occupied.'})
    }
}

async function update(req, res, next){
    const {reservation_id} = res.locals;
    let {table} = res.locals;
    table = {
        ...table,
        reservation_id: reservation_id,
    }
    const data = await tablesService.update(table);
    res.json({data});
}

async function tableIsOccupided(req, res, next){
    const {table_id} = req.params;
    const table = await tablesService.read(table_id);
    if(!table.reservation_id){
        next({status: 400, message: 'Table is free.'})
    } else {
        res.locals.table = table;
        next();
    }
}

async function deleteSeat(req, res, next){
    let {table} = res.locals;
    table = {...table, reservation_id: null};
    const data = await tablesService.deleteSeat(table);
    res.status(202);
}

module.exports = {
    list: asyncErrorBoundary(list),
    update: [bodyHasProperty("reservation_id"), asyncErrorBoundary(resExists), asyncErrorBoundary(enoughCapacity), asyncErrorBoundary(tableIsFree), asyncErrorBoundary(update)],
    create: [bodyHasProperty("table_name"), bodyHasProperty("capacity"), validTableName(), validCapacity(), asyncErrorBoundary(create)],
    delete: [asyncErrorBoundary(tableIsOccupided), asyncErrorBoundary(deleteSeat)]
}