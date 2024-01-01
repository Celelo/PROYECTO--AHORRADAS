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

    showBalance(allOperation)

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
}

window.addEventListener('load', initialize())