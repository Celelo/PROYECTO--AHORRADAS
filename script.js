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

const operations = () => getData("operations")
const categories = () => getData("categories")

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

// Date

const setDate = () => {
    const dateInputs = $$("input[type='date']")
    for (const date of dateInputs) {
        date.valueAsDate = new Date()
    }
}

const today = () => {
    setDate()
    return $("#inputDate").valueAsDate
}
// -------------------- RENDERS --------------------//

// Operations 

const iterateOperations = (operations) => {
    cleanContainer('#tableOperations')
    if (operations.length) {
        add(["#noOperations"])
        remove(["#haveOperations"])
        for (const operation of operations) {
            const categorySelected = getData("categories").find(category => category.id === operation.category)
            if (operation.type === "Ganancia" ) {
                $("#tableOperations").innerHTML += `
                <tr class="border-b">
                            <td class="p-4">${operation.description}</td>
                            <td class="mt-6 ml-5 py-1 px-2 inline-block bg-[#886a8e]  rounded-full">${categorySelected.name}</td>
                            <td class="p-2">${operation.date}</td>
                            <td class="p-2"><span class ="bg-green-700 rounded-full text-white p-1 px-2">+$${operation.amount}</span></td>
                            <td class="p-2 flex flex-col space-y-2">
                                <button class="edit-category bg-green-700 hover:bg-green-500 border-white rounded-[25%] w-[30%] self-center" onclick= "showFormEdit('${operation.id}')"><i class="fa-solid fa-pen-to-square p-1.5"></i></button>
                                <button class="delete-category text-white h bg-red-700 hover:bg-red-500 border-white rounded-[25%] w-[30%] self-center" onclick= "showDeleteOperation('${operation.id}')"><i class="fa-solid fa-trash-can p-1.5"></i></button>
                            </td>
                        </tr>
                `
            } else {
                $("#tableOperations").innerHTML += `
                <tr class="border-b">
                            <td class="p-4">${operation.description}</td>
                            <td class="mt-6 ml-5 py-1 px-2 inline-block bg-[#886a8e]  rounded-full">${categorySelected.name}</td>
                            <td class="p-2">${operation.date}</td>
                            <td class="p-2 text-red-900"><span class ="bg-red-700 rounded-full text-white p-1 px-2">-$${operation.amount}</span></td>
                            <td class="p-2 flex flex-col space-y-2">
                                <button class="edit-category bg-green-700 hover:bg-green-500 border-white rounded-[25%] w-[30%] self-center" onclick= "showFormEdit('${operation.id}')"><i class="fa-solid fa-pen-to-square p-1.5"></i></button>
                                <button class="delete-category text-white h bg-red-700 hover:bg-red-900 border-white rounded-[25%] w-[30%] self-center" onclick= "showDeleteOperation('${operation.id}')"><i class="fa-solid fa-trash-can p-1.5"></i></button>
                            </td>
                        </tr>
                `
            }
        } 
    } else {
        add(["#haveOperations"])
        remove(["#noOperations"])
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
    const operations = operations();
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
    const currentData = operations()
    currentData.push(infoForm())
    setData("operations", currentData)
    iterateOperations(currentData)
    showBalance(currentData)
    $(("#operationInfo")).reset()
}

// Edit operation 

const editOperation = () => {
    const operationId = $('#addEditButtonNo').getAttribute('data-id')
        const currentData = getData('operations').map(operation => {
            if (operation.id === operationId) {
                return infoForm()
            }
            return operation
        })
        setData('operations', currentData)
        iterateOperations(currentData)
}

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
    remove(['#containerDeleteWindow'])
    $('#deleteButtonNo').setAttribute('data-id', operationId)
    $('#deleteButtonNo').addEventListener('click', () => {
        const operationId = $('#deleteButtonNo').getAttribute('data-id')
        deleteDate(operationId)
    })
}

const deleteDate = (operationId) => {
    const currentData = getData('operations').filter(operation => operation.id != operationId)
    setData('operations', currentData)
    window.location.reload()
}
// Balance

const calculateBalance = (operationType , operations) => {
    const currentData = operations.filter(operation => operation.type === operationType)
    let acc = 0
    for (const operation of currentData) {
        acc += operation.amount
    }
    return acc
}

const calculateTotalBalance = (operations) =>  calculateBalance("Ganancia" , operations) - calculateBalance("Gasto" , operations)

const showBalance = (operations) => {
    $("#incomeBalance").innerHTML = `+$${calculateBalance("Ganancia" , operations)}`
    $("#expensesBalance").innerHTML = `-$${calculateBalance("Gasto" , operations)}`
    $("#totalBalance").innerHTML = `$${calculateTotalBalance(operations)}`
}

// Filters

const filterByType = (type , array) => array.filter((operation) => operation.type === type)

const filterByCategory = (category , array) => array.filter((operation) => operation.category === category)

