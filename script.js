// ---------------------- UTILITIES ----------------------//

// query selectors //

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)


// show main screens //

const showScreens = (screenName) => {
    const screens = $$('.screen')

    for (let screen of screens) {
        screen.classList.add('hidden')
    }

    $(`#container${screenName}`).classList.remove('hidden')
}

// cleaner //

const cleanContainer = (selector) => $(selector).innerHTML = ""



const remove = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove('hidden')
    }
}

const add = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add('hidden')
    }
}

// ID creators

const randomId = () => self.crypto.randomUUID()

// -------------------- LOCAL STORAGE --------------------//

// senders and receivers

const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const getData = (key) => JSON.parse(localStorage.getItem(key))

//Default info

const defaultCategories = [
    {
        id: randomId(),
        name: "Comida"
    },
    {
        id: randomId(),
        name: "Servicios"
    },
    {
        id: randomId(),
        name: "Salidas"
    },
    {
        id: randomId(),
        name: "Educación"
    },
    {
        id: randomId(),
        name: "Transporte"
    },
    {
        id: randomId(),
        name: "Trabajo"
    }
]


// Default setters

const allOperation = getData('operations') || []

const allCategories = getData("categories") || defaultCategories

const askForData = () => {
    getData()

}

// -------------------- RENDERS --------------------//

// Operations 

const iterateOperations = (operations) => {
    cleanContainer('#tableOperations')
    for (const operation of operations) {
        const categorySelected = getData("categories").find(category => category.id === operation.category)
        $("#tableOperations").innerHTML += `
        <tr class="border-b">
                    <td class="p-4">${operation.description}</td>
                    <td class="mt-6 ml-5 py-1 px-2 inline-block bg-[#886a8e]  rounded-full">${categorySelected.name}</td>
                    <td class="p-2">${operation.date}</td>
                    <td class="p-2">${operation.amount}</td>
                    <td class="p-2 flex flex-col space-y-2">
                        <button class="edit-category bg-green-700 hover:bg-green-500 border-white rounded-[25%] w-[30%] self-center" onclick= "showFormEdit('${operation.id}')"><i class="fa-solid fa-pen-to-square p-1.5"></i></button>
                        <button class="delete-category text-white h bg-red-700 hover:bg-red-500 border-white rounded-[25%] w-[30%] self-center" onclick= "showDeleteOperation('${operation.id}')"><i class="fa-solid fa-trash-can p-1.5"></i></button>
                    </td>
                </tr>
    `
    }
}

// Categories

const renderCategories = (categories) => {
    cleanContainer('#categoriesTable')
    for (const category of categories) {
        $("#categoriesTable").innerHTML += `
            <tr class="flex w-[100%] justify-between">
                <td class= "text-[1.3rem]">${category.name}</td>
                <td>
                    <button class="edit-category bg-green-700 hover:bg-green-500 border-white rounded-[25%]" onclick= "showEditCategory('${category.id}')"><i class="fa-solid fa-pen-to-square p-1.5"></i></button>
                    <button class="delete-category text-white h bg-red-700 hover:bg-red-500 border-white rounded-[25%] mr-1" onclick= "confirmDeleteCategory('${category.id}')"><i class="fa-solid fa-trash-can p-1.5"></i></button>
                </td>
            </tr>
            <hr class= "text-black text-1 my-1.5"/>
        `
    }
}

const renderCategoriesOptions = (categories) => {
    cleanContainer("#categories")
    $("#categories").innerHTML = `
            <option value= "Todas">Todas</option>
        `
    for (const category of categories) {
        $("#categories").innerHTML += `
            <option value= "${category.id}">${category.name}</option>
        `
    }
}

const renderInputCategoriesOptions = (categories) => {
    cleanContainer("#inputCategories")
    for (const category of categories) {
        $("#inputCategories").innerHTML += `
            <option value= "${category.id}">${category.name}</option>
        `
    }
}

// -------------------- OPERATIONS FUNCTIONS --------------------//

