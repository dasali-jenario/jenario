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

    // Add event listeners for unit swapping
    document.getElementById('swapBtn').addEventListener('click', swapUnits);

    // Update placeholder on initial load
    updatePlaceholder();

    // Initialize theme switcher
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'system';
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);

        // Add event listener
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        });

        // Add listener for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (themeSelect.value === 'system') {
                    applyTheme('system');
                }
            });
        }
    }

    // Initialize language switcher
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        // Load saved language
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelect.value = savedLanguage;
        
        // Apply language immediately on page load
        setTimeout(() => {
            applyLanguage(savedLanguage);
            updatePlaceholder();
        }, 0);

        // Add event listener
        languageSelect.addEventListener('change', function() {
            const lang = this.value;
            applyLanguage(lang);
            localStorage.setItem('language', lang);
            // Update placeholders after language change
            updatePlaceholder();
            // Force update all translations
            const event = new Event('languagechange');
            document.dispatchEvent(event);
        });
    }
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

// Chart variables
let freefallChart = null;
let suvatChart = null;
let projectileChart = null;
let forcesChart = null;

// Initialize physics calculators
function initializePhysics() {
    // Initialize charts
    const freefallCtx = document.getElementById('freefallChart').getContext('2d');
    const suvatCtx = document.getElementById('suvatChart').getContext('2d');
    const projectileCtx = document.getElementById('projectileChart').getContext('2d');
    const forcesCtx = document.getElementById('forcesDiagram').getContext('2d');

    // Initialize empty charts with configurations
    initializeCharts(freefallCtx, suvatCtx, projectileCtx, forcesCtx);

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

    // Initialize calculation buttons with event listeners
    document.getElementById('calculateFreefall').addEventListener('click', calculateFreefall);
    document.getElementById('calculateSuvat').addEventListener('click', calculateSuvat);
    document.getElementById('calculateProjectile').addEventListener('click', calculateProjectile);
    document.getElementById('calculateForces').addEventListener('click', calculateForces);
}