const filterByDate = (date , array) => array.filter((operation) => operation.date >= date)

// Sort 


const sortBy = (value , array) => {
    if (value === "A/Z") {
        const sortedData = array.sort(function (a, b) {
            if (a.description.toLowerCase() > b.description.toLowerCase()) {
                return 1;
            }
            if (a.description.toLowerCase() < b.description.toLowerCase()) {
                return -1;
            }
            return 0;
        })
        return sortedData
    } 
    if (value === "Z/A") {
        const sortedData = array.sort(function (a, b) {
            if (a.description.toLowerCase() < b.description.toLowerCase()) {
                return 1;
            }
            if (a.description.toLowerCase() > b.description.toLowerCase()) {
                return -1;
            }
            return 0;
        })
        return sortedData
    }
    if (value === "Mayor monto") {
        const sortedData = array.sort(function (a, b) {
            if (a.amount < b.amount) {
                return 1;
            }
            if (a.amount > b.amount) {
                return -1;
            }
            return 0;
        })
        return sortedData
    }
    if (value === "Menor monto") {
        const sortedData = array.sort(function (a, b) {
            if (a.amount > b.amount) {
                return 1;
            }
            if (a.amount < b.amount) {
                return -1;
            }
            return 0;
        })
        return sortedData
    }
    if (value === "Más reciente") {
        const sortedData = array.sort(function (a, b) {
            if (a.date < b.date) {
                return 1;
            }
            if (a.date > b.date) {
                return -1;
            }
            return 0;
        })
        return sortedData
    }
    if (value === "Menos reciente") {
        const sortedData = array.sort(function (a, b) {
            if (a.date > b.date) {
                return 1;
            }
            if (a.date < b.date) {
                return -1;
            }
            return 0;
        })
        return sortedData
    }
}

//Applying filters

