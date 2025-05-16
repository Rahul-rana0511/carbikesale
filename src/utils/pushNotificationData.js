
const newBooking = (name, date, time) => {
    return {
      type: 1,
      title: `New Booking Alert`,
      desc: `${name} has booked a slot on ${date}`,
    };
  };
  const cancelBooking = (name, date, time) => {
    return {
      type: 2,
      title: `Cancel Booking Alert`,
      desc: `${name} has cancelled your booking`,
    };
  };
  const completeBooking = (name, date, time) => {
    return {
      type: 3,
      title: `Complete Booking Alert`,
      desc: `${name} has completed your booking`,
    };
  };
  const reScheduleBooking = (name, date, time) => {
    return {
      type: 4,
      title: `Re-Schedule Booking Alert`,
      desc: `${name} has re-schedule your booking`,
    };
  };
  const newMessage = (name) => {
    return {
      type: 5,
      title: `${name}`,
      desc: `${name} sent you a new message`,
    };
  };
export  {
  newBooking,
    completeBooking,
    cancelBooking,
    reScheduleBooking,
    newMessage
}
 
  