const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  let date = req.query.date;
  if(!date) date = new Date();
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

function validDate(){
  return function (req, res, next){
    const {data: {reservation_date} = {}} = req.body;
    const resDate = new Date(reservation_date);
    const today = new Date();
    const day = resDate.getDay()
    console.log(resDate)
    console.log(day)
    if(resDate.getTime()<today.getTime()){
      next({status: 400, message: `Reservation date has already passed.`})
    } 
    if(day === 1){
      next({status: 400, message:  `Restaurant is closed on Tuesdays.`})
    }
    next()
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
    validDate(),
    bodyHasProperty("reservation_time"),
    asyncErrorBoundary(create)]
};
