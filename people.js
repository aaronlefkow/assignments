import { peopleData } from "./peopleData.js";

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("table-body");

    // Loop through each person
    for (const person in peopleData) {
        if (peopleData.hasOwnProperty(person)) {
            const rowData = peopleData[person];
            const row = document.createElement("tr");

            // Create and populate table cells for each column
            const nameCell = document.createElement("td");
            nameCell.textContent = person;
            row.appendChild(nameCell);

            const teamCell = document.createElement("td");
            teamCell.textContent = rowData.team;
            row.appendChild(teamCell);

            const fteCell = document.createElement("td");
            fteCell.textContent = rowData.FTE;
            row.appendChild(fteCell);

            // Availability for each day
            const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            daysOfWeek.forEach((day) => {
                const availabilityCell = document.createElement("td");

                // Check for PTO
                if (rowData.pto && rowData.pto[day]) {
                    availabilityCell.textContent = "PTO";
                } else {
                    // Check for differentAvailability or use default availability
                    const availabilityData = rowData.differentAvailability && rowData.differentAvailability[day]
                        ? rowData.differentAvailability[day]
                        : (rowData.availability && rowData.availability[day]) || null;

                    // Check if availabilityData is not null and has startTime and endTime
                    if (availabilityData && availabilityData.startTime && availabilityData.endTime) {
                        availabilityCell.textContent = `${availabilityData.startTime} - ${availabilityData.endTime}`;
                    } else {
                        availabilityCell.textContent = "N/A";
                    }
                }

                row.appendChild(availabilityCell);
            });
            // Training status for each service line
            const serviceLines = ["Surgery", "HTMI", "Cardio"];
            serviceLines.forEach((serviceLine) => {
                const trainingStatusCell = document.createElement("td");
                const trainingStatus = rowData.trainingStatus[serviceLine] || "N/A";
                trainingStatusCell.textContent = trainingStatus;
                row.appendChild(trainingStatusCell);
            });

            // Append the row to the table body
            tableBody.appendChild(row);
        }
    }
});