// Initialize charts function
function initializeCharts(freefallCtx, suvatCtx, projectileCtx, forcesCtx) {
    // Initialize Freefall Chart
    freefallChart = new Chart(freefallCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Height (m)',
                data: [],
                borderColor: '#4C51BF',
                tension: 0.4,
                fill: false
            }, {
                label: 'Velocity (m/s)',
                data: [],
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

    suvatChart = new Chart(suvatCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Position (m)',
                data: [],
                borderColor: '#4C51BF',
                tension: 0.4,
                fill: false
            }, {
                label: 'Velocity (m/s)',
                data: [],
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

    projectileChart = new Chart(projectileCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Trajectory',
                data: [],
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

    // Initialize Forces Chart
    forcesChart = new Chart(forcesCtx, {
        type: 'bar',
        data: {
            labels: ['Weight', 'Normal', 'Friction', 'Net Force'],
            datasets: [{
                label: 'Force (N)',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    '#4C51BF',
                    '#48BB78',
                    '#ED8936',
                    '#ECC94B'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Force (N)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Chart update functions
function updateFreefallChart(timePoints, positionPoints, velocityPoints) {
    freefallChart.data.labels = timePoints.map(t => t.toFixed(2));
    freefallChart.data.datasets[0].data = positionPoints;
    freefallChart.data.datasets[1].data = velocityPoints;
    freefallChart.update();
}

function updateSuvatChart(time, u, v, a) {
    const timePoints = [];
    const positionPoints = [];
    const velocityPoints = [];
    const dt = time / 50;

    for (let t = 0; t <= time; t += dt) {
        timePoints.push(t.toFixed(2));
        velocityPoints.push(u + a * t);
        positionPoints.push(u * t + 0.5 * a * t * t);
    }

    suvatChart.data.labels = timePoints;
    suvatChart.data.datasets[0].data = positionPoints;
    suvatChart.data.datasets[1].data = velocityPoints;
    suvatChart.update();
}

function updateProjectileChart(xPoints, yPoints) {
    projectileChart.data.datasets[0].data = xPoints.map((x, i) => ({
        x: x,
        y: yPoints[i]
    }));
    projectileChart.update();
}

function updateForcesDiagram(weight, normal, friction, netForce) {
    if (forcesChart) {
        forcesChart.destroy();
    }

    const forcesCtx = document.getElementById('forcesDiagram').getContext('2d');
    forcesChart = new Chart(forcesCtx, {
        type: 'bar',
        data: {
            labels: ['Weight', 'Normal', 'Friction', 'Net Force'],
            datasets: [{
                label: 'Force (N)',
                data: [weight, normal, friction, netForce],
                backgroundColor: [
                    '#4C51BF',
                    '#48BB78',
                    '#ED8936',
                    '#ECC94B'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Force (N)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
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
    area: {
        squareMeter: 1,
        squareKilometer: 1000000,
        squareMile: 2589988.11,
        squareYard: 0.836127,
        squareFoot: 0.092903,
        squareInch: 0.00064516,
        hectare: 10000,
        acre: 4046.86
    },
    speed: {
        meterPerSecond: 1,
        kilometerPerHour: 0.277778,
        milePerHour: 0.44704,
        knot: 0.514444,
        footPerSecond: 0.3048
    },
    time: {
        second: 1,
        minute: 60,
        hour: 3600,
        day: 86400,
        week: 604800,
        month: 2592000,
        year: 31536000
    },
    pressure: {
        pascal: 1,
        kilopascal: 1000,
        bar: 100000,
        psi: 6894.76,
        atmosphere: 101325,
        mmHg: 133.322,
        inchHg: 3386.39,
        torr: 133.322
    },
    energy: {
        joule: 1,
        kilojoule: 1000,
        calorie: 4.184,
        kilocalorie: 4184,
        watthour: 3600,
        kilowatthour: 3600000,
        electronvolt: 1.602176634e-19,
        btu: 1055.06,
        footPound: 1.355818
    },
    power: {
        watt: 1,
        kilowatt: 1000,
        horsepower: 745.7,
        megawatt: 1000000,
        milliwatt: 0.001,
        btuPerHour: 0.29307107
    },
    torque: {
        newtonMeter: 1,
        footPound: 1.355818,
        inchPound: 0.112985,
        kilogramMeter: 9.80665
    },
    force: {
        newton: 1,
        kilonewton: 1000,
        poundForce: 4.44822,
        dyne: 0.00001,
        kilogramForce: 9.80665,
        ounceForce: 0.278014
    },
    frequency: {
        hertz: 1,
        kilohertz: 1000,
        megahertz: 1000000,
        gigahertz: 1000000000,
        revolutionsPerMinute: 0.0166667,
        revolutionsPerSecond: 1,
        cyclesPerSecond: 1
    },
    angle: {
        degree: 1,
        radian: 57.2958,
        gradian: 0.9,
        arcminute: 0.0166667,
        arcsecond: 0.000277778,
        turn: 360,
        quadrant: 90
    },
    density: {
        kilogramPerCubicMeter: 1,
        gramPerCubicCentimeter: 1000,
        poundPerCubicFoot: 16.0185,
        poundPerCubicInch: 27679.9,
        kilogramPerLiter: 1000,
        gramPerMilliliter: 1000,
        poundPerGallon: 119.826427
    },
    pace: {
        minPerKm: 1,
        minPerMile: 1.60934,
        kmPerHour: 0.06,
        milesPerHour: 0.0372823,
        secPerKm: 0.0166667,
        secPerMile: 0.0268224
    },
    viscosity: {
        pascalSecond: 1,
        poise: 0.1,
        centipoise: 0.001,
        squareMeterPerSecond: 1,
        squareFootPerSecond: 0.092903,
        stokes: 0.0001,
        centistokes: 0.000001
    },
    scientific: {
        mole: 1,
        millimole: 0.001,
        micromole: 0.000001,
        nanomole: 1e-9,
        picomole: 1e-12
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
        updatePlaceholder();
    });

    // Add event listener for unit changes
    fromUnitSelect.addEventListener('change', () => {
        convert();
        updatePlaceholder();
    });

    toUnitSelect.addEventListener('change', convert);
    fromValueInput.addEventListener('input', convert);
    swapButton.addEventListener('click', () => {
        swapUnits();
        updatePlaceholder();
    });

    // Initialize search
    initializeSearch();

    // Initialize favorites
    initializeFavorites();
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

// Swap units function
function swapUnits() {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');

    // Swap unit selections
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;

    // Swap values
    const tempValue = fromValue.value;
    fromValue.value = toValue.value;
    toValue.value = tempValue;

    // Trigger conversion
    convert();
}

// Add to history function
function addToHistory(fromValue, fromUnit, result, toUnit, category) {
    const historyList = document.getElementById('historyList');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const conversionText = document.createElement('span');
    conversionText.textContent = `${fromValue} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`;
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'history-item-buttons';
    
    // Reload button
    const reloadBtn = document.createElement('button');
    reloadBtn.innerHTML = '🔄';
    reloadBtn.className = 'reload-btn';
    reloadBtn.onclick = () => {
        document.getElementById('category').value = category;
        loadUnitsForCategory(category);
        document.getElementById('fromUnit').value = fromUnit;
        document.getElementById('toUnit').value = toUnit;
        document.getElementById('fromValue').value = fromValue;
        convert();
    };
    
    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋';
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(result.toFixed(6));
        showTooltip(copyBtn, 'Copied!');
    };
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => historyItem.remove();
    
    buttonsDiv.appendChild(reloadBtn);
    buttonsDiv.appendChild(copyBtn);
    buttonsDiv.appendChild(deleteBtn);
    historyItem.appendChild(conversionText);
    historyItem.appendChild(buttonsDiv);
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limit history to 10 items
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        if (query.length < 2) {
            searchResults.classList.remove('show');
            return;
        }
        
        const results = [];
        for (const category in unitData) {
            for (const unit in unitData[category]) {
                if (unit.toLowerCase().includes(query)) {
                    results.push({ category, unit });
                }
            }
        }
        
        displaySearchResults(results);
    });
}

// Display search results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.classList.remove('show');
        return;
    }
    
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.textContent = `${result.unit} (${result.category})`;
        item.onclick = () => {
            document.getElementById('category').value = result.category;
            loadUnitsForCategory(result.category);
            document.getElementById('fromUnit').value = result.unit;
            searchResults.classList.remove('show');
            document.getElementById('searchInput').value = '';
        };
        searchResults.appendChild(item);
    });
    
    searchResults.classList.add('show');
}

// Initialize favorites functionality
function initializeFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesList = document.getElementById('favoritesList');
    const favoritesSection = document.getElementById('favoritesSection');
    
    if (favorites.length > 0) {
        favoritesSection.classList.add('has-favorites');
        displayFavorites(favorites);
    }
    
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
}

// Display favorites
function displayFavorites(favorites) {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    
    favorites.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.textContent = `${fav.category}: ${fav.fromUnit} → ${fav.toUnit}`;
        item.onclick = () => {
            document.getElementById('category').value = fav.category;
            loadUnitsForCategory(fav.category);
            document.getElementById('fromUnit').value = fav.fromUnit;
            document.getElementById('toUnit').value = fav.toUnit;
        };
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-favorite';
        removeBtn.textContent = '×';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            removeFavorite(fav);
        };
        
        item.appendChild(removeBtn);
        favoritesList.appendChild(item);
    });
}

// Toggle favorite
function toggleFavorite() {
    const category = document.getElementById('category').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const existingIndex = favorites.findIndex(f => 
        f.category === category && 
        f.fromUnit === fromUnit && 
        f.toUnit === toUnit
    );
    
    if (existingIndex === -1) {
        favorites.push({ category, fromUnit, toUnit });
        favoriteBtn.classList.add('active');
    } else {
        favorites.splice(existingIndex, 1);
        favoriteBtn.classList.remove('active');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    document.getElementById('favoritesSection').classList.toggle('has-favorites', favorites.length > 0);
    displayFavorites(favorites);
}

// Remove favorite
function removeFavorite(favorite) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = favorites.filter(f => 
        !(f.category === favorite.category && 
          f.fromUnit === favorite.fromUnit && 
          f.toUnit === favorite.toUnit)
    );
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    document.getElementById('favoritesSection').classList.toggle('has-favorites', newFavorites.length > 0);
    displayFavorites(newFavorites);
}

// Apply theme
function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Apply language
function applyLanguage(lang) {
    // First ensure the language is valid
    if (!translations[lang]) {
        console.warn(`Language ${lang} not found, falling back to English`);
        lang = 'en';
    }

    // Get the translations for the selected language
    const currentTranslations = translations[lang];

    // Apply translations to all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (currentTranslations[key]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = currentTranslations[key];
            } else {
                element.textContent = currentTranslations[key];
            }
        }
    });

    // Update placeholders for elements with data-lang-placeholder
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (currentTranslations[key]) {
            element.placeholder = currentTranslations[key];
        }
    });

    // Update theme selector options
    const themeSelect = document.getElementById('theme');
    if (themeSelect && currentTranslations) {
        themeSelect.options[0].text = `🌓 ${currentTranslations.system_theme}`;
        themeSelect.options[1].text = `☀️ ${currentTranslations.light}`;
        themeSelect.options[2].text = `🌙 ${currentTranslations.dark}`;
    }

    // Update calculator mode labels
    const simpleModeLabel = document.querySelector('.mode-label:first-child');
    const scientificModeLabel = document.querySelector('.mode-label:last-child');
    if (simpleModeLabel && scientificModeLabel && currentTranslations) {
        simpleModeLabel.textContent = currentTranslations.simple_mode;
        scientificModeLabel.textContent = currentTranslations.scientific_mode;
    }

    // Update physics calculator error messages
    const freefallResult = document.getElementById('freefallResult');
    if (freefallResult && currentTranslations) {
        freefallResult.textContent = currentTranslations.error_fill_fields;
    }

    // Update document language
    document.documentElement.lang = lang;

    // Update placeholders
    updatePlaceholder();
}

