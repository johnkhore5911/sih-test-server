// const LiveState = require('../Models/LiveStats.js');
const LiveState = require('../models/LiveStats')
const User = require('../models/User'); 

// import LiveState from "../Models/LiveStats.js";

// Function to handle the recent data request
exports.recentData = async (req, res, next) => {
  try {
    const collec = await LiveState.findOne({ Date_of_rec: "29" });
    const total = collec?.Employ_checkedin;
    const numEmployee = total?.length || 0;
    const response = {
      totalEmp: numEmployee,
    };
    return res.json(response);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Function to handle the employee check-in request
// exports.CheckedIn = async (req, res, next) => {
//   try {
//     // const { employee } = req.body;
//     // console.log('req:',req);
//     console.log('req.user:',req.user);
//     // console.log('req:',req.user.id);
// 		const employee = req.user.id;
//     console.log(employee)


//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });
//     if (Today) {
//       // Use $addToSet to add the employeeId only if it doesn't already exist
//       await Today.updateOne({
//         $addToSet: { Employ_checkedin: { employeeId: employee } },
//       });
//       console.log("Checked in employee or already exists");
//     } else {
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId: employee }],
//       });
//       console.log("Created new entry and checked in employee");
//     }

//     return res.json({ message: employee });
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };

// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const employee = req.user.id;

//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as HH:MM
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const formattedTime = `${hours}:${minutes}`;

//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });
//     if (Today) {
//       const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employee);
//       if (existingCheckin) {
//         console.log("Employee has already checked in today.");
//       } else {
//         // Add new check-in record with formatted time
//         await Today.updateOne({
//           $push: { Employ_checkedin: { employeeId: employee, checkedInAt: formattedTime } },
//         });
//         console.log("Checked in employee with current time.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId: employee, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: employee });
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };

exports.CheckedIn = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Find the EmployeeId using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const employeeId = user.EmployeeId;

    // Step 2: Get the current date and time
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    // Format time as HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    // Step 3: Update or create check-in record in LiveState
    const Today = await LiveState.findOne({ Date_of_rec: formattedDate });
    if (Today) {
      const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employeeId);
      if (existingCheckin) {
        console.log("Employee has already checked in today.");
      } else {
        // Add new check-in record with formatted time
        await Today.updateOne({
          $push: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } },
        });
        console.log("Checked in employee with current time.");
      }
    } else {
      // Create a new entry for the day if it doesn't exist
      await LiveState.create({
        Date_of_rec: formattedDate,
        Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
      });
      console.log("Created new entry and checked in employee.");
    }

    return res.json({ message: employeeId });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as HH:MM
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const formattedTime = `${hours}:${minutes}`;

//     // Step 3: Update or create check-in record in LiveState
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

//     if (Today) {
//       const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employeeId);
//       if (existingCheckin) {
//         // Update the existing check-in time
//         await LiveState.updateOne(
//           { 'Date_of_rec': formattedDate, 'Employ_checkedin.employeeId': employeeId },
//           { $set: { 'Employ_checkedin.$.checkedInAt': formattedTime } }
//         );
//         console.log("Updated check-in time for the employee.");
//       } else {
//         // Add new check-in record with formatted time
//         await Today.updateOne({
//           $push: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } },
//         });
//         console.log("Checked in employee with current time.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: employeeId });
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };

// // Function to handle the employee check-out request
// exports.CheckedOUT = async (req, res, next) => {
//   try {
//     // const { employee } = req.body;
// 		const employee = req.user.id;
    
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const formattedDate = `${day}${month}${year}`;
    
//     await LiveState.findOneAndUpdate(
//       { Date_of_rec: formattedDate },
//       {
//         $pull: { Employ_checkedin: { employeeId: employee } },
//       }
//     );
//     return res.json({ message: employee });
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };


exports.CheckedOUT = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Find the EmployeeId using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const employeeId = user.EmployeeId;

    // Step 2: Get the current date
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    // Step 3: Remove the employee's check-in record
    await LiveState.findOneAndUpdate(
      { Date_of_rec: formattedDate },
      {
        $pull: { Employ_checkedin: { employeeId: employeeId } },
      }
    );

    console.log("Checked out employee and removed their record.");
    return res.json({ message: `Employee ${employeeId} checked out.` });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};


exports.getRecentlyCheckedInEmployees = async (req, res) => {
  try {
    // Generate today's date in the format "DDMMYYYY"
    const today = new Date().toISOString().split('T')[0].split('-').reverse().join('');

    // Find the live stat document for today's date
    const liveStat = await LiveState.findOne({ Date_of_rec: today }).exec();

    if (!liveStat) {
      return res.status(404).json({ message: 'No check-in records found for today' });
    }

    // Get the last 6 employees from the Employ_checkedin array
    const checkedInEmployees = liveStat.Employ_checkedin;
    const recentEmployees = checkedInEmployees.slice(-6); // Get last 6 or fewer employees

    // Retrieve additional user details
    const employeeDetails = await Promise.all(recentEmployees.map(async (e) => {
      const user = await User.findOne({ EmployeeId: e.employeeId }).exec();
      return {
        officeid: user.OfficeId,
        office: user.office,
        EmpName: user.name,
        Time: e.checkedInAt
      };
    }));

    // Respond with the details in the specified format
    res.status(200).json({ transaction: employeeDetails });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
