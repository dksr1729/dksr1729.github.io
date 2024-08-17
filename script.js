let peopleData = {
    'Karthik': [],
    'Parasaran': [],
    'Sowmya': [],
    'Sujitha': [],
    'Deekshitha': [],
    'Uday': [],
    'Gopi': [],
    'Yokesh': [],
    'Geethika': [],
    'Vennela': [],
    'Akshay': []
};

let paymentsHistory = [];

// Load peopleData and paymentsHistory from cookies if available
window.onload = () => {
    fetchFromCookies();
    displayPaymentsMade(); // Ensure payments history is displayed on page load
};

document.getElementById('addPersonBtn').addEventListener('click', () => {
    document.getElementById('addPersonPopup').style.display = 'flex';
});

document.getElementById('closePersonPopupBtn').addEventListener('click', () => {
    document.getElementById('addPersonPopup').style.display = 'none';
});

document.getElementById('savePersonBtn').addEventListener('click', () => {
    const newPerson = document.getElementById('newPerson').value.trim();
    if (newPerson && !peopleData.hasOwnProperty(newPerson)) {
        peopleData[newPerson] = [];
        updatePayerDropdown();
        displayPeople();
        document.getElementById('addPersonPopup').style.display = 'none';
    }
});

document.getElementById('addPaymentBtn').addEventListener('click', () => {
    document.getElementById('addPaymentPopup').style.display = 'flex';
    generatePeopleCheckboxes();
});

document.getElementById('closePaymentPopupBtn').addEventListener('click', () => {
    document.getElementById('addPaymentPopup').style.display = 'none';
});

document.getElementById('savePaymentBtn').addEventListener('click', () => {
    const payer = document.getElementById('payer').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const note = document.getElementById('note').value.trim();
    const selectedPeople = Array.from(document.querySelectorAll('#peopleCheckboxes input:checked'))
                                .map(checkbox => checkbox.value);

    if (payer && !isNaN(amount) && selectedPeople.length > 0) {
        const splitAmount = amount / selectedPeople.length;

        // Update payer's amount
        peopleData[payer].push(amount);
        // Update other people's amounts
        selectedPeople.forEach(person => {
            peopleData[person].push(-splitAmount);
        });

        paymentsHistory.push({ payer, amount, note, involved: selectedPeople });

        displayPaymentsMade();
        document.getElementById('addPaymentPopup').style.display = 'none';
    }
});

document.getElementById('saveToCookiesBtn').addEventListener('click', () => {
    saveCookie('peopleData', JSON.stringify(peopleData), 30);
    saveCookie('paymentsHistory', JSON.stringify(paymentsHistory), 30);
    alert('Data saved to cookies successfully!');
});
document.getElementById('fetchFromCookiesBtn').addEventListener('click', () => {
    fetchFromCookies();
    alert('Data fetched from cookies successfully!');
});

document.getElementById('closePaymentPopupBtn').addEventListener('click', () => {
    document.getElementById('addPaymentPopup').style.display = 'none';
});
document.getElementById('showCookiesBtn').addEventListener('click', () => {
    const storedPeopleData = getCookie('peopleData');
    const storedPaymentsHistory = getCookie('paymentsHistory');
    
    let displayText = 'No cookies stored.';
    if (storedPeopleData || storedPaymentsHistory) {
        displayText = `People Data: ${storedPeopleData ? storedPeopleData : 'Not Found'}\n\nPayments History: ${storedPaymentsHistory ? storedPaymentsHistory : 'Not Found'}`;
    }

    document.getElementById('cookiesData').textContent = displayText;
    document.getElementById('showCookiesPopup').style.display = 'flex';
});

document.getElementById('closeShowCookiesPopupBtn').addEventListener('click', () => {
    document.getElementById('showCookiesPopup').style.display = 'none';
});

document.getElementById('calculatePaymentsBtn').addEventListener('click', () => {
    const paymentsToDo = calculatePayments(peopleData);
    displayPayments(paymentsToDo);
});