const getOperationById = (id) => {
    const operations = getData('operations');
    return operations.find(operation => operation.id === id) || null;
};

// Value containers

const infoForm = () => {
    return {
        id: randomId(),
        description: $('#descriptionNo').value,
        amount: parseInt($('#amountNo').value),
        type: $('#typeSelect').value,
        category: $('#inputCategories').value,
        date: $('#inputDate').value
    }
}

// Add operation

const addOperation = () => {
    const currentData = getData("operations")
    currentData.push(infoForm())
    setData("operations", currentData)
    iterateOperations(currentData)
}

// Edit operation 

const showFormEdit = (operationId) => {
    add(['.balance-screen', '#addButtonNo'])
    remove(['.new-operarion-screen', '#addEditButtonNo']) 
    console.log(operationId)
    const operationSelected = getData('operations').find(operation => operation.id === operationId)
    console.log(operationSelected)
    $('#descriptionNo').value = operationSelected.description
    $('#amountNo').value = operationSelected.amount
    $('#typeSelect').value = operationSelected.type
    $('#inputCategories').value = operationSelected.category
    $('#inputDate').value = operationSelected.date
    $('#addEditButtonNo').setAttribute('data-id', operationId)
}

// Delete operation 

const showDeleteOperation = (operationId) => {
    remove(['#deleteWindow'])
    $('#deleteButtonNo').setAttribute('data-id', operationId)
    $('#deleteButtonNo').addEventListener('click', () => {
        const operationId = $('#deleteButtonNo').getAttribute('data-id')
        console.log(operationId)
        deleteDate(operationId)
    })
}

const deleteDate = (operationId) => {
    const currentData = getData('operations').filter(operation => operation.id != operationId)
    setData('operations', currentData)
    window.location.reload()
}
// Balance

const calculateBalance = (operationType) => {
    const currentData = getData("operations").filter(operation => operation.type === operationType)
    let acc = 0
    for (const operation of currentData) {
        acc += operation.amount
    }
    return acc
}

const calculateTotalBalance = () =>  calculateBalance("Ganancia") - calculateBalance("Gasto")

// Filters

const filterByType = () => {
    const value = $("#type").value
    if (value != "Todos") {
        const currentData = getData("operations").filter(operation => operation.type === value)
        iterateOperations(currentData)
    } else {
        iterateOperations(allOperation)
    }
}

const filterByCategory = () => {
    const value = $("#categories").value
    if (value != "Todas") {
        const currentData = getData("operations").filter(operation => operation.category === value)
        iterateOperations(currentData)
    } else {
        iterateOperations(allOperation)
    }
}

const filterByDate = () => {
    const value = $("#date").value
    console.log(value)
    const currentData = getData("operations").filter(operation => operation.date > value)
    iterateOperations(currentData)
}

// // Sort 


const sortBy = () => {
    const value = $("#sortBy").value
    if (value === "A/Z") {
        const operations = getData("operations")
        console.log(operations)
        const currentData = operations.sort(function (a, b) {
            if (a.description.toLowerCase() > b.description.toLowerCase()) {
                return 1;
            }
            if (a.description.toLowerCase() < b.description.toLowerCase()) {
                return -1;
            }
            return 0;
        })
        setData("operations", currentData)
        iterateOperations(currentData)
    } 
    if (value === "Z/A") {
        const operations = getData("operations")
        console.log(operations)
        const currentData = operations.sort(function (a, b) {
            if (a.description.toLowerCase() < b.description.toLowerCase()) {
                return 1;
            }
            if (a.description.toLowerCase() > b.description.toLowerCase()) {
                return -1;
            }
            return 0;
        })
        setData("operations", currentData)
        iterateOperations(currentData)
    }
    if (value === "Mayor monto") {
        const operations = getData("operations")
        console.log(operations)
        const currentData = operations.sort(function (a, b) {
            if (a.amount < b.amount) {
                return 1;
            }
            if (a.amount > b.amount) {
                return -1;
            }
            return 0;
        })
        setData("operations", currentData)
        iterateOperations(currentData)
    }
    if (value === "Menor monto") {
        const operations = getData("operations")
        console.log(operations)
        const currentData = operations.sort(function (a, b) {
            if (a.amount > b.amount) {
                return 1;
            }
            if (a.amount < b.amount) {
                return -1;
            }
            return 0;
        })
        setData("operations", currentData)
        iterateOperations(currentData)
    }
    if (value === "Más reciente") {
        const operations = getData("operations")
        console.log(operations)
        const currentData = operations.sort(function (a, b) {
            if (a.date < b.date) {
                return 1;
            }
            if (a.date > b.date) {
                return -1;
            }
            return 0;
        })
        setData("operations", currentData)
        iterateOperations(currentData)
    }
    if (value === "Menos reciente") {
        const operations = getData("operations")
        console.log(operations)
        const currentData = operations.sort(function (a, b) {
            if (a.date > b.date) {
                return 1;
            }
            if (a.date < b.date) {
                return -1;
            }
            return 0;
        })
        setData("operations", currentData)
        iterateOperations(currentData)
    }
}

