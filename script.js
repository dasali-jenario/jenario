// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the converter
    initializeConverter();

    // Initialize calculator functionality
    initializeCalculator();

    // Initialize physics calculators
    initializePhysics();

    // Initialize tab switching
    initializeTabs();
});

// Tab switching functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${targetTab}Pane`).classList.add('active');
        });
    });
}

// Initialize calculator functionality
function initializeCalculator() {
    const calculatorButtons = document.getElementById('calculatorButtons');
    const calcDisplay = document.getElementById('calcDisplay');
    const calculatorMode = document.getElementById('calculatorMode');

    // Load saved calculator mode
    const savedMode = localStorage.getItem('calculatorMode') === 'scientific';
    calculatorMode.checked = savedMode;
    calculatorButtons.classList.toggle('simple', !savedMode);

    // Calculator mode toggle
    calculatorMode.addEventListener('change', function() {
        calculatorButtons.classList.toggle('simple', !this.checked);
        localStorage.setItem('calculatorMode', this.checked ? 'scientific' : 'simple');
    });

    // Calculator button clicks
    calculatorButtons.addEventListener('click', function(e) {
        if (e.target.classList.contains('calc-btn')) {
            handleCalculatorClick(e.target.textContent);
        }
    });
}

// Initialize physics calculators
function initializePhysics() {
    // Physics tab switching
    const physicsTabs = document.querySelectorAll('.physics-tab');
    const physicsSections = document.querySelectorAll('.physics-section');

    physicsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.dataset.tab;

            physicsTabs.forEach(t => t.classList.remove('active'));
            physicsSections.forEach(s => s.classList.add('hidden'));

            tab.classList.add('active');
            document.getElementById(`${targetSection}Section`).classList.remove('hidden');
        });
    });

    // Initialize calculation buttons
    document.getElementById('calculateFreefall').addEventListener('click', calculateFreefall);
    document.getElementById('calculateSuvat').addEventListener('click', calculateSuvat);
    document.getElementById('calculateProjectile').addEventListener('click', calculateProjectile);
    document.getElementById('calculateForces').addEventListener('click', calculateForces);
}

// Physics constants
const GRAVITY = 9.81; // m/s²
const AIR_DENSITY = 1.225; // kg/m³
const DRAG_COEFFICIENT = 0.47; // for a sphere

// Free Fall Calculator
function calculateFreefall() {
    const mass = parseFloat(document.getElementById('objectMass').value);
    const size = parseFloat(document.getElementById('objectSize').value);
    const height = parseFloat(document.getElementById('fallHeight').value);

    if (isNaN(mass) || isNaN(size) || isNaN(height)) {
        document.getElementById('freefallResult').textContent = 'Please fill in all fields with valid numbers.';
        return;
    }

    const area = Math.PI * Math.pow(size/2, 2); // Cross-sectional area
    const dragConstant = 0.5 * AIR_DENSITY * DRAG_COEFFICIENT * area;
    const terminalVelocity = Math.sqrt((mass * GRAVITY) / dragConstant);

    // Calculate time points and corresponding positions/velocities
    const timePoints = [];
    const positionPoints = [];
    const velocityPoints = [];
    let currentTime = 0;
    let currentPosition = height;
    let currentVelocity = 0;
    const dt = 0.1; // Time step

    while (currentPosition > 0) {
        timePoints.push(currentTime);
        positionPoints.push(currentPosition);
        velocityPoints.push(currentVelocity);

        const dragForce = dragConstant * Math.pow(currentVelocity, 2) * Math.sign(currentVelocity);
        const netForce = mass * GRAVITY - dragForce;
        const acceleration = netForce / mass;

        currentVelocity += acceleration * dt;
        currentPosition -= currentVelocity * dt;
        currentTime += dt;
    }

    // Update the chart
    updateFreefallChart(timePoints, positionPoints, velocityPoints);

    // Display results
    const totalTime = currentTime.toFixed(2);
    const maxVelocity = Math.max(...velocityPoints).toFixed(2);
    const result = `Results:
    Total fall time: ${totalTime} seconds
    Terminal velocity: ${terminalVelocity.toFixed(2)} m/s
    Maximum velocity reached: ${maxVelocity} m/s`;

    document.getElementById('freefallResult').textContent = result;
    addToPhysicsHistory('freefall', result);
}