document.getElementById('saveToCookiesBtn').addEventListener('click', () => {
    saveCookie('peopleData', JSON.stringify(peopleData), 30);
    saveCookie('paymentsHistory', JSON.stringify(paymentsHistory), 30);
    alert('Data saved to cookies successfully!');
});

document.getElementById('fetchFromCookiesBtn').addEventListener('click', () => {
    fetchFromCookies();
    alert('Data fetched from cookies successfully!');
});

document.getElementById('clearCookiesBtn').addEventListener('click', () => {
    clearCookie('peopleData');
    clearCookie('paymentsHistory');
    peopleData = {};
    paymentsHistory = [];
    document.getElementById('result').innerHTML = 'Cookies cleared!';
    updatePayerDropdown();
    displayPeople();
    displayPaymentsMade();
});

document.getElementById('removePersonBtn').addEventListener('click', () => {
    document.getElementById('removePersonPopup').style.display = 'flex';
    populateRemovePersonDropdown();
});

document.getElementById('closeRemovePersonPopupBtn').addEventListener('click', () => {
    document.getElementById('removePersonPopup').style.display = 'none';
});

document.getElementById('confirmRemovePersonBtn').addEventListener('click', () => {
    const personToRemove = document.getElementById('removePerson').value;
    if (personToRemove) {
        delete peopleData[personToRemove];
        paymentsHistory.forEach(payment => {
            payment.involved = payment.involved.filter(person => person !== personToRemove);
        });
        updatePayerDropdown();
        displayPeople();
        displayPaymentsMade();
        document.getElementById('removePersonPopup').style.display = 'none';
    }
});

document.getElementById('removePaymentBtn').addEventListener('click', () => {
    document.getElementById('removePaymentPopup').style.display = 'flex';
    populateRemovePaymentDropdown();
});

document.getElementById('closeRemovePaymentPopupBtn').addEventListener('click', () => {
    document.getElementById('removePaymentPopup').style.display = 'none';
});

document.getElementById('confirmRemovePaymentBtn').addEventListener('click', () => {
    const paymentToRemove = document.getElementById('removePayment').value;
    if (paymentToRemove) {
        paymentsHistory = paymentsHistory.filter(payment => payment.id !== paymentToRemove);
        displayPaymentsMade();
        document.getElementById('removePaymentPopup').style.display = 'none';
    }
});

function populateRemovePersonDropdown() {
    const removePersonDropdown = document.getElementById('removePerson');
    removePersonDropdown.innerHTML = '';
    for (const person in peopleData) {
        const option = document.createElement('option');
        option.value = person;
        option.text = person;
        removePersonDropdown.appendChild(option);
    }
}

function populateRemovePaymentDropdown() {
    const removePaymentDropdown = document.getElementById('removePayment');
    removePaymentDropdown.innerHTML = '';
    paymentsHistory.forEach((payment, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = `${payment.payer} paid ₹${payment.amount} for ${payment.note}`;
        removePaymentDropdown.appendChild(option);
    });
}


function updatePayerDropdown() {
    const payerDropdown = document.getElementById('payer');
    payerDropdown.innerHTML = '';
    for (const person in peopleData) {
        const option = document.createElement('option');
        option.value = person;
        option.text = person;
        payerDropdown.appendChild(option);
    }
}
function fetchFromCookies() {
    const storedPeopleData = getCookie('peopleData');
    const storedPaymentsHistory = getCookie('paymentsHistory');

    if (storedPeopleData) {
        peopleData = JSON.parse(storedPeopleData);
    }
    if (storedPaymentsHistory) {
        paymentsHistory = JSON.parse(storedPaymentsHistory);
    }

    updatePayerDropdown();
    displayPeople();
    displayPaymentsMade();
}
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function saveCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function generatePeopleCheckboxes() {
    const checkboxesContainer = document.getElementById('peopleCheckboxes');
    checkboxesContainer.innerHTML = '';
    for (const person in peopleData) {
        const label = document.createElement('label');
        label.innerHTML = `<hr><input type="checkbox" value="${person}"> ${person}`;
        checkboxesContainer.appendChild(label);
    }
}