// -------------------- CATEGORIES FUNCTIONS --------------------//

// New categories 

const createCategory = () => {
    return {
        id: randomId(),
        name: $('#categoriesInput').value,
    }
}

const addCategory = () => {
    const currentData = getData("categories")
    currentData.push(createCategory())
    setData("categories", currentData)
    renderCategories(currentData)
    renderCategoriesOptions(currentData)
    renderInputCategoriesOptions(currentData)
    $("#categoriesInput").reset() 
}

// Edit Categories

const modifyCategory = (categoryId) => {
    return {
        id: categoryId,
        name: $('#editCategoryName').value,
    }
}

const showEditCategory = (categoryID) => {
    showScreens("EditCategory")
    $(".edit-category").setAttribute("data-id" , categoryID)
    const categoryToEdit = getData("categories").find(category => category.id === categoryID)
    $("#editCategoryName").value = categoryToEdit.name
}

const editCategory = () => {
    const categoryId = $(".edit-category").getAttribute("data-id")
    const currentData = getData("categories").map(category => {
        if (category.id === categoryId) {
            return modifyCategory(categoryId)
        }
        return category
    })
    setData("categories", currentData)
    renderCategories(currentData)
    renderCategoriesOptions(currentData)
    renderInputCategoriesOptions(currentData)
}

//Delete category

const deleteCategory = (categoryId) => {
    const currentData = getData("categories").filter(category => category.id != categoryId)
    setData("categories", currentData)
    return currentData
}

const confirmDeleteCategory = (categoryId) => {
    const currentData = getData("operations").filter(operation => operation.category != categoryId)
    setData("operations", currentData)
    renderCategories(deleteCategory(categoryId))
    renderCategoriesOptions(deleteCategory(categoryId))
    renderInputCategoriesOptions(deleteCategory(categoryId))
}

// -------------------- ******EVENTS ******--------------------//

