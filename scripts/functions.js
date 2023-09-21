const results = document.querySelector(".result");
const history = document.querySelector(".historial");
const buttons = document.querySelectorAll(".num, .operator");
const btn_equal = document.getElementById("btn_equal");
const btn_delete = document.getElementById("btn_delete")
const btn_deleteAll = document.getElementById("btn_C");
const btn_dec = document.getElementById("btn_dec");

results.disabled = true
btn_dec.disabled = false


// Operators formula
const sum = (a, b) => a + b;
const rest = (a, b) => a - b;
const multi = (a, b) => a * b;
const div = (a, b) => a / b;
const percentage = (value, percentage) => (value * percentage) / 100;

let last_result = undefined;
let show_history = '';
let data_input = '';
let operator = null;

const showHistorial = () => {
    history.textContent = show_history;
    results.value = data_input
};

const showResults = () => {
    results.textContent = data_input;
};

buttons.forEach((button) => {
    const textContent = button.textContent;


    if (textContent === 'C') {
        button.addEventListener("click", () => {
            show_history = '';
            data_input = '';
            operator = null;
            showHistorial();
            showResults();
        });
    }

    if (textContent === '=') {
        button.addEventListener("click", () => {

            let showHistorySplited = show_history.split(/ |/);
            let historyLastElement = Number(showHistorySplited.length === 0 ? undefined : showHistorySplited.at(-1));
            const lastElementOnHistoryIsNumber = !Number.isNaN(historyLastElement);

            if (lastElementOnHistoryIsNumber) {
                const operation = calculateResult();
                show_history = "";
                data_input = `${operation}`
                showHistorial();
                showResults();
            }
        });
    }

    if (["+", "-", "x", "÷"].includes(textContent)) {
        button.addEventListener("click", () => {
            let showHistorySplited = show_history.split(/ |/);
            let historyLastElement = Number(showHistorySplited.length === 0 ? undefined : showHistorySplited.at(-1));
            const lastElementOnHistoryIsNumber = !Number.isNaN(historyLastElement);

            if (lastElementOnHistoryIsNumber) {
                show_history += lastElementOnHistoryIsNumber ? ` ${textContent}` : ` ${data_input}`;
            }

            if (showHistorySplited.length === 0) {
                show_history += `${data_input} ${textContent}`;
            }

            if (lastElementOnHistoryIsNumber || showHistorySplited.length === 0) {
                data_input = "";
                showResults();
                showHistorial();
            }
        });
    }

    if (/^([0-9]|\.)/.test(textContent)) {

        button.addEventListener("click", () => {
            const showHistorySplited = show_history.split(/ |/);
            const historyLastElement = Number(showHistorySplited.length === 0 ? undefined : showHistorySplited.at(-1));
            const lastElementOnHistoryIsNumber = !Number.isNaN(historyLastElement);
            const lastElementOnHistoryIsPoint = showHistorySplited.at(-1) === ".";
            const quantityPointsOnDataInput = inputCounterPoint();

            if (!lastElementOnHistoryIsNumber) {
                if (lastElementOnHistoryIsPoint) {
                    show_history = `${show_history}${textContent}`.trim()
                    data_input = new String(data_input).concat(textContent);
                } else {
                    show_history = `${show_history} ${textContent}`.trim()
                    data_input = textContent;
                }
            }

            if (lastElementOnHistoryIsNumber) {
                if (show_history.split(/ |/).length > 0) {
                    if (quantityPointsOnDataInput >= 1 && textContent === ".") {
                        return;
                    } else {
                        show_history = new String(show_history).concat(textContent)
                        data_input = new String(data_input).concat(textContent)
                    }
                } else {
                    data_input = new String(data_input).concat(textContent)
                    show_history = data_input;
                }
            }

            showHistorial();
            showResults()
        });
    }
});


const inputCounterPoint = () => {
    pointDisenabled()
    return data_input.split("").reduce((prev, curr) => {
        return curr === "." ? prev + 1 : prev;
    }, 0);
}

// Función para calcular el resultado
const calculateResult = () => {
    /** @type {string[]} */
    const operation = show_history.replaceAll(/( |)/g, "").split(/(\+|\-|\x|\÷|\%)/);
    console.log(operation)
    let lastElement = "";

    return operation.reduce((prev, curr) => {
        if (!Number.isNaN(Number(curr))) {
            switch (lastElement) {
                case ("+"):
                    lastElement = "";
                    return prev + Number(curr)
                case ("-"):
                    lastElement = "";
                    return prev - Number(curr)
                case ("x"):
                    lastElement = "";
                    return prev * Number(curr)
                case ("÷"):
                    lastElement = "";
                    return prev / Number(curr)
                case ("%"):
                    lastElement = "";
                    return (prev * Number(curr)) / 100;
                default:
                    return Number(prev);
            }
        } else {
            if (!Number.isNaN(Number(prev))) {
                lastElement = curr;
                return Number(prev)
            }
        }
    })
};


// Función para mostrar el resultado cuando se presiona el botón "="
btn_equal.addEventListener('click', () => {
    pointEnabled()
    if (operator !== null) {
        show_history += ` ${data_input}`;
        data_input = calculateResult(data_input);
        operator = null;
        showHistorial();
        showResults();

        // Agregar un console.log para mostrar el resultado
        console.log('Resultado: ', data_input);
    }
});

//Borra solo un elemento 
btn_delete.addEventListener('click', () => {
    const showHistorySplited = show_history.split(/ |/);
    const historyLastElement = Number(showHistorySplited.length === 0 ? undefined : showHistorySplited.at(-1));
    const dataInputLastElement = Number(data_input.at(-1));

    const lastElementOnHistoryIsNumber = !Number.isNaN(historyLastElement);
    const lastElementOnDataInputIsNumber = !Number.isNaN(dataInputLastElement);
    const lastElementOnHistoryIsSign = /(\+|\-|\x|\÷)/.test(showHistorySplited.at(-1));

    if (
        lastElementOnHistoryIsNumber ||
        lastElementOnDataInputIsNumber ||
        lastElementOnHistoryIsSign ||
        dataInputLastElement !== ""
    ) {
        show_history = show_history.substring(0, show_history.length - 1).trimEnd();
        data_input = data_input.substring(0, data_input.length - 1)
        showHistorial();
        showResults();
    }
})

// Función para limpiar todo
btn_deleteAll.addEventListener('click', () => {
    show_history = '';
    data_input = '';
    operator = null;
    showHistorial();
    showResults();
    pointEnabled();
});



pointEnabled = () => {
    btn_dec.disabled = false
}

pointDisenabled = () => {
    btn_dec.disabled = !false
}