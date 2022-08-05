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
      next({ status: 400, message: `Must include a ${property}` });
    };
  }

  function validTableName(){
    return function(req, res, next) {
    const table = req.body.data;
    if(table.table_name.length<2){
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

function resIsSeated(){
    return function(req, res, next){
        const {status} = res.locals.reservation;
        if(status==="seated"){
            return next({status: 400, message: `Reservation is already seated.`})
        }
        else{
            return next();
        }
    }
}

async function updateResStatus(req, res, next){
    let {reservation} = res.locals;
    reservation = {
        ...reservation,
        status: `seated`
    }
    const data = await reservationsService.update(reservation);
    next();
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

async function tableExists(req, res, next){
    const {table_id} = req.params;
    const table = await tablesService.read(table_id);
    if(!table){
        next({status:404, message: `table, ${table_id} does not exist`})
    } else {
        res.locals.table = table;
        next();
    }
}

function tableIsOccupied(req, res, next){
    const {table} = res.locals;
    if(!table.reservation_id){
        next({status: 400, message: 'Table is not occupied.'})
    } else {
        next();
    }
}

async function finishRes(req, res, next){
    const {reservation_id} = res.locals.table;
    let reservation = await reservationsService.read(reservation_id);
    reservation = {
        ...reservation,
        status: "finished"
    }
    await reservationsService.update(reservation);
    next();
}

async function deleteSeat(req, res, next){
    let {table} = res.locals;
    table = {...table, reservation_id: null};
    const data = await tablesService.deleteSeat(table);
    res.status(200).json({data});
}

module.exports = {
    list: asyncErrorBoundary(list),
    update: [
        bodyHasProperty("reservation_id"), 
        asyncErrorBoundary(resExists), 
        asyncErrorBoundary(enoughCapacity), 
        asyncErrorBoundary(tableIsFree), 
        resIsSeated(),
        asyncErrorBoundary(updateResStatus), 
        asyncErrorBoundary(update)],
    create: [
        bodyHasProperty("table_name"), 
        bodyHasProperty("capacity"), 
        validTableName(), 
        validCapacity(), 
        asyncErrorBoundary(create)],
    delete: [asyncErrorBoundary(tableExists), tableIsOccupied, asyncErrorBoundary(finishRes), asyncErrorBoundary(deleteSeat)]
}