// SUVAT Motion Calculator
function calculateSuvat() {
    const s = parseFloat(document.getElementById('suvatS').value);
    const u = parseFloat(document.getElementById('suvatU').value);
    const v = parseFloat(document.getElementById('suvatV').value);
    const a = parseFloat(document.getElementById('suvatA').value);
    const t = parseFloat(document.getElementById('suvatT').value);

    let result = 'Results:\n';
    const knownValues = [];
    if (!isNaN(s)) knownValues.push('s');
    if (!isNaN(u)) knownValues.push('u');
    if (!isNaN(v)) knownValues.push('v');
    if (!isNaN(a)) knownValues.push('a');
    if (!isNaN(t)) knownValues.push('t');

    if (knownValues.length < 3) {
        document.getElementById('suvatResult').textContent = 'Please provide at least 3 values.';
        return;
    }

    // Calculate missing values using SUVAT equations
    let calculatedValues = {};
    
    // v = u + at
    if (!knownValues.includes('v') && knownValues.includes('u') && knownValues.includes('a') && knownValues.includes('t')) {
        calculatedValues.v = u + a * t;
    }
    
    // s = ut + ½at²
    if (!knownValues.includes('s') && knownValues.includes('u') && knownValues.includes('a') && knownValues.includes('t')) {
        calculatedValues.s = u * t + 0.5 * a * Math.pow(t, 2);
    }
    
    // v² = u² + 2as
    if (!knownValues.includes('v') && knownValues.includes('u') && knownValues.includes('a') && knownValues.includes('s')) {
        calculatedValues.v = Math.sqrt(Math.pow(u, 2) + 2 * a * s);
    }

    // Format results
    if (!isNaN(s)) result += `Displacement (s): ${s} m\n`;
    if (!isNaN(u)) result += `Initial velocity (u): ${u} m/s\n`;
    if (!isNaN(v)) result += `Final velocity (v): ${v} m/s\n`;
    if (!isNaN(a)) result += `Acceleration (a): ${a} m/s²\n`;
    if (!isNaN(t)) result += `Time (t): ${t} s\n`;

    for (const [key, value] of Object.entries(calculatedValues)) {
        result += `Calculated ${key}: ${value.toFixed(2)}\n`;
    }

    document.getElementById('suvatResult').textContent = result;
    addToPhysicsHistory('suvat', result);

    // Update the chart
    updateSuvatChart(t || 10, u, v, a);
}

// Projectile Motion Calculator
function calculateProjectile() {
    const velocity = parseFloat(document.getElementById('projVelocity').value);
    const angle = parseFloat(document.getElementById('projAngle').value);
    const height = parseFloat(document.getElementById('projHeight').value) || 0;

    if (isNaN(velocity) || isNaN(angle)) {
        document.getElementById('projectileResult').textContent = 'Please provide initial velocity and angle.';
        return;
    }

    const angleRad = angle * Math.PI / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);

    // Calculate maximum height and range
    const maxHeight = height + Math.pow(vy, 2) / (2 * GRAVITY);
    const timeToMax = vy / GRAVITY;
    const totalTime = (vy + Math.sqrt(Math.pow(vy, 2) + 2 * GRAVITY * height)) / GRAVITY;
    const range = vx * totalTime;

    // Generate points for trajectory
    const timePoints = [];
    const xPoints = [];
    const yPoints = [];
    const dt = totalTime / 50;

    for (let t = 0; t <= totalTime; t += dt) {
        timePoints.push(t);
        xPoints.push(vx * t);
        yPoints.push(height + vy * t - 0.5 * GRAVITY * Math.pow(t, 2));
    }

    // Update the chart
    updateProjectileChart(xPoints, yPoints);

    const result = `Results:
    Maximum height: ${maxHeight.toFixed(2)} m
    Time to max height: ${timeToMax.toFixed(2)} s
    Total time of flight: ${totalTime.toFixed(2)} s
    Range: ${range.toFixed(2)} m`;

    document.getElementById('projectileResult').textContent = result;
    addToPhysicsHistory('projectile', result);
}

