const peopleData = {
    "John": {
        team: "Blue",
        availability: {
            Monday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Tuesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Wednesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Thursday: { startTime: "08:00 AM", endTime: "05:00 PM" },
        },
        differentAvailability: {
            Monday: { startTime: "8:00 AM", endTime: "4:00 PM" }
        },
        pto: {
            Wednesday: true, // John is on PTO on Wednesday
        },
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
        pto: {

        },
        trainingStatus: {
            Surgery: "Trained",
            HTMI: "In Training",
            Cardio: "Trained",
        },
        FTE: 1.0,
    },
};

export { peopleData };