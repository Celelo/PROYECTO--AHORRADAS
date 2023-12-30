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

// Default setters

const allOperation = getData('operations') || []

const allCategories = getData("categories") || defaultCategories

const askForData = () => {
    getData()

}

// -------------------- RENDERS --------------------//

// Operations 

const iterateOperations = (operations) => {
    
    for (const operation of operations) {
        cleanContainer('#tableOperations')
        const categorySelected = getData("categories").find(category => category.id === operation.category)
        $('#tableOperations').innerHTML += `
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
    for (const category of categories) {
        $("#categories").innerHTML += `
            <option value= "${category.id}">${category.name}</option>
        `
    }
}

const renderInputCategoriesOptions = (categories) => {
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
        amount: $('#amountNo').value,
        type: $('#typeSelect').value,
        category: $('#categories').value,
        date: $('#inputDate').value
    };
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
    $('#categories').value = operationSelected.category
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

// -------------------- CATEGORIES FUNCTIONS --------------------//

//Default

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
    renderCategories(deleteCategory(categoryId))
    const currentData = getData("operations").filter(operation => operation.category != categoryId)
    setData("operations", currentData)
    renderCategoriesOptions(deleteCategory(categoryId))
    renderInputCategoriesOptions((categoryId))
}

// -------------------- EVENTS --------------------//

const initialize = () => {
    
    //----------------- LOCAL STORAGE -----------------//

    setData('operations', allOperation)
    setData('categories', allCategories)

    iterateOperations(allOperation)
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    renderInputCategoriesOptions(allCategories)

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
        $('.section-filters').style.height = '63vh'
        remove(['.filters', '#hiddenFilters'])
        add(['#haddenFilters'])
    })


    $('#addButtonNo').addEventListener('click', () => {
        // guardamos los valores de los inputs en una costante
        // const newOperation = saveOperationInfo()
        // setData('operations', newOperation)

        // pasos antes de iterar rn psntalla:
        //1. te volves a traer la info actualizada del local (se vuelve en formato array por que getData lo pasea)
        const updatedtData = getData('operations')
        // 2. pusheas la funcion saveOperationInfo() que tiene todos los values del formulario
        updatedtData.push(infoForm())
        // 3. ahora ya modificado ahora si se puede mandar a setData el cual lo introduce al localStorage
        setData('operations', updatedtData) // haciendo estos pasos metimos al objeto adentro de un array para poder ser iterado
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