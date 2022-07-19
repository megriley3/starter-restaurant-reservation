const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  let date = req.query.date;
  console.log(req.query)
  if(!date) date = new Date();
  console.log(date)
  const data = await reservationsService.list(date);
  res.json({data});
}

function bodyHasProperty(property){
  return function (req, res, next){
    const {data={}} = req.body;
    if(data[property]){
      return next()
    } 
    next({status: 400, message: `Must include a ${property}`})
  }
}

async function read(req, res, next){
  let date = req.query.date;
  if(!date) date = new Date();
  console.log(date)
  const data = await reservationsService.read(date);
  res.json({data})
}

async function create(req, res){
  const newReservation = req.body.data;
  const now = new Date().toISOString();
  newReservation.created_at=now;
  newReservation.updated_at = now;
  const data = await reservationsService.create(newReservation);

  res.status(201).json({data})
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  create: [
    bodyHasProperty("first_name"),
    bodyHasProperty("last_name"),
    bodyHasProperty("mobile_number"),
    bodyHasProperty("reservation_date"),
    bodyHasProperty("reservation_time"),
    asyncErrorBoundary(create)]
};
