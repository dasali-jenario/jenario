// Language translations
const translations = {
    en: {
        title: "Universal Unit Converter",
        select_language: "Language:",
        category: "Measurement Category",
        length: "Length",
        mass: "Mass",
        temperature: "Temperature",
        volume: "Volume",
        area: "Area",
        speed: "Speed",
        time: "Time",
        from: "From",
        to: "To",
        enter_value: "Enter value",
        initial_message: "Convert units by entering a value above",
        history: "Conversion History",
        clear_history: "Clear History",
        reload_tooltip: "Reload this conversion",
        delete_tooltip: "Delete this conversion",
        swap_tooltip: "Swap units",
        copy_tooltip: "Copy to clipboard",
        copied_tooltip: "Copied!",
        copy_tooltip_mobile: "Tap to copy"
    },
    de: {
        title: "Universeller Einheitenumrechner",
        select_language: "Sprache:",
        category: "Messkategorie",
        length: "Länge",
        mass: "Masse",
        temperature: "Temperatur",
        volume: "Volumen",
        area: "Fläche",
        speed: "Geschwindigkeit",
        time: "Zeit",
        from: "Von",
        to: "Nach",
        enter_value: "Wert eingeben",
        initial_message: "Geben Sie oben einen Wert ein",
        history: "Umrechnungsverlauf",
        clear_history: "Verlauf löschen",
        reload_tooltip: "Diese Umrechnung neu laden",
        delete_tooltip: "Diese Umrechnung löschen",
        swap_tooltip: "Einheiten tauschen",
        copy_tooltip: "In die Zwischenablage kopieren",
        copied_tooltip: "Kopiert!",
        copy_tooltip_mobile: "Zum Kopieren tippen"
    },
    fr: {
        title: "Convertisseur Universel d'Unités",
        select_language: "Langue:",
        category: "Catégorie de mesure",
        length: "Longueur",
        mass: "Masse",
        temperature: "Température",
        volume: "Volume",
        area: "Surface",
        speed: "Vitesse",
        time: "Temps",
        from: "De",
        to: "Vers",
        enter_value: "Entrer une valeur",
        initial_message: "Entrez une valeur ci-dessus pour convertir",
        history: "Historique des conversions",
        clear_history: "Effacer l'historique",
        reload_tooltip: "Recharger cette conversion",
        delete_tooltip: "Supprimer cette conversion",
        swap_tooltip: "Échanger les unités",
        copy_tooltip: "Copier dans le presse-papiers",
        copied_tooltip: "Copié !",
        copy_tooltip_mobile: "Appuyez pour copier"
    },
    it: {
        title: "Convertitore Universale di Unità",
        select_language: "Lingua:",
        category: "Categoria di misura",
        length: "Lunghezza",
        mass: "Massa",
        temperature: "Temperatura",
        volume: "Volume",
        area: "Area",
        speed: "Velocità",
        time: "Tempo",
        from: "Da",
        to: "A",
        enter_value: "Inserisci un valore",
        initial_message: "Inserisci un valore sopra per convertire",
        history: "Cronologia conversioni",
        clear_history: "Cancella cronologia",
        reload_tooltip: "Ricarica questa conversione",
        delete_tooltip: "Elimina questa conversione",
        swap_tooltip: "Scambia unità",
        copy_tooltip: "Copia negli appunti",
        copied_tooltip: "Copiato!",
        copy_tooltip_mobile: "Tocca per copiare"
    },
    es: {
        title: "Convertidor Universal de Unidades",
        select_language: "Idioma:",
        category: "Categoría de medida",
        length: "Longitud",
        mass: "Masa",
        temperature: "Temperatura",
        volume: "Volumen",
        area: "Área",
        speed: "Velocidad",
        time: "Tiempo",
        from: "De",
        to: "A",
        enter_value: "Introducir valor",
        initial_message: "Introduce un valor arriba para convertir",
        history: "Historial de conversiones",
        clear_history: "Borrar historial",
        reload_tooltip: "Recargar esta conversión",
        delete_tooltip: "Eliminar esta conversión",
        swap_tooltip: "Intercambiar unidades",
        copy_tooltip: "Copiar al portapapeles",
        copied_tooltip: "¡Copiado!",
        copy_tooltip_mobile: "Toca para copiar"
    }
};