const initialize = () => {

    //----------------- LOCAL STORAGE -----------------//

    setData('operations', allOperation)
    setData('categories', allCategories)

    iterateOperations(allOperation)
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    renderInputCategoriesOptions(allCategories)

    $("#incomeBalance").innerHTML = `+$${calculateBalance("Ganancia")}`

    $("#expensesBalance").innerHTML = `-$${calculateBalance("Gasto")}`

    $("#totalBalance").innerHTML = `$${calculateTotalBalance()}`

    //----------------- LOGO EVENTS-----------------//

    $('#homeButton').addEventListener('click', () => {
        showScreens("Balance")
        window.location.reload()
    }) 

    //----------------- MENU EVENTS-----------------//


    $('#burger-btn').addEventListener('click', () => {
        $('#burgerMenu').classList.toggle('hidden');
    });

    $('#showBalance').addEventListener('click', () => {
        showScreens("Balance")
        window.location.reload()
    }) 

    $('#showCategories').addEventListener('click', () => {
        showScreens("Categories")
    }) 

    $('#showReports').addEventListener('click', () => {
        showScreens("Reports")
    })

    //-----------------BURGER MENU EVENTS-----------------//


    $('#show-Balance').addEventListener('click', () => {
        showScreens("Balance")
        window.location.reload()
    }) 

    $('#show-Categories').addEventListener('click', () => {
        showScreens("Categories")
    }) 

    $('#show-Reports').addEventListener('click', () => {
        showScreens("Reports")
    })


    //-----------------OPERATIONS SCREEN EVENTS-----------------//


    $('#btnNewOperation').addEventListener('click', () => {
        showScreens('NewOperation')
    })

    // cancelar nueva operacion
    $('#cancelButtonNo').addEventListener('click', () => {
        remove(['.balance-screen'])
        add(['.new-operarion-screen'])
    })

    // ocultar filtros
    $('#hiddenFilters').addEventListener('click', () => {
        $('.section-filters').style.height = '20vh'
        add(['.filters', '#hiddenFilters'])
        remove(['#haddenFilters'])
    })
    // mostrar filtros
    $('#haddenFilters').addEventListener('click', () => {
        $('.section-filters').style.height = '57vh'
        remove(['.filters', '#hiddenFilters'])
        add(['#haddenFilters'])
    })


    $('#addButtonNo').addEventListener('click', (e) => {
        e.preventDefault()
        addOperation()
        window.location.reload()
    })

    // editar operacion
    $('#addEditButtonNo').addEventListener('click', () => {
        const operationId = $('#addEditButtonNo').getAttribute('data-id')
        // hacemos un map que nos trae un array modificado
        const currentData = getData('operations').map(operation => {
            // operation.id es el id de la operacion que estoy recorriendo, opId es el id del atributo del boton
            if (operation.id === operationId) {
                return infoForm()
            }
            return operation
        })
        // le pasamos al localStorage el array modificado
        setData('operations', currentData)
        window.location.reload()
    })

    $("#type").addEventListener("click" , () => {
        filterByType()
    })

    $("#categories").addEventListener("click" , () => {
        filterByCategory()
    })

    $("#date").addEventListener("change" , () => {
        filterByDate()
    })

    $("#sortBy").addEventListener("change" , () => {
        sortBy()
    })

    //-----------------CATEGORIES SCREEN EVENTS-----------------//

    //---- Add category -----//

    $("#addCategoryButton").addEventListener('click' , (e) => {
        e.preventDefault()
        addCategory()
        showScreens("Categories")
    })

    //---- Edit category -----//

    $("#editCategoryButton").addEventListener('click' , (e) => {
        e.preventDefault()
        editCategory()
        showScreens("Categories")
        
    })

    $('#cancelButton').addEventListener('click', () => {
        showScreens("Categories")
    })
}

window.addEventListener('load', initialize())






// funcion para obtener categorias y montos de operaciones almacenadas en el localStorage
const getCategoriesAndAmounts = () => {
    const updatedtData = getData('operations') || [];
    const result = {};

    for (const operation of updatedtData) {
        const { category, amount } = operation;

        // parseFloat : se utiliza para parsear una cadena de texto y convertirla a un número de punto flotante.Si la cadena contiene caracteres que no forman parte de un número válido, parseFloat detendrá el análisis y devolverá el valor numérico hasta ese punto
        if (category in result) {
            result[category] += parseFloat(amount);
        } else {
            result[category] = parseFloat(amount);
        }
    }
    return result;
};


//si hay mas de dos elementos (operaciones) en el localStorage me devuelve true, si no , false. si hay mas de dos operaciones recien ahi se va aejecutar getCategoryWithMaxProfit
const greaterThanTwoOperations = () => {
    return (getData('operations') || []).length > 2;
};


