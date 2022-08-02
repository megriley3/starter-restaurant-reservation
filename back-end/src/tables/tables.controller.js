const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("../reservations/reservations.service")

async function list(req, res, next){
    const data = await tablesService.list();
    return res.json({data})
}

async function enoughCapacity(req, res, next){
    const {reservation_id} = req.body.data;
    let people = await reservationsService.read(reservation_id);
    people = people[0];
    people=people.people;
    const {table_id} = req.params;
    let table = await tablesService.read(table_id);
    table=table[0];
    if(table.capacity<people){
        next({status: 400, message: 'Table capacity is less than the reservation people.'})
    } else {
        res.locals.table = table;
        res.locals.reservation_id = reservation_id;
        next();
    }
}

async function tableIsFree(req, res, next){
    const {table_id} = req.params;
    let table = await tablesService.read(table_id);
    table=table[0];
    if(!table.reservation_id){
        res.locals.table = table;
        next()
    } else{
        next({status: 400, message: 'Table is occupied.'})
    }
}

async function tableIsOccupided(req, res, next){
    const {table_id} = req.params;
    let table = await tablesService.read(table_id);
    table = table[0];
    if(!table.reservation_id){
        next({status: 400, message: 'Table is free.'})
    } else {
        res.locals.table = table;
        next();
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

function validTableName(req, res, next){
    const table = req.body.data;
    if(table.table_name.length>=2){
        res.locals.table = table;
        next();
    } else{
         next({status: 400, message: 'Table name must be at least 2 characters long.'});
        }
}

function validCapacity(req, res, next){
    const {table} = res.locals;
    if(Number(table.capacity)>=1){
        next();
    } else{
        next({status: 400, message: 'Table capacity must be at least 1.'})
    }
}

async function create(req, res, next){
    const {table} = res.locals;
    const data = await tablesService.create(table);
    res.status(201).json({data});
}


async function deleteSeat(req, res, next){
    let {table} = res.locals;
    table = {...table, reservation_id: null};
    const data = await tablesService.deleteSeat(table);
    res.status(202);
}

module.exports = {
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(enoughCapacity), asyncErrorBoundary(tableIsFree), asyncErrorBoundary(update)],
    create: [validTableName, validCapacity, asyncErrorBoundary(create)],
    delete: [asyncErrorBoundary(tableIsOccupided), asyncErrorBoundary(deleteSeat)]
}