// Current language
let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

// Unit conversion data
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
        ounce: 0.0283495,
        ton: 1000
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
        acre: 4046.86,
        hectare: 10000
    },
    speed: {
        meterPerSecond: 1,
        kilometerPerHour: 0.277778,
        milePerHour: 0.44704,
        knot: 0.514444
    },
    time: {
        second: 1,
        minute: 60,
        hour: 3600,
        day: 86400,
        week: 604800,
        month: 2629746,
        year: 31556952
    }
};

// DOM Elements
const categorySelect = document.getElementById('category');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const fromValueInput = document.getElementById('fromValue');
const toValueInput = document.getElementById('toValue');
const swapBtn = document.getElementById('swapBtn');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const languageSelect = document.getElementById('language');

// Load conversion histories from localStorage
let conversionHistories = JSON.parse(localStorage.getItem('conversionHistories')) || {
    length: [],
    mass: [],
    temperature: [],
    volume: [],
    area: [],
    speed: [],
    time: []
};

// Current category's history
let currentHistory = [];

// Debounce timer
let addToHistoryTimer = null;

// Update page language
function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        element.textContent = translations[lang][key];
    });

    // Update placeholders
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        element.placeholder = translations[lang][key];
    });

    // Update tooltips
    swapBtn.title = translations[lang].swap_tooltip;

    // Update category options
    Array.from(categorySelect.options).forEach(option => {
        const key = option.getAttribute('data-lang');
        if (key) {
            option.textContent = translations[lang][key];
        }
    });

    // Refresh history display to update any text
    displayHistory();
}

// Initialize the converter
function initializeConverter() {
    // Event listeners
    categorySelect.addEventListener('change', handleCategoryChange);
    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);
    fromValueInput.addEventListener('input', convert);
    swapBtn.addEventListener('click', swapUnits);
    clearHistoryBtn.addEventListener('click', clearHistory);
    languageSelect.addEventListener('change', (e) => updateLanguage(e.target.value));

    // Set initial language
    languageSelect.value = currentLanguage;
    updateLanguage(currentLanguage);

    // Initial setup
    handleCategoryChange();
}

// Handle category change
function handleCategoryChange() {
    const category = categorySelect.value;
    currentHistory = conversionHistories[category];
    
    // Reset the From field
    fromValueInput.value = '';
    toValueInput.value = '';
    resultDiv.textContent = translations[currentLanguage].initial_message;
    
    updateUnitSelects();
    displayHistory();
}

// Update unit select options based on category
function updateUnitSelects() {
    const category = categorySelect.value;
    const units = Object.keys(unitData[category]);
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Add new options
    units.forEach(unit => {
        const fromOption = new Option(unit, unit);
        const toOption = new Option(unit, unit);
        fromUnitSelect.add(fromOption);
        toUnitSelect.add(toOption);
    });
    
    // Set default selections
    if (category === 'temperature') {
        fromUnitSelect.value = 'celsius';
        toUnitSelect.value = 'fahrenheit';
    } else {
        toUnitSelect.selectedIndex = 1;
    }
    
    convert();
}

// Swap units and values
function swapUnits() {
    const tempUnit = fromUnitSelect.value;
    const tempValue = fromValueInput.value;
    
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;
    
    fromValueInput.value = toValueInput.value;
    convert();
}

// Convert units
function convert() {
    const category = categorySelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    const fromValue = parseFloat(fromValueInput.value);

    if (isNaN(fromValue)) {
        toValueInput.value = '';
        resultDiv.textContent = 'Enter a valid number';
        return;
    }

    let result;
    if (category === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        const baseValue = fromValue * unitData[category][fromUnit];
        result = baseValue / unitData[category][toUnit];
    }

    toValueInput.value = result.toFixed(6);
    const conversionText = `${fromValue} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`;
    resultDiv.textContent = conversionText;

    // Clear any existing timer
    if (addToHistoryTimer) {
        clearTimeout(addToHistoryTimer);
    }

    // Set a new timer to add to history after 1 second of no changes
    addToHistoryTimer = setTimeout(() => {
        addToHistory({
            category,
            fromValue,
            fromUnit,
            toValue: result,
            toUnit,
            timestamp: new Date().toISOString()
        });
    }, 1000);
}

