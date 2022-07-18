const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const data = await reservationsService.list();
  res.json({data});
}
let nextId = 1;

async function create(req, res){
  const newReservation = req.body.data;
  const now = new Date().toISOString();
  newReservation.reservation_id = nextId++;
  newReservation.created_at=now;
  newReservation.updated_at = now;
  const data = await reservationsService.create(newReservation);

  res.status(201).json({data})
}

module.exports = {
  list,
  create: asyncErrorBoundary(create)
};