// Update the updatePlaceholder function
function updatePlaceholder() {
    const category = document.getElementById('category').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const fromInput = document.getElementById('fromValue');
    const currentLang = document.getElementById('language').value;
    
    // Get the current language translations, fallback to English if not found
    const currentTranslations = translations[currentLang] || translations['en'];
    
    // Example values for different categories with translations
    const examples = {
        length: {
            meter: currentTranslations.example_height_meters,
            kilometer: currentTranslations.example_distance_km,
            // Add translations for other length units
            centimeter: currentTranslations.example_height_meters?.replace('1,8', '180').replace('1.8', '180'),
            millimeter: currentTranslations.example_height_meters?.replace('1,8', '1800').replace('1.8', '1800')
        },
        mass: {
            kilogram: currentTranslations.example_weight_kg,
            gram: currentTranslations.example_weight_kg?.replace('75', '75000'),
            milligram: currentTranslations.example_weight_kg?.replace('75', '75000000')
        },
        temperature: {
            celsius: currentTranslations.example_temp_celsius,
            fahrenheit: currentTranslations.example_temp_celsius?.replace('37', '98.6'),
            kelvin: currentTranslations.example_temp_celsius?.replace('37', '310.15')
        },
        volume: {
            liter: currentTranslations.example_volume_liters,
            milliliter: currentTranslations.example_volume_liters?.replace('2', '2000'),
            cubicMeter: currentTranslations.example_volume_liters?.replace('2', '0.002')
        }
    };

    // Get example for current category and unit
    if (examples[category] && examples[category][fromUnit]) {
        fromInput.placeholder = examples[category][fromUnit];
    } else {
        // Default placeholder using the current language
        fromInput.placeholder = `${currentTranslations.from}: ${fromUnit}`;
    }
}