// Special handling for temperature conversions
function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    let celsius;
    // Convert to Celsius first
    switch (fromUnit) {
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
    switch (toUnit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return (celsius * 9/5) + 32;
        case 'kelvin':
            return celsius + 273.15;
    }
}

// History management functions
function addToHistory(conversion) {
    const category = conversion.category;
    conversionHistories[category].unshift(conversion);
    // Keep only the last 10 conversions per category
    conversionHistories[category] = conversionHistories[category].slice(0, 10);
    localStorage.setItem('conversionHistories', JSON.stringify(conversionHistories));
    displayHistory();
}

function displayHistory() {
    historyList.innerHTML = '';
    const category = categorySelect.value;
    const categoryHistory = conversionHistories[category];

    if (categoryHistory.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'history-item';
        emptyMessage.style.justifyContent = 'center';
        emptyMessage.style.color = '#666';
        emptyMessage.textContent = `No ${category} conversions yet`;
        historyList.appendChild(emptyMessage);
        return;
    }

    categoryHistory.forEach((conversion, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const conversionText = document.createElement('span');
        conversionText.textContent = `${conversion.fromValue} ${conversion.fromUnit} = ${conversion.toValue.toFixed(6)} ${conversion.toUnit}`;
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'history-item-buttons';

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = '📋';
        copyButton.title = translations[currentLanguage].copy_tooltip;
        
        const tooltip = document.createElement('span');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = isMobile() ? 
            translations[currentLanguage].copy_tooltip_mobile : 
            translations[currentLanguage].copy_tooltip;
        copyButton.appendChild(tooltip);
        
        copyButton.onclick = () => copyToClipboard(conversionText.textContent, tooltip);

        const reloadButton = document.createElement('button');
        reloadButton.className = 'reload-btn';
        reloadButton.textContent = '↺';
        reloadButton.title = translations[currentLanguage].reload_tooltip;
        reloadButton.onclick = () => reloadConversion(conversion);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.title = translations[currentLanguage].delete_tooltip;
        deleteButton.onclick = () => deleteHistoryItem(category, index);
        
        buttonsContainer.appendChild(copyButton);
        buttonsContainer.appendChild(reloadButton);
        buttonsContainer.appendChild(deleteButton);
        
        historyItem.appendChild(conversionText);
        historyItem.appendChild(buttonsContainer);
        historyList.appendChild(historyItem);
    });
}

function reloadConversion(conversion) {
    categorySelect.value = conversion.category;
    updateUnitSelects();
    
    fromUnitSelect.value = conversion.fromUnit;
    toUnitSelect.value = conversion.toUnit;
    fromValueInput.value = conversion.fromValue;
    
    convert();
}

function deleteHistoryItem(category, index) {
    conversionHistories[category].splice(index, 1);
    localStorage.setItem('conversionHistories', JSON.stringify(conversionHistories));
    displayHistory();
}

function clearHistory() {
    const category = categorySelect.value;
    conversionHistories[category] = [];
    localStorage.setItem('conversionHistories', JSON.stringify(conversionHistories));
    displayHistory();
}

// Function to detect if user is on mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to copy text to clipboard and show feedback
async function copyToClipboard(text, tooltip) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Show "Copied!" message
        tooltip.textContent = translations[currentLanguage].copied_tooltip;
        tooltip.classList.add('show');
        
        // Reset tooltip after 2 seconds
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                tooltip.textContent = isMobile() ? 
                    translations[currentLanguage].copy_tooltip_mobile : 
                    translations[currentLanguage].copy_tooltip;
            }, 200);
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', initializeConverter); 