// CATEGORIA CON MAYOR GANANCIA
const getCategoryMax = () => {
    if (!greaterThanTwoOperations()) return null;

    // reutilizo la funcion getCategoriesAndAmounts() que me trae la categoria y el monto
    const categoriesAndAmounts = getCategoriesAndAmounts();
    console.log(categoriesAndAmounts)

    let seniorCategory = null
    let seniorAmount = 0;

    for (const category in categoriesAndAmounts) {
        // guardamos en una constante los montos obtenidos del localStorage
        const localAmounts = categoriesAndAmounts[category];
        console.log(localAmounts)

        if (localAmounts > seniorAmount) {
            seniorAmount = localAmounts, seniorCategory = category;
        }
    }

    return {
        category: seniorCategory ? getData("categories").find(cat => cat.id === seniorCategory)?.name : null,
        amount: seniorAmount
    };
};


const categoryMajorProfit = getCategoryMax();


if (categoryMajorProfit) {
    $('#tagCategory').textContent = `${categoryMajorProfit.category}`;
    $('#amountCategory').textContent = `$+ ${categoryMajorProfit.amount}`;
} else {
    console.log("No hay suficientes operaciones para calcular la categoria con mayor ganancia.");
}




// Obtener categorías y montos de gasto
const getCategoriesAndExpenseAmounts = () => {
    const operations = getData('operations') || [];
    const result = {};

    for (const operation of operations) {
        const { category, amount, type } = operation;

        if (type === "Gasto") {
            if (category in result) {
                result[category] += amount;
            } else {
                result[category] = amount;
            }
        }
    }

    return result;
};

// CATEGORIA CON MAYOR GASTO
const getCategoryMaxExpense = () => {
    if (!greaterThanTwoOperations()) return null;

    const categoriesAndAmounts = getCategoriesAndExpenseAmounts();

    let maxExpenseCategory = null;
    let maxExpenseAmount = 0;

    for (const category in categoriesAndAmounts) {
        const localAmount = categoriesAndAmounts[category];

        if (localAmount > maxExpenseAmount) {
            maxExpenseAmount = localAmount;
            maxExpenseCategory = category;
        }
    }

    return {
        category: maxExpenseCategory ? getData("categories").find(cat => cat.id === maxExpenseCategory)?.name : null,
        amount: maxExpenseAmount
    };
};

const categoryMaxExpense = getCategoryMaxExpense();

console.log("Categoría con mayor gasto:", categoryMaxExpense.category);
console.log("Monto de gasto:", categoryMaxExpense.amount);
$('#expenseCategory').textContent = `${categoryMaxExpense.category}`;
$('#quantityMinorCategory').textContent = `$- ${categoryMaxExpense.amount}`;


//  CATEGORIA CON MAYOR BALANCE


// Obtener categorías y montos totales (considerando ganancias y gastos)
const getCategoriesAndTotalAmounts = () => {
    const operations = getData('operations') || [];
    const result = {};

    for (const operation of operations) {
        const { category, amount, type } = operation;

        if (category in result) {
            result[category] += (type === 'Ganancia' ? amount : -amount);
        } else {
            result[category] = (type === 'Ganancia' ? amount : -amount);
        }
    }

    return result;
};

// CATEGORIA CON MAYOR BALANCE
const getCategoryMaxBalance = () => {
    if (!greaterThanTwoOperations()) return null;

    const categoriesAndAmounts = getCategoriesAndTotalAmounts();

    let maxBalanceCategory = null;
    let maxBalanceAmount = 0;

    for (const category in categoriesAndAmounts) {
        const localAmount = categoriesAndAmounts[category];

        if (localAmount > maxBalanceAmount) {
            maxBalanceAmount = localAmount;
            maxBalanceCategory = category;
        }
    }

    return {
        category: maxBalanceCategory ? getData("categories").find(cat => cat.id === maxBalanceCategory)?.name : null,
        amount: maxBalanceAmount
    };
};

const categoryMaxBalance = getCategoryMaxBalance();

console.log("Categoría con mayor balance:", categoryMaxBalance.category);
console.log("Monto de balance:", categoryMaxBalance.amount);
$('#balanceCategory').textContent = `${categoryMaxBalance.category}`;
$('#balanceAmount').textContent = `$ ${categoryMaxBalance.amount}`;




// MES CION MAYOR GANANCIA

