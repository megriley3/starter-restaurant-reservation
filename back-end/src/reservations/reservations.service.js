const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .where('status','<>', 'finished')
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id: reservation_id }).first();
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0]);
}

function update(updatedReservation){
  return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((reservation) => reservation[0])
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  read,
  create,
  update,
  search
};
