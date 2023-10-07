const peopleData = {
    "John": {
        team: "Blue",
        availability: {
            Monday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Tuesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            // Add availability for other days
        },
        trainingStatus: {
            Surgery: "Trained",
            HTMI: "In Training",
            Cardio: "Not Trained",
        },
        FTE: 0.8, // Example FTE value (between 0 and 1)
    },
    "Aaron": {
        team: "Green",
        availability: {
            Monday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            Tuesday: { startTime: "08:00 AM", endTime: "05:00 PM" },
            // Add availability for other days
        },
        trainingStatus: {
            Surgery: "Trained",
            HTMI: "In Training",
            Cardio: "Trained",
        },
        FTE: 1.0, // Example FTE value (between 0 and 1)
    },
    // Add data for other people
};


const serviceLines = [
    { name: "Surgery", requiredFTE: 0.8 },
    { name: "HTMI", requiredFTE: 2 },
    { name: "Cardio", requiredFTE: 3.5 },
    // Add other service lines with required FTE values
];

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("table-body");

    // Loop through each service line
    serviceLines.forEach((serviceLineObj) => {
        const { name: serviceLine, requiredFTE } = serviceLineObj;
        const row = document.createElement("tr");
        const serviceLineCell = document.createElement("td");
        serviceLineCell.textContent = serviceLine;
        row.appendChild(serviceLineCell);

        // Loop through each day of the week
        for (const day of Object.keys(peopleData["John"].availability)) {
            const cell = document.createElement("td");

            // Calculate the number of dropdowns required based on FTE
            const numDropdowns = Math.ceil(requiredFTE);

            // Create and append the dropdowns
            for (let i = 0; i < numDropdowns; i++) {
                const select = document.createElement("select");

                // Add an empty default option
                const defaultOption = document.createElement("option");
                defaultOption.textContent = "";
                select.appendChild(defaultOption);

                // Filter people based on availability and training status
                const availablePeople = Object.keys(peopleData).filter((person) => {
                    return (
                        peopleData[person].availability[day] &&
                        peopleData[person].availability[day].startTime <= "08:00 AM" &&
                        peopleData[person].availability[day].endTime >= "05:00 PM" &&
                        (peopleData[person].trainingStatus[serviceLine] === "Trained" ||
                            peopleData[person].trainingStatus[serviceLine] === "In Training")
                    );
                });

                // Add options for available people
                availablePeople.forEach((person) => {
                    const option = document.createElement("option");
                    option.textContent = person;
                    option.value = person; // Set the value of the option
                    option.dataset.team = peopleData[person].team; // Store team data as a custom attribute

                    // Change the text color of the option based on the team
                    if (peopleData[person].team === "Blue") {
                        option.style.color = "blue";
                    } else if (peopleData[person].team === "Green") {
                        option.style.color = "green";
                    } else {
                        option.style.color = ""; // Reset to default
                    }

                    select.appendChild(option);
                });

                // Add an event listener to change the background color based on the selected person's team
                select.addEventListener("change", (event) => {
                    const selectedOption = event.target.options[event.target.selectedIndex];
                    const selectedTeam = selectedOption.dataset.team;

                    // Change the background color based on the team
                    if (selectedTeam === "Blue") {
                        select.style.backgroundColor = "lightblue";
                    } else if (selectedTeam === "Green") {
                        select.style.backgroundColor = "lightgreen";
                    } else {
                        select.style.backgroundColor = ""; // Reset to default
                    }
                });

                cell.appendChild(select);
            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    });
});

