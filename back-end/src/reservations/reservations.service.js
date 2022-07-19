const knex = require("../db/connection");

function list(date){
    return knex("reservations").select("*").where({reservation_date: date}).orderBy("reservation_time")
}

function read(date){
    return knex("reservations").select("*").where({reservation_date: date});
}

function create(reservation){
    return knex("reservations").insert(reservation)
}

module.exports = {
    list,
    read,
    create,
}