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
    $("#addCategoryButton").setAttribute("disabled" , true)
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
    $("#editCategoryButton").setAttribute("disabled" , true)
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

    const validationsPassed = description!== "" && amount && date

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
            if (!date) {
                remove(["#errorDate"])
                $("#inputDate").classList.add("required:border-red-500")
            } else {
                add(["#errorDate"])
                $("#inputDate").classList.remove("required:border-red-500")
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
        $("#addEditButtonNo").setAttribute("disabled" , true)
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

//---- Message no operations -----//

const messageWithoutOperations = () => {
    const updatedData = getData('operations') || [];

    console.log(updatedData);

    if (updatedData.length > 0) {
        remove(['.message-not-operation',]);
    } else {
        add(['.message-not-operation',]);
    }
}



const messageWithoutOperationsReports = () => {
    const updatedData = getData('operations') || [];

    if (updatedData.length <= 2) {
        remove(['#noReports']);
        add(['#withReports', '#summary']);
    }
};

window.addEventListener('load', () => {
    initialize();
    messageWithoutOperationsReports();
});


// -------------------- REPORTS FUNCTIONS --------------------/////



const getCategoriesAndAmounts = () => {
    const updatedtData = getData('operations') || [];
    const result = {};

    for (const operation of updatedtData) {
        const { category, amount } = operation;


        if (category in result) {
            result[category] += parseFloat(amount);
        } else {
            result[category] = parseFloat(amount);
        }
    }
    return result;
};



const greaterThanTwoOperations = () => {
    return (getData('operations') || []).length > 2;
};



//---- CATEGORY WITH THE HIGHEST PROFIT -----//

const getCategoryMax = () => {
    if (!greaterThanTwoOperations()) return null;
    const categoriesAndAmounts = getCategoriesAndAmounts();

    let seniorCategory = null
    let seniorAmount = 0;

    for (const category in categoriesAndAmounts) {
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
}



//---- CATEGORY WITH HIGHEST EXPENSES-----//

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

if (categoryMaxExpense && categoryMaxExpense.category) {
    $('#expenseCategory').textContent = `${categoryMaxExpense.category}`;
    $('#quantityMinorCategory').textContent = `-$ ${categoryMaxExpense.amount}`;
}




//---- CATEGORY WITH HIGHEST BALANCE-----//

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

if (categoryMaxBalance && categoryMaxBalance.category) {
    $('#balanceCategory').textContent = `${categoryMaxBalance.category}`;
    $('#balanceAmount').textContent = `+$ ${categoryMaxBalance.amount}`;
}



//---- MONTH WITH HIGHEST PROFIT-----//

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


const getMonthMaxProfit = () => {
    const datesAndAmounts = getDatesAndAmounts('Ganancia');

    let maxProfitMonth = null;
    let maxProfitAmount = 0;

    for (const date in datesAndAmounts) {
        const localAmount = datesAndAmounts[date];

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

$('#monthCategoryProfit').textContent = `${monthMaxProfit.month}`;
$('#monthAmountProfit').textContent = `+$ ${monthMaxProfit.amount}`;




//---- MONTH WITH HIGHEST EXPENSE -----//

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

$('#monthCategoryExpense').textContent = `${dateWithMaxExpense.date}`;
$('#monthAmountExpense').textContent = `-$ ${dateWithMaxExpense.amount}`;





//---- TOTALS BY CATEGORY-----//

const getTotalsByCategory = () => {
    const operations = getData('operations') || [];
    const totals = {};

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
}


//----------------- LIGHT/DARK MODE -----------------//

const darkMode = () => {
    $('.dark-body').classList.add('dark-mode');
    $('.dark-header').classList.add('dark-mode');
    $('.dark-balance').classList.add('dark-mode');
    $('.section-filters').classList.add('dark-mode')
    $('.section-operation').classList.add('dark-mode')
    $('.new-operation-screen').classList.add('dark-mode')
    $('.reports').classList.add('dark-mode')
    $('#containerEditCategory').classList.add('dark-mode')
    $('.category').classList.add('dark-mode');
    $('.edit-categorie').classList.add('dark-mode');

    $('#sunIcon').classList.remove('yellow-icon');
    $('#moonIcon').classList.add('yellow-icon');
}
const moonIcon = $('#moonIcon')
moonIcon.addEventListener('click', darkMode);

const lightMode = () => {

    $('.dark-body').classList.remove('dark-mode');
    $('.dark-header').classList.remove('dark-mode');
    
    $('#sunIcon').classList.add('yellow-icon');
    $('#moonIcon').classList.remove('yellow-icon');
}

const sunIcon = $('#sunIcon')
sunIcon.addEventListener('click', lightMode);


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
        remove(["#addButtonNo"])
        add(["#addEditButtonNo"])
    })

    // cancelar nueva operacion
    $('#cancelButtonNo').addEventListener('click', () => {
        showScreens("Balance")
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


    $('#addButtonNo').addEventListener('click', () => {
        addOperation()
        showScreens("Balance")
    })

    // editar operacion
    $('#addEditButtonNo').addEventListener('click', () => {
        editOperation()
        showScreens("Balance")
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

    //Operations

    $("#descriptionNo").addEventListener("input" , () => {
        validateOperationsForm("description")
    })
    $("#amountNo").addEventListener("blur" , () => {
        validateOperationsForm("amount")
    })
    $("#inputDate").addEventListener("input" , () => {
        validateOperationsForm("date")
    })

    // Categories
    $("#categoriesInput").addEventListener("input" , () => {
        validateCategoriesForm("#categoriesInput" , "#errorNewCategory" , "#addCategoryButton")
    })
    $("#editCategoryName").addEventListener("input" , () => {
        validateCategoriesForm("#editCategoryName" , "#errorEditCategory" , "#editCategoryButton")
    })   
}

window.addEventListener('load', initialize())