// Forces Calculator
function calculateForces() {
    const mass = parseFloat(document.getElementById('forceMass').value);
    const acceleration = parseFloat(document.getElementById('forceAccel').value);
    const friction = parseFloat(document.getElementById('forceFriction').value) || 0;

    if (isNaN(mass)) {
        document.getElementById('forcesResult').textContent = 'Please provide the mass.';
        return;
    }

    const weight = mass * GRAVITY;
    const normal = weight;
    const frictionForce = friction * normal;
    const netForce = mass * (acceleration || 0);

    const result = `Results:
    Weight: ${weight.toFixed(2)} N
    Normal force: ${normal.toFixed(2)} N
    Friction force: ${frictionForce.toFixed(2)} N
    Net force: ${netForce.toFixed(2)} N`;

    document.getElementById('forcesResult').textContent = result;
    addToPhysicsHistory('forces', result);

    // Update the force diagram
    updateForcesDiagram(weight, normal, frictionForce, netForce);
}

// Add to physics history
function addToPhysicsHistory(type, calculation) {
    const historyList = document.getElementById(`${type}History`);
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const calcText = document.createElement('span');
    calcText.textContent = calculation;
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'history-item-buttons';
    
    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋';
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(calculation);
        showTooltip(copyBtn, 'Copied!');
    };
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => historyItem.remove();
    
    buttonsDiv.appendChild(copyBtn);
    buttonsDiv.appendChild(deleteBtn);
    historyItem.appendChild(calcText);
    historyItem.appendChild(buttonsDiv);
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limit history to 10 items
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Update chart configurations for Free Fall
window.freefallChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timePoints.map(t => t.toFixed(2)),
        datasets: [{
            label: 'Height (m)',
            data: positionPoints,
            borderColor: '#4C51BF',
            tension: 0.4,
            fill: false
        }, {
            label: 'Velocity (m/s)',
            data: velocityPoints,
            borderColor: '#48BB78',
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Height (m) / Velocity (m/s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    }
});

// Update SUVAT chart configuration
window.suvatChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timePoints,
        datasets: [{
            label: 'Position (m)',
            data: positionPoints,
            borderColor: '#4C51BF',
            tension: 0.4,
            fill: false
        }, {
            label: 'Velocity (m/s)',
            data: velocityPoints,
            borderColor: '#48BB78',
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Position (m) / Velocity (m/s)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    }
});

// Update Projectile Motion chart configuration
window.projectileChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Trajectory',
            data: timePoints.map((_, i) => ({
                x: xPoints[i],
                y: yPoints[i]
            })),
            borderColor: '#4C51BF',
            backgroundColor: '#4C51BF',
            showLine: true,
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Distance (m)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Height (m)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    }
});

// Unit data
const unitData = {
    length: {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.34,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254
    },
    mass: {
        kilogram: 1,
        gram: 0.001,
        milligram: 0.000001,
        pound: 0.453592,
        ounce: 0.0283495
    },
    temperature: {
        celsius: 'base',
        fahrenheit: 'custom',
        kelvin: 'custom'
    },
    volume: {
        liter: 1,
        milliliter: 0.001,
        cubicMeter: 1000,
        gallon: 3.78541,
        quart: 0.946353,
        pint: 0.473176,
        cup: 0.236588
    },
    pace: {
        minPerKm: 1,
        minPerMile: 1.60934,
        kmPerHour: 0.06,
        milesPerHour: 0.0372823,
        secPerKm: 0.0166667,
        secPerMile: 0.0268224
    }
};

// Initialize converter functionality
function initializeConverter() {
    // Get DOM elements
    const categorySelect = document.getElementById('category');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const fromValueInput = document.getElementById('fromValue');
    const toValueInput = document.getElementById('toValue');
    const swapButton = document.getElementById('swapBtn');
    const searchInput = document.getElementById('searchInput');
    const favoriteButton = document.getElementById('favoriteBtn');

    // Load initial units
    loadUnitsForCategory(categorySelect.value);

    // Event listeners
    categorySelect.addEventListener('change', () => {
        loadUnitsForCategory(categorySelect.value);
        convert();
    });

    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);
    fromValueInput.addEventListener('input', convert);
    swapButton.addEventListener('click', swapUnits);

    // Initialize search
    initializeSearch();

    // Initialize favorites
    initializeFavorites();

    // Load saved theme
    loadTheme();

    // Load saved language
    loadLanguage();
}

