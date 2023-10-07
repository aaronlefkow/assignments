import { peopleData } from "./peopleData.js";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
        daysOfWeek.forEach((day) => {
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
                    // Use differentAvailability if available, otherwise use availability
                    const personAvailability = peopleData[person].differentAvailability && peopleData[person].differentAvailability[day]
                        ? peopleData[person].differentAvailability[day]
                        : peopleData[person].availability[day];

                    return (
                        personAvailability &&
                        (peopleData[person].trainingStatus[serviceLine] === "Trained" ||
                            peopleData[person].trainingStatus[serviceLine] === "In Training") &&
                        !peopleData[person]?.pto?.[day] // Exclude if on PTO
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
                        option.style.backgroundColor = "lightblue"; // Set the background color
                        option.style.color = "black"; // Set the text color to black
                    } else if (peopleData[person].team === "Green") {
                        option.style.backgroundColor = "lightgreen"; // Set the background color
                        option.style.color = "black"; // Set the text color to black
                    } else {
                        option.style.backgroundColor = ""; // Reset to default
                        option.style.color = "black"; // Set the text color to black
                    }

                    select.appendChild(option);
                });

                // Add colors to options after a selection has already been made.
                select.addEventListener("change", () => {
                    const selectedOption = select.options[select.selectedIndex];
                    const selectedPersonName = selectedOption.value;

                    // Reset the background color to white for the blank/default option
                    select.style.backgroundColor = "white";

                    // Reset the background color for all options to their respective team colors
                    select.querySelectorAll("option").forEach((option) => {
                        const personName = option.value;
                        if (personName) {
                            const personTeam = peopleData[personName].team;
                            if (personTeam === "Blue") {
                                option.style.backgroundColor = "lightblue";
                            } else if (personTeam === "Green") {
                                option.style.backgroundColor = "lightgreen";
                            } else {
                                option.style.backgroundColor = "white"; // Reset to default
                            }
                        } else {
                            // Set the blank/default option to have a white background color
                            option.style.backgroundColor = "white";
                        }
                    });

                    // Additionally, set the background color of the select element itself
                    // based on the selected person's team
                    if (selectedPersonName) {
                        const selectedPersonTeam = peopleData[selectedPersonName].team;
                        if (selectedPersonTeam === "Blue") {
                            select.style.backgroundColor = "lightblue";
                        } else if (selectedPersonTeam === "Green") {
                            select.style.backgroundColor = "lightgreen";
                        } else {
                            select.style.backgroundColor = "white"; // Reset to default
                        }
                    }
                });
                cell.appendChild(select);
            }

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
});