const applyFilters = () => {
    const type = $("#type").value
    const category = `${$("#categories").value}`
    const date = $("#date").value
    const value = $("#sortBy").value

    let currentData = getData("operations")

    if (type !== "Todos") {
        currentData = filterByType(type , currentData)
    } 
    
    if (category !== "Todas") {
        currentData = filterByCategory(category , currentData)
    }

    currentData = filterByDate(date , currentData)

    currentData = sortBy(value , currentData)
    
    iterateOperations(currentData)
    
    showBalance(currentData)
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
    const currentData = categories()
    currentData.push(createCategory())
    setData("categories", currentData)
    renderCategories(currentData)
    renderCategoriesOptions(currentData)
    renderInputCategoriesOptions(currentData)
    $("#categoriesInputForm").reset() 
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

const validateOperationsForm = (field) => {
    const description = $("#descriptionNo").value.trim()
    const amount = $("#amountNo").valueAsNumber
    const date = $("#inputDate").valueAsDate

    const validationsPassed = description!== "" && amount && date < today()

    switch (field) {
        case "description":
            if (description === "") {
                remove(["#errorDescription"])
                $("#descriptionNo").classList.add("invalid:border-red-500")
            } else {
                add(["#errorDescription"])
                $("#descriptionNo").classList.remove("invalid:border-red-500")
            }
            break
        case "amount":
            if (!amount) {
                remove(["#errorAmount"])
                $("#amountNo").classList.add("invalid:border-red-500")
            } else {
                add(["#errorAmount"])
                $("#amountNo").classList.remove("invalid:border-red-500")
            }
            break
        case "date":
            if (date > today()) {
                remove(["#errorDate"])
                $("#inputDate").classList.add("invalid:border-red-500")
            } else {
                add(["#errorDate"])
                $("#inputDate").classList.remove("invalid:border-red-500")
            }
            break
        default: 
            alert("Error")
    }

    if (validationsPassed) {
        $("#addButtonNo").removeAttribute("disabled")
        $("#addEditButtonNo").removeAttribute("disabled")
    } else {
        $("#addButtonNo").setAttribute("disabled" , true)
    }
}



const validateCategoriesForm = (input , message , button) => {
    const description = $(input).value.trim()

    const validationsPassed = description !== "" 

    if (description === "") {
        remove([message])
    } else {
        add([message])
        
    }

    if (validationsPassed) {
        $(button).removeAttribute("disabled")
    } else {
        $(button).setAttribute("disabled" , true)
    }
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

    showBalance(allOperation)
    setDate()

    //----------------- LOGO EVENTS-----------------//

    $('#homeButton').addEventListener('click', () => {
        showScreens("Balance")
    }) 

    //----------------- MENU EVENTS-----------------//


    $('#burger-btn').addEventListener('click', () => {
        $('#burgerMenu').classList.toggle('hidden');
    });
    $('#showBalance').addEventListener('click', () => {
        showScreens("Balance")
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
        showScreens("Balance")
        $(("#operationInfo")).reset()
    })

    $('#cancelDeleteOperation').addEventListener('click', () => {
        showScreens("Balance")
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
        showScreens("Balance")
        $(("#operationInfo")).reset()
    })

    // editar operacion
    $('#addEditButtonNo').addEventListener('click', (e) => {
        e.preventDefault()
        editOperation()
        showScreens("Balance")
        $(("#operationInfo")).reset()
    })

    //Filters

    $("#type").addEventListener("change" , () => {
        applyFilters()
    })
    $("#categories").addEventListener("change" , () => {
        applyFilters()
    })
    $("#date").addEventListener("change" , () => {
        applyFilters()
    })
    $("#sortBy").addEventListener("change" , () => {
        applyFilters()
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
    
    //---- Validation Events -----//

    $("#descriptionNo").addEventListener("blur" , () => {
        validateOperationsForm("description")
    })
    $("#amountNo").addEventListener("blur" , () => {
        validateOperationsForm("amount")
    })
    $("#inputDate").addEventListener("click" , () => {
        validateOperationsForm("date")
    })
    $("#categoriesInput").addEventListener("input" , () => {
        validateCategoriesForm("#categoriesInput" , "#errorNewCategory" , "#addCategoryButton")
    })
    $("#editCategoryName").addEventListener("input" , () => {
        validateCategoriesForm("#editCategoryName" , "#errorEditCategory" , "#editCategoryButton")
    })
    
}

window.addEventListener('load', initialize())


// mostar mensaje cuando no hay operaciones
const messageWithoutOperations = () => {
    const updatedData = getData('operations') || [];

    console.log(updatedData);

    if (updatedData.length > 0) {
        add(['.message-not-operation','#noReports'])
    } else {
        remove(['.message-not-operation','#withReports'])
    }
};




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
    $('#amountCategory').textContent = `+$ ${categoryMajorProfit.amount}`;
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

if (categoryMajorProfit && categoryMajorProfit.category) {
    $('#tagCategory').textContent = `${categoryMajorProfit.category}`;
    $('#amountCategory').textContent = `+$ ${categoryMajorProfit.amount}`;
} else {
    console.log("No hay suficientes operaciones para calcular la categoria con mayor ganancia.");
}


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

if (categoryMajorProfit && categoryMajorProfit.category) {
    $('#tagCategory').textContent = `${categoryMajorProfit.category}`;
    $('#amountCategory').textContent = `+$ ${categoryMajorProfit.amount}`;
} else {
    console.log("No hay suficientes operaciones para calcular la categoría con mayor ganancia.");
}





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
$('#monthAmountProfit').textContent = `+$ ${monthMaxProfit.amount}`;



// mes CON MAYOR GASTO 

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
$('#monthAmountExpense').textContent = `-$ ${dateWithMaxExpense.amount}`;





// TOTALES POR CATEGORIA 

const getTotalsByCategory = () => {
    const operations = getData('operations') || [];
    const totals = {};

    // Obtener las primeras 4 operaciones y pintarlas en pantalla
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
    const tableBody = $('#totalsByCategorie');

    for (const category in totalsByCategory) {
        const { income, expense } = totalsByCategory[category];
        const balance = income - expense;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="pr-2 border-b">${category}</td>
            <td class="pr-2 border-b text-green-400">+$ ${income}</td>
            <td class="pr-2 border-b text-red-600">-$ ${expense}</td>
            <td class="pr-2 border-b">$ ${balance}</td>
        `;

        tableBody.appendChild(row);
    }
};

renderTotalsTable();


// TOTALES POR MES 

const getTotalsByMonth = () => {
    const operations = getData('operations') || [];
    const totals = {};

    for (const operation of operations) {
        const { date, amount, type } = operation;

        const month = new Date(date).toLocaleString('es-ES', { month: 'long' });

        if (month in totals) {
            if (type === 'Ganancia') {
                totals[month].income += amount;
            } else if (type === 'Gasto') {
                totals[month].expense += amount;
            }
        } else {
            totals[month] = {
                income: type === 'Ganancia' ? amount : 0,
                expense: type === 'Gasto' ? amount : 0
            };
        }

        // Calcular el balance y almacenarlo
        totals[month].balance = totals[month].income - totals[month].expense;
    }

    return totals;
};


//renderizamos
const renderMonthTotalsTable = () => {
    const monthTotals = getTotalsByMonth();

    const tableBody = $('#monthTotals');

    Object.keys(monthTotals).forEach(month => {
        const monthRow = document.createElement('tr');
        monthRow.innerHTML = `
            <td class="pr-36 border-b">${month}</td>
            <td class="pr-36 border-b text-green-400">+$ ${monthTotals[month].income}</td>
            <td class="pr-32 border-b text-red-600">-$ ${monthTotals[month].expense}</td>
            <td class="pr-2 border-b">$ ${monthTotals[month].balance}</td>
        `;

        tableBody.appendChild(monthRow);
    });
};

renderMonthTotalsTable();

