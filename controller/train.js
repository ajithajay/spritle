
const asyncHandler = require('../middleware/async');
const Train = require('../models/Train');

exports.getTrains = asyncHandler(async (req, res, next) => {
     const train = await Train.find();
     let isAdmin = false;
     if(req.user.role == 'admin'){
        isAdmin= true;
     }
     res.render("train",{ train, isAdmin });
   
  });

  exports.getTrain = asyncHandler(async (req, res, next) => {
    const train = await Train.findById(req.params.id);
    if (!train) {
        return res.redirect("/train");
    }
  
    res.render("booking",{ train: train });
  }); 

exports.createTrain = asyncHandler(async (req, res, next) => {
    const { name, row } = req.body;
    if(!name || !row){
        return res.redirect("/train");
    }
    const column = 6;
    let seatNo = 0;
    let data =  {
        name, row, column, seat : []
    };
    for (let i = 1; i <= row; i++) {
        for (let j = 1; j <= column; j++) {
            seatNo++;
            let obj = {
                no: seatNo,
                booked: false
            }
            data.seat.push(obj);
        }
    }
    await Train.create(data);
    res.redirect("/train");
  });

  exports.newBooking = asyncHandler(async (req, res, next) => {
    const { age, gender } = req.body;
    const train = await Train.findById(req.params.id);
    if(!age || !gender){
   
        return res.render("booking",{ train: train, msg:  `Please specify Age and Gender` });
        
    }
    let seatNo;

    if (age > 60) {
        seatNo = assignWindowSeat(train,age, gender) || assignMiddleSeat(train,age, gender) || assignAisleSeat(train,age, gender);
    } else {
        seatNo = assignMiddleSeat(train,age, gender) || assignAisleSeat(train,age, gender) || assignWindowSeat(train,age, gender);

    }
    if(seatNo){
        await train.save();
        res.render("booking",{ train: train, msg:  `Seat No : ${seatNo} booked` });
    }else{
        res.render("booking",{ train: train, msg:  `No Seat Available` });
    }

  }); 

  function assignWindowSeat(train, age,gender) {
    const { column , seat} = train;
    for (s of seat) {
        const mod = s.no % column || column;
         if ((mod == 1 || mod == 6) && !s.booked) {
            s.booked = true;
            s.age = age;
            s.gender = gender
            return s.no;
        }
    }
 }
  function assignMiddleSeat(train, age,gender) {
    const { column , seat} = train;
    for (s of seat) {
        const mod = s.no % column || column;
         if ((mod == 2 || mod == 5) && !s.booked) {
            s.booked = true;
            s.age = age;
            s.gender = gender
            return s.no;
        }
    }
 }
  function assignAisleSeat(train, age,gender) {
    const { column , seat} = train;
    for (s of seat) {
        const mod = s.no % column || column;
         if ((mod == 3 || mod == 4) && !s.booked) {
            s.booked = true;
            s.age = age;
            s.gender = gender
            return s.no;
        }
    }
 }