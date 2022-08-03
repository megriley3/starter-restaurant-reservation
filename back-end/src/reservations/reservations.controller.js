const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  let date = req.query.date;
  if (!date) date = new Date();
  const data = await reservationsService.list(date);
  res.json({ data });
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
    //console.log(reservation_date)
    let resDate = reservation_date + "T00:00:00";
    resDate = new Date(reservation_date);
    //console.log(resDate, "resDate")
    res.locals.reservation_date = resDate;
    const today = new Date();
    const day = resDate.getDay();
    //console.log(resDate.getMonth(), today.getMonth(), resDate.getDate(), today.getDate())
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

// to validate the peopel
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
async function create(req, res) {
  const newReservation = req.body.data;
  const now = new Date().toISOString();
  newReservation.created_at = now;
  newReservation.updated_at = now;
  const data = await reservationsService.create(newReservation);

  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyHasProperty("first_name"),
    bodyHasProperty("last_name"),
    bodyHasProperty("mobile_number"),
    bodyHasProperty("reservation_date"),
    validDate(),
    validTime(),
    bodyHasProperty("reservation_time"),
    bodyHasProperty("people"),
    validPeople(),
    asyncErrorBoundary(create),
  ],
};
