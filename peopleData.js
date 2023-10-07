const differentAvailabilityData = {
    "John": {
        Monday: { startTime: "8:00 AM", endTime: "4:00 PM" }
    }
};

const ptoData = {
    "John": {
        Wednesday: true // John is on PTO on Wednesday
    },
};


const peopleData = {
    "John": {
        team: "Blue",
        availability: {
            Monday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Tuesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Wednesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Thursday: { startTime: "08:00 AM", endTime: "05:00 PM" },
        },
        differentAvailability: differentAvailabilityData["John"],
        pto: ptoData["John"],
        trainingStatus: {
            Surgery: "Trained",
            HTMI: "In Training",
            Cardio: "Not Trained",
        },
        FTE: 0.8,
    },
    "Aaron": {
        team: "Green",
        availability: {
            Monday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Tuesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Wednesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Thursday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Friday: { startTime: "08:00 AM", endTime: "05:00 PM" },
        },
        differentAvailability: differentAvailabilityData["Aaron"],
        pto: ptoData["Aaron"],
        trainingStatus: {
            Surgery: "Trained",
            HTMI: "In Training",
            Cardio: "Trained",
        },
        FTE: 1.0,
    },
};

export { peopleData };