// Load units for a category
function loadUnitsForCategory(category) {
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const units = unitData[category];

    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    // Add new options
    for (const unit in units) {
        const fromOption = new Option(unit, unit);
        const toOption = new Option(unit, unit);
        fromUnitSelect.add(fromOption);
        toUnitSelect.add(toOption);
    }

    // Set default selections
    if (fromUnitSelect.options.length > 0) {
        fromUnitSelect.selectedIndex = 0;
    }
    if (toUnitSelect.options.length > 1) {
        toUnitSelect.selectedIndex = 1;
    }
}

// Conversion function
function convert() {
    const category = document.getElementById('category').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const resultDisplay = document.getElementById('toValue');

    if (isNaN(fromValue)) {
        resultDisplay.value = '';
        return;
    }

    let result;
    if (category === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        const fromFactor = unitData[category][fromUnit];
        const toFactor = unitData[category][toUnit];
        result = fromValue * fromFactor / toFactor;
    }

    resultDisplay.value = result.toFixed(6);
    addToHistory(fromValue, fromUnit, result, toUnit, category);
}

// Temperature conversion
function convertTemperature(value, from, to) {
    let celsius;
    
    // Convert to Celsius first
    switch(from) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }

    // Convert from Celsius to target unit
    switch(to) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return celsius * 9/5 + 32;
        case 'kelvin':
            return celsius + 273.15;
    }
}

// Calculator functionality
function handleCalculatorClick(value) {
    const display = document.getElementById('calcDisplay');
    let currentValue = display.textContent;

    switch(value) {
        case 'C':
            display.textContent = '0';
            break;
        case '=':
            try {
                // Replace special characters for evaluation
                let expression = currentValue
                    .replace('×', '*')
                    .replace('÷', '/')
                    .replace('π', 'Math.PI')
                    .replace('e', 'Math.E');

                // Handle scientific functions
                expression = expression
                    .replace(/sin\(/g, 'Math.sin(')
                    .replace(/cos\(/g, 'Math.cos(')
                    .replace(/tan\(/g, 'Math.tan(')
                    .replace(/log\(/g, 'Math.log10(')
                    .replace(/ln\(/g, 'Math.log(')
                    .replace(/√\(/g, 'Math.sqrt(')
                    .replace(/\|/g, 'Math.abs(');

                const result = eval(expression);
                display.textContent = Number.isInteger(result) ? result : result.toFixed(8);
                addToCalculatorHistory(`${currentValue} = ${display.textContent}`);
            } catch (error) {
                display.textContent = 'Error';
            }
            break;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
        case '√':
            display.textContent = currentValue === '0' ? `${value}(` : `${currentValue}${value}(`;
            break;
        case 'x²':
            try {
                const number = parseFloat(currentValue);
                display.textContent = (number * number).toString();
            } catch (error) {
                display.textContent = 'Error';
            }
            break;
        case 'π':
            display.textContent = currentValue === '0' ? Math.PI.toString() : currentValue + Math.PI.toString();
            break;
        case 'e':
            display.textContent = currentValue === '0' ? Math.E.toString() : currentValue + Math.E.toString();
            break;
        case '|x|':
            try {
                const number = parseFloat(currentValue);
                display.textContent = Math.abs(number).toString();
            } catch (error) {
                display.textContent = 'Error';
            }
            break;
        case 'x!':
            try {
                const number = parseInt(currentValue);
                if (number < 0) throw new Error('Negative factorial');
                display.textContent = factorial(number).toString();
            } catch (error) {
                display.textContent = 'Error';
            }
            break;
        default:
            display.textContent = currentValue === '0' ? value : currentValue + value;
    }
}

// Factorial calculation
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

// Add to calculator history
function addToCalculatorHistory(calculation) {
    const historyList = document.getElementById('calculatorHistory');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const calcText = document.createElement('span');
    calcText.textContent = calculation;
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'history-item-buttons';
    
    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋';
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = () => {
        const result = calculation.split('=')[1].trim();
        navigator.clipboard.writeText(result);
        showTooltip(copyBtn, 'Copied!');
    };
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => historyItem.remove();
    
    buttonsDiv.appendChild(copyBtn);
    buttonsDiv.appendChild(deleteBtn);
    historyItem.appendChild(calcText);
    historyItem.appendChild(buttonsDiv);
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limit history to 10 items
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Show tooltip
function showTooltip(element, text) {
    const tooltip = document.createElement('span');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = text;
    element.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 200);
    }, 1000);
}
