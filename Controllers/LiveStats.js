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


// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const now = new Date();
    
//     // Convert to IST
//     const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
//     const istDate = new Date(now.getTime() + offset);

//     const day = String(istDate.getDate()).padStart(2, '0');
//     const month = String(istDate.getMonth() + 1).padStart(2, '0');
//     const year = istDate.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as HH:MM:SS in IST
//     const hours = String(istDate.getHours()).padStart(2, '0');
//     const minutes = String(istDate.getMinutes()).padStart(2, '0');
//     const seconds = String(istDate.getSeconds()).padStart(2, '0');
//     const formattedTime = `${hours}:${minutes}:${seconds}`;

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
// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const now = new Date();
    
//     // Convert to IST
//     // const offset = 10.5 * 60 * 60 * 1000; // IST is UTC+5:30
//     const istDate = new Date(now.getTime() );

//     const day = String(istDate.getDate()).padStart(2, '0');
//     const month = String(istDate.getMonth() + 1).padStart(2, '0');
//     const year = istDate.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as HH:MM:SS in IST
//     const hours = String(istDate.getHours()).padStart(2, '0');
//     const minutes = String(istDate.getMinutes()).padStart(2, '0');
//     const seconds = String(istDate.getSeconds()).padStart(2, '0');
//     const formattedTime = `${hours}:${minutes}:${seconds}`;

//     console.log(`Current Time (IST): ${formattedTime}`);
//     console.log(`Formatted Date: ${formattedDate}`);

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
exports.CheckedIn = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Find the EmployeeId using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const employeeId = user.EmployeeId;

    // Step 2: Get the current date and time in IST
    const now = new Date();
    
    // Convert to IST
    // Since JavaScript Date objects handle timezones based on the system's timezone,
    // we can use the system's time as long as the system is set to IST.
    // Otherwise, we would manually adjust to IST if needed.

    // Format date as DDMMYYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    // Format time as HH:MM:SS
    const timeString = now.toTimeString().split(' ')[0]; // Extract the time portion
    const formattedTime = timeString;

    console.log(`Current Time: ${formattedTime}`);
    console.log(`Formatted Date: ${formattedDate}`);

    // Step 3: Update or create check-in record in LiveState
    const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

    if (Today) {
      const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employeeId);
      if (existingCheckin) {
        // Update the existing check-in time
        await LiveState.updateOne(
          { 'Date_of_rec': formattedDate, 'Employ_checkedin.employeeId': employeeId },
          { $set: { 'Employ_checkedin.$.checkedInAt': formattedTime } }
        );
        console.log("Updated check-in time for the employee.");
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
        officeid: user.department,
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
