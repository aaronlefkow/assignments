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
    { name: "Faxes / IB Pool", requiredFTE: 1 },
    { name: "Emails/Voicemail", requiredFTE: 1 },
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

            // Create an array to store the selects for this day and service line
            const selectsForDayAndServiceLine = [];

            // Create and append the dropdowns
            for (let i = 0; i < numDropdowns; i++) {
                const select = document.createElement("select");

                // Add data-day and data-service-line attributes.
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

                // Add the select to the array for this day and service line
                selectsForDayAndServiceLine.push(select);
            }

            // Create and append the extra selects (without specific attributes)
            for (let i = 0; i < 2; i++) {
                const select = document.createElement("select");

                select.classList.add("extra-select");

                // Clone the options from the first select of this day and service line
                selectsForDayAndServiceLine[0].querySelectorAll("option").forEach((option) => {
                    select.appendChild(option.cloneNode(true));
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
        resetAllSelectors();
        assignRandomly();
        updateSelectColors(); // Call the function to update colors
        removeSelectedOptions();
    });
    const consistentlyButton = document.getElementById("consistentlyButton"); // Add this line
    consistentlyButton.addEventListener("click", () => {
        resetAllSelectors();
        assignRandomly();
        onlyMonday();
        copySelectionFromMonday();
        updateSelectColors(); // Call the function to update colors
        removeSelectedOptions();
    });
    const colorButton = document.getElementById("colorButton");
    colorButton.addEventListener("click", () => {
        updateAllSelectColors(); // Call the function to update colors
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

                    // console.log(`Available people for ${day} - ${serviceLine}:`, availablePeople); // Check available people

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
            // Check if the select has the "extra-select" class
            if (!select.classList.contains('extra-select')) {
                const selectedOption = select.options[select.selectedIndex];
                const selectedPersonName = selectedOption ? selectedOption.value : '';

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
            }
        });
    }


    function onlyMonday() {
        // Loop through all select elements in the table
        const selects = document.querySelectorAll('select');
        selects.forEach((select) => {
            // Check the data-day attribute of the select element
            const day = select.getAttribute("data-day");

            // Check if the day is Tuesday, Wednesday, Thursday, or Friday
            if (day === "Tuesday" || day === "Wednesday" || day === "Thursday" || day === "Friday") {
                // Reset the select element to its default state
                select.selectedIndex = 0; // This sets it to the first (empty) option
            }
        });
    }


    function copySelectionFromMonday() {
        // Loop through each service line
        serviceLines.forEach((serviceLineObj) => {
            const { name: serviceLine } = serviceLineObj;

            // Loop through each day from Tuesday to Friday
            for (let i = 1; i <= 4; i++) {
                const day = daysOfWeek[i]; // Get the day (Tuesday to Friday)

                // Find the Monday select element for the current service line
                const mondaySelects = document.querySelectorAll(`select[data-service-line="${serviceLine}"][data-day="Monday"]`);

                // Find the current day's select elements for the same service line
                const currentDaySelects = document.querySelectorAll(`select[data-service-line="${serviceLine}"][data-day="${day}"]`);

                // Loop through all Monday select elements
                mondaySelects.forEach((mondaySelect, index) => {
                    // Get the selected option value for Monday
                    const selectedOptionValue = mondaySelect.value;

                    // Find the corresponding current day's select element
                    const currentDaySelect = currentDaySelects[index];

                    // Set the same option value for the current day
                    currentDaySelect.value = selectedOptionValue;
                });
            }
        });
    }

    const selects = document.querySelectorAll('select');
    selects.forEach((select) => {
        select.addEventListener("change", () => {
            removeSelectedOptions();
        });
    });

    const resetSelectorsButton = document.getElementById("resetSelectorsButton");
    resetSelectorsButton.addEventListener("click", () => {
        resetAllSelectors();
    });
    function resetAllSelectors() {
        const selects = document.querySelectorAll('select');
        selects.forEach((select) => {
            select.selectedIndex = 0; // Set to the first (empty) option
        });
        updateSelectColors();
        removeSelectedOptions();
    }
});


function generateAvailabilityByDay(data) {
    const availabilityByDay = {};

    for (const person in data) {
        const personData = data[person];

        for (const day in personData.availability) {
            // Check if the person is not on PTO for that day
            if (!personData.pto || !personData.pto[day]) {
                // Add the person to the availabilityByDay object for that day
                if (!availabilityByDay[day]) {
                    availabilityByDay[day] = [];
                }
                availabilityByDay[day].push(person);
            }
        }
    }
    return availabilityByDay;
}

const availabilityByDay = generateAvailabilityByDay(peopleData);
console.log(availabilityByDay);






// Assign the button for removeSelectedOptions
const removeSelectedButton = document.getElementById("removeSelectedButton");
removeSelectedButton.addEventListener("click", () => {
    removeSelectedOptions();
});

// Function to remove selected options from availabilityByDay
function removeSelectedOptions() {
    const availabilityByDay = generateAvailabilityByDay(peopleData);
    const selects = document.querySelectorAll('select');

    selects.forEach((select) => {
        const selectedOption = select.options[select.selectedIndex];
        const selectedPersonName = selectedOption ? selectedOption.value : ''; // Check if selectedOption exists

        // Check if a person is selected
        if (selectedPersonName) {
            const day = select.getAttribute("data-day");

            // Remove the selected person from availabilityByDay for the corresponding day
            if (availabilityByDay[day]) {
                const indexToRemove = availabilityByDay[day].indexOf(selectedPersonName);
                if (indexToRemove !== -1) {
                    availabilityByDay[day].splice(indexToRemove, 1);
                }
            }
        }
    });
    // Update the content of the "unassignedPeople" div with the availability data
    const unassignedPeopleMondayDiv = document.getElementById("unassignedPeopleMonday");
    unassignedPeopleMondayDiv.innerHTML = availabilityByDay["Monday"].map(item => JSON.stringify(item, null, 2)).join(", ");

    const unassignedPeopleTuesdayDiv = document.getElementById("unassignedPeopleTuesday");
    unassignedPeopleTuesdayDiv.innerHTML = availabilityByDay["Tuesday"].map(item => JSON.stringify(item, null, 2)).join(", ");

    const unassignedPeopleWednesdayDiv = document.getElementById("unassignedPeopleWednesday");
    unassignedPeopleWednesday.innerHTML = availabilityByDay["Wednesday"].map(item => JSON.stringify(item, null, 2)).join(",\n");

    const unassignedPeopleThursdayDiv = document.getElementById("unassignedPeopleThursday");
    unassignedPeopleThursdayDiv.innerHTML = availabilityByDay["Thursday"].map(item => JSON.stringify(item, null, 2)).join(",\n");

    const unassignedPeopleFridayDiv = document.getElementById("unassignedPeopleFriday");
    unassignedPeopleFridayDiv.innerHTML = availabilityByDay["Friday"].map(item => JSON.stringify(item, null, 2)).join(",\n");


    console.log("AvailabilityByDay after removing selected options:", availabilityByDay);
}