// funcion que me trae las fechas y monto
const getDatesAndAmounts = (operationType) => {
    const operations = getData('operations') || [];
    const result = {};

    for (const operation of operations) {
        const { date, amount, type } = operation;

        if (type === operationType) {
            if (date in result) {
                result[date] += amount;
            } else {
                result[date] = amount;
                
            }
        }
    }
    return result;
};


// Obtener el mes con mayor ganancia
const getMonthMaxProfit = () => {
    const datesAndAmounts = getDatesAndAmounts('Ganancia');

    let maxProfitMonth = null;
    let maxProfitAmount = 0;

    for (const date in datesAndAmounts) {
        const localAmount = datesAndAmounts[date];

        // de numero (12) lo convertimos al nombre del mes en español (diciembre)
        const month = new Date(date).toLocaleString('es-ES', { month: 'long' });


        if (localAmount > maxProfitAmount) {
            maxProfitAmount = localAmount;
            maxProfitMonth = month;
        }
    }

    return {
        month: maxProfitMonth,
        amount: maxProfitAmount
    };
};

const monthMaxProfit = getMonthMaxProfit();

console.log("Mes con mayor ganancia:", monthMaxProfit.month);
console.log("Monto de ganancia:", monthMaxProfit.amount);
$('#monthCategoryProfit').textContent = `${monthMaxProfit.month}`;
$('#monthAmountProfit').textContent = `${monthMaxProfit.amount}`;



// CATEGORIA CON MAYOR GASTO 
// Obtener fecha con mayor gasto
const getDateWithMaxExpense = () => {
    const datesAndAmounts = getDatesAndAmounts("Gasto");

    let maxExpenseDate = null;
    let maxExpenseAmount = 0;

    for (const date in datesAndAmounts) {
        const localAmount = datesAndAmounts[date];

        const month = new Date(date).toLocaleString('es-ES', { month: 'long' });

        if (localAmount > maxExpenseAmount) {
            maxExpenseAmount = localAmount;
            maxExpenseDate = month;
        }
    }

    return {
        date: maxExpenseDate,
        amount: maxExpenseAmount
    };
};

const dateWithMaxExpense = getDateWithMaxExpense();

console.log("Fecha con mayor gasto:", dateWithMaxExpense.date);
console.log("Monto de gasto:", dateWithMaxExpense.amount);
$('#monthCategoryExpense').textContent = `${dateWithMaxExpense.date}`;
$('#monthAmountExpense').textContent = `${dateWithMaxExpense.amount}`;





// TOTALES POR CATEGORIA 

const getTotalsByCategory = () => {
    const operations = getData('operations') || [];
    const totals = {};

    // Obtener las primeras 4 operaciones
    const firstFourOperations = operations.slice(0, 4);

    for (const operation of firstFourOperations) {
        const { category, amount, type } = operation;
        const categoryName = getData("categories").find(cat => cat.id === category)?.name;

        if (categoryName in totals) {
            if (type === 'Ganancia') {
                totals[categoryName].income += amount;
            } else if (type === 'Gasto') {
                totals[categoryName].expense += amount;
            }
        } else {
            totals[categoryName] = {
                income: type === 'Ganancia' ? amount : 0,
                expense: type === 'Gasto' ? amount : 0
            };
        }
    }

    return totals;
};


const renderTotalsTable = () => {
    const totalsByCategory = getTotalsByCategory();
    const tableBody = $('#monthSummaryTable tbody');

    // Limpiar el cuerpo de la tabla antes de renderizar los nuevos datos
    tableBody.innerHTML = '';

    for (const category in totalsByCategory) {
        const { income, expense } = totalsByCategory[category];
        const balance = income - expense;

        // Crear una fila por cada categoría
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="pr-2">${category}</td>
            <td class="pr-2">${income}</td>
            <td class="pr-2">${expense}</td>
            <td class="pr-2">${balance}</td>
        `;

        // Agregar la fila al cuerpo de la tabla
        tableBody.appendChild(row);
    }
};

// Llamar a la función para renderizar la tabla
renderTotalsTable();
