import { peopleData } from "./peopleData.js";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const serviceLines = [
    { name: "Plastics / Plastic", requiredFTE: 1 },
    { name: "General", requiredFTE: 4 },
    { name: "Neuro/Spine", requiredFTE: 2 },
    { name: "Orthopedics", requiredFTE: 3 },
    { name: "ENT/Dental/Anesthesia", requiredFTE: 2 },
    { name: "Opthalmalogy", requiredFTE: 1 },
    { name: "WC Patient", requiredFTE: 1 },
    { name: "Endo WQ", requiredFTE: 1 },
    { name: "GI", requiredFTE: 1 },
    { name: "Gynecology", requiredFTE: 2 },
    { name: "Urology", requiredFTE: 2 },
    { name: "Podiatry", requiredFTE: 1 },
    { name: "Procedural", requiredFTE: 1 },
];

const selectedNamesForDay = {};

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

                // Add data-day and data-service-line attributes
                select.setAttribute("data-day", day); // Set the day as the data-day attribute
                select.setAttribute("data-service-line", serviceLine); // Set the service line as the data-service-line attribute

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

    //BUTTON ASSIGNMENTS----------------------------------------------------
    // Add an event listener to the "Assign Randomly" button
    const assignButton = document.getElementById("assignButton");
    assignButton.addEventListener("click", () => {
        assignRandomly();
        updateSelectColors(); // Call the function to update colors
    });

    function assignRandomly() {
        console.log("Button clicked!");
        // Create an array to store assigned people for each day
        const assignedPeopleByDay = {};
    
        // Iterate through the days of the week and initialize the assignedPeopleByDay object
        daysOfWeek.forEach((day) => {
            assignedPeopleByDay[day] = [];
        });
    
        // Iterate through the service lines and assign people
        serviceLines.forEach((serviceLineObj) => {
            const { name: serviceLine } = serviceLineObj;
    
            daysOfWeek.forEach((day) => {
                const selects = document.querySelectorAll(`select[data-day="${day}"][data-service-line="${serviceLine}"]:not([disabled])`);
    
                selects.forEach((select) => {
                    // Filter available people for this day and service line
                    const availablePeople = Object.keys(peopleData).filter((person) => {
                        const personAvailability = peopleData[person].differentAvailability && peopleData[person].differentAvailability[day]
                            ? peopleData[person].differentAvailability[day]
                            : peopleData[person].availability[day];
    
                        return (
                            personAvailability &&
                            (peopleData[person].trainingStatus[serviceLine] === "Trained" ||
                                peopleData[person].trainingStatus[serviceLine] === "In Training") &&
                            !peopleData[person]?.pto?.[day] &&
                            !assignedPeopleByDay[day].includes(person) // Exclude if already assigned for this day
                        );
                    });
    
                    console.log(`Available people for ${day} - ${serviceLine}:`, availablePeople); // Check available people
    
                    if (availablePeople.length > 0) {
                        // Randomly select a person from the available list
                        const randomIndex = Math.floor(Math.random() * availablePeople.length);
                        const randomPerson = availablePeople[randomIndex];
    
                        // Assign the selected person to the select element
                        select.value = randomPerson;
                        assignedPeopleByDay[day].push(randomPerson);
                    }
                });
            });
        });
    }
    function updateSelectColors() {
        const selects = document.querySelectorAll('select');
    
        selects.forEach((select) => {
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
    }                 
});