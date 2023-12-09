const $ = (selector) => document.querySelector(selector)

// FUNCIONALIDAD DE BOTONES

// menu hamburguesa
$('#burger-btn').addEventListener('click', () => {
    $('#burger-menu').classList.toggle('hidden');
});

//nueva operacion
$('#btnNewOperation').addEventListener('click', () => {
    $('.balance-screen').classList.add('hidden')
    $('.new-operarion-screen').classList.toggle('hidden')
})

$('#cancelButtonNo').addEventListener('click', () => {
    $('.balance-screen').classList.toggle('hidden')
    $('.new-operarion-screen').classList.toggle('hidden')
})

// ocultar filtros
$('#hiddenFilters').addEventListener('click', () => {
    $('.section-filters').style.height = '20vh'
    $('.filters').classList.toggle('hidden')
    $('#hiddenFilters').classList.toggle('hidden')
    $('#haddenFilters').classList.toggle('hidden')
})
 // mostrar filtros
$('#haddenFilters').addEventListener('click', () => {
    $('.section-filters').style.height = '63vh'
    $('.filters').classList.toggle('hidden')
    $('#hiddenFilters').classList.toggle('hidden')
    $('#haddenFilters').classList.toggle('hidden')
})