function displayPeople() {
    const peopleDisplay = document.getElementById('peopleDisplay');
    peopleDisplay.innerHTML = '';
    for (const person in peopleData) {
        const li = document.createElement('li');
        li.textContent = person;
        peopleDisplay.appendChild(li);
    }
}

function displayPaymentsMade() {
    const paymentsDisplay = document.getElementById('paymentsDisplay');
    paymentsDisplay.innerHTML = '';
    paymentsHistory.forEach(payment => {
        const li = document.createElement('li');
        li.textContent = `${payment.payer} paid ₹${payment.amount} for ${payment.note}. Involved: ${payment.involved.join(', ')}`;
        paymentsDisplay.appendChild(li);
    });
}

function displayPayments(paymentsToDo) {
    const resultDisplay = document.getElementById('result');
    resultDisplay.innerHTML = '<ul>' + paymentsToDo.map(payment => 
        `<li>${payment[0]} has to pay ₹${payment[2]} to ${payment[1]}</li>`
    ).join('') + '</ul>';
}

function calculatePayments(peopleData) {
    const netIndividualAmount = calculateNetAmounts(peopleData);
    const { posVal, negVal } = separatePositiveNegativeAmounts(netIndividualAmount);
    const { posArr, negArr } = sortAmounts(posVal, negVal);
    return settlePayments(posArr, negArr);
}

function calculateNetAmounts(peopleData) {
    const netIndividualAmount = {};
    for (const person in peopleData) {
        netIndividualAmount[person] = peopleData[person].reduce((acc, curr) => acc + curr, 0);
    }
    return netIndividualAmount;
}

function separatePositiveNegativeAmounts(netIndividualAmount) {
    const posVal = {};
    const negVal = {};
    for (const person in netIndividualAmount) {
        const amount = netIndividualAmount[person];
        if (amount >= 0) {
            posVal[person] = amount;
        } else {
            negVal[person] = amount;
        }
    }
    return { posVal, negVal };
}

function sortAmounts(posVal, negVal) {
    const posArr = Object.entries(posVal).map(([key, value]) => [key, value]);
    const negArr = Object.entries(negVal).map(([key, value]) => [key, value]);

    posArr.sort((a, b) => b[1] - a[1]);
    negArr.sort((a, b) => b[1] - a[1]);

    return { posArr, negArr };
}

function settlePayments(posArr, negArr) {
    const paymentsToDo = [];

    while (posArr.length && negArr.length) {
        let iniNeg = negArr[0][1];
        let iniPos = posArr[0][1];

        if (Math.abs(iniNeg) < Math.abs(iniPos)) {
            posArr[0][1] += negArr[0][1];
            const tempData = [negArr[0][0], posArr[0][0], Math.abs(negArr[0][1])];
            negArr[0][1] = 0;
            paymentsToDo.push(tempData);
        } else {
            negArr[0][1] += posArr[0][1];
            const tempData = [negArr[0][0], posArr[0][0], Math.abs(posArr[0][1])];
            posArr[0][1] = 0;
            paymentsToDo.push(tempData);
        }

        if (posArr[0][1] === 0) {
            posArr.shift();
        }
        if (negArr[0][1] === 0) {
            negArr.shift();
        }
    }

    return paymentsToDo;
}

function saveCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function clearCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}

function fetchFromCookies() {
    const storedPeopleData = getCookie('peopleData');
    const storedPaymentsHistory = getCookie('paymentsHistory');

    if (storedPeopleData) {
        peopleData = JSON.parse(storedPeopleData);
        updatePayerDropdown();
        displayPeople();
    }

    if (storedPaymentsHistory) {
        paymentsHistory = JSON.parse(storedPaymentsHistory);
        displayPaymentsMade();
    }
}
