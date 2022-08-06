const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const {mobile_number} = req.query;
  if(mobile_number){
    const data = await reservationsService.search(mobile_number);
    res.json({data})
  } else{
    let date = req.query.date;
    if (!date) date = new Date();
    const data = await reservationsService.list(date);
    res.json({ data });
  }
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

function validDate() {
  return function (req, res, next) {
    const { data: { reservation_date } = {} } = req.body;

    const dateFormat = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
    //console.log(reservation_date);
    let resDate = reservation_date + "T00:00:00";
    resDate = new Date(reservation_date);
    //console.log(resDate, "resDate");
    res.locals.reservation_date = resDate;
    const today = new Date();
    const day = resDate.getDay();
    /* console.log(
      resDate.getMonth(),
      today.getMonth(),
      resDate.getDate(),
      today.getDate()
    );*/
    if (!reservation_date.match(dateFormat)) {
      return next({
        status: 400,
        message: `reservation_date is not a valid date!`,
      });
    }
    if (
      resDate.getTime() < today.getTime() &&
      !(
        resDate.getMonth() === today.getMonth() &&
        resDate.getDate() === today.getDate()
      )
    ) {
      next({ status: 400, message: `Reservation date has already passed.` });
    }
    if (day === 1) {
      next({ status: 400, message: `Restaurant is closed on Tuesdays.` });
    }
    next();
  };
}

function validTime() {
  return function (req, res, next) {
    const { data: { reservation_time } = {} } = req.body;
    const timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!reservation_time.match(timeFormat)) {
      return next({
        status: 400,
        message: `reservation_time is invalid`,
      });
    }

    if (reservation_time < "10:30" || reservation_time > "21:30") {
      return next({
        status: 400,
        message: "The restaurant is only open from 10:30AM and 9:30PM.",
      });
    }
    next();
    //   const timeArray = reservation_time.split(":");
    //   const hours = Number(timeArray[0]);
    //   const minutes = Number(timeArray[1]);
    //   const now = new Date();
    //   const currHours = now.getHours();
    //   const currMinutes = now.getMinutes();
    //   if (hours < 10 || (hours === 10 && minutes < 30)) {
    //     next({ status: 400, message: `Restaurant opens at 10:30` });
    //   }
    //   if (hours < currHours || (hours === currHours && minutes < currMinutes)) {
    //     next({ status: 400, message: `Reservation time has already passed.` });
    //   }
    //   if (hours > 21 || (hours === 21 && minutes > 30)) {
    //     next({
    //       status: 400,
    //       message: `Reservations must be at least an hour before closing.`,
    //     });
    //   }
    //   next();
  };
}

// to validate the people
function validPeople() {
  return function (req, res, next) {
    const { data: { people } = {} } = req.body;
    const isNumber = Number.isInteger(people);
    if (!isNumber || people <= 0) {
      return next({
        status: 400,
        message: "You must make a reservation for 1 or more people",
      });
    }
    next();
  };
}

function validStatus(){
  return function(req, res, next){
    const {status} = req.body.data;
    if(status==="seated" || status==="finished"){
      return next({status: 400, message: `Reservation must not be seated or finished to reserve.`})
    }
    next();
  }
}

async function create(req, res) {
  const newReservation = req.body.data;
  const now = new Date().toISOString();
  newReservation.created_at = now;
  newReservation.updated_at = now;
  const data = await reservationsService.create(newReservation);
  res.status(201).json({ data });
}

async function read(req, res, next){
  const {reservation_id} = req.params;
  const data = await reservationsService.read(reservation_id);
  res.status(200).json({data})
}

async function resExists(req, res, next){
  const {reservation_id} = req.params;
  const reservation = await reservationsService.read(reservation_id);
  if(!reservation){
    return next({status: 404, message: `reservation, ${reservation_id} not found.`})
  } else{
    res.locals.reservation = reservation;
    next();
  }
}

function statusIsKnown(){
  return function(req, res, next){
    const {status} = req.body.data;
    if(status!=="seated" && status!=="finished" && status!="booked"){
      return next({status: 400, message: `status is unknown`})
    } else {
      res.locals.status = status;
      return next();
    }
  }
}

function statusIsFinished(){
  return function(req, res, next){
    const {reservation} = res.locals;
    if(reservation.status === "finished"){
      return next({status: 400, message: `reservation is finished`})
    } else {
      return next();
    }
    
  }
}

async function update(req, res){
  const {status} = res.locals;
  let {reservation} = res.locals;
  reservation = {
    ...reservation,
    status
  };
  const data = await reservationsService.update(reservation);
  res.status(200).json({data})
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyHasProperty("first_name"),
    bodyHasProperty("last_name"),
    bodyHasProperty("mobile_number"),
    bodyHasProperty("reservation_date"),
    bodyHasProperty("reservation_time"),
    validDate(),
    validTime(),
    bodyHasProperty("people"),
    validPeople(),
    validStatus(),
    asyncErrorBoundary(create),
  ],
  read,
  update: [asyncErrorBoundary(resExists), statusIsKnown(), statusIsFinished(), asyncErrorBoundary(update)]
};
