const knex = require("../db/connection");

function list(date){
    return knex("reservations").select("*").where({reservation_date: date}).orderBy("reservation_time")
}

function create(reservation){
    return knex("reservations").insert(reservation)
}

function read(reservation_id){
    return knex("reservations").select("people").where({reservation_id})
}

module.exports = {
    list,
    create,
    read
}