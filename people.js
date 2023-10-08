import { peopleData } from "./peopleData.js";

const serviceLines = [
    "Plastics / Plastic", 
    "General", "Neuro/Spine", 
    "Orthopedics", 
    "ENT/Dental/Anesthesia", 
    "Opthalmalogy", 
    "WC Patient", 
    "Endo WQ", 
    "GI", 
    "Gynecology", 
    "Urology", 
    "Podiatry", 
    "Procedural", 
    "Faxes / IB Pool", 
    "Emails/Voicemail"];
    
export { serviceLines }

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

    //TEAM FILTERS------------------------------------------------------------------------
    // Filter for Team column
    const teamFilterDropdown = document.getElementById("filterTeam");
    teamFilterDropdown.addEventListener("change", () => {
        const selectedTeam = teamFilterDropdown.value;

        // Loop through all rows in the table body
        const rows = tableBody.getElementsByTagName("tr");
        for (const row of rows) {
            // Check if the selectedTeam matches the content of the "Team" cell
            const teamCell = row.querySelector("td:nth-child(2)"); // Assuming "Team" is the second column (index 1)
            if (selectedTeam === "All" || teamCell.textContent === selectedTeam) {
                row.style.display = ""; // Show the row
            } else {
                row.style.display = "none"; // Hide the row
            }
        }
    });

    // Populate the "Team" filter dropdown with unique team values
    const uniqueTeams = Array.from(new Set(Object.values(peopleData).map(person => person.team)));

    // Add an "All" option
    const allTeamOption = document.createElement("option");
    allTeamOption.textContent = "All";
    teamFilterDropdown.appendChild(allTeamOption);

    // Add options for each unique team
    uniqueTeams.forEach((team) => {
        const option = document.createElement("option");
        option.textContent = team;
        teamFilterDropdown.appendChild(option);
    });
});
