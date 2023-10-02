// FUNCIONES REUTILIZABLES
const just = (selector) => document.querySelector(selector);
const all = (selector) => document.querySelectorAll(selector);
const randomId = () => self.crypto.randomUUID();

//MOSTRAR Y OCULTAR VISTAS DEL NAVBAR  ---FUNCIONA ✓---
const mostrarVista = (vistaparametro) => {
  all(".screen").forEach((view) => {
    view.classList.add("is-hidden");
  });
  just(`.${vistaparametro}`).classList.remove("is-hidden");
};
just(".btn-balance-navbar").addEventListener("click", () =>
  mostrarVista("main-balance")
); //se muestra vista balance
just(".btn-categories-navbar").addEventListener("click", () =>
  mostrarVista("section-view-categories")
); //se muestra vista categorias
just(".btn-reports-navbar").addEventListener("click", () =>
  mostrarVista("section-view-reports")
); // se muestra vista reportes
just(".btn-new-operation").addEventListener("click", () =>
  mostrarVista("section-new-operation")
); //se muestra vista nueva operacion
just(".btn-add-new-operation").addEventListener("click", () =>
  mostrarVista("main-balance")
); //apreta btn agregar nueva operacion y lo devuelve a view balance
just(".cancel-btn-new-operation").addEventListener("click", () =>
  mostrarVista("main-balance")
); //apreta btn cancelar nueva operation y lo devuelve al view balance
just(".btn-edit-category").addEventListener("click", () =>
  mostrarVista("section-view-categories")
); //apreta btn editar categoria y lo devuelve a view categorias
just(".cancel-edit-category-btn").addEventListener("click", () =>
  mostrarVista("section-view-categories")
); //al apretar btn cancelar editar categoria te devuelve al view categorias
just(".cancel-btn-edit-operation").addEventListener("click", () =>
  mostrarVista("main-balance")
); //apreta btn cancelar editar operacion y lo devuelve al view balance
just(".btn-add-edition-operation").addEventListener("click", () =>
  mostrarVista("main-balance")
);

//TRAER Y LLEVAR DATOS AL LS  ---NO SE SI FUNCIONA---
const traerDatosDelLS = () => {
  //esto va a ir al LS y va a traer los datos que encuentre dentro
  return JSON.parse(localStorage.getItem("walletInformation")); //aca estamos trayendo todo lo que este bajo esa key y con el JSON parse lo convertimos en un objeto ya que de otra manera devuelve solo un gran enorme string
};

// const subirDatosAlLS = () => { //esto va a llevar los datos actualizados al LS
//     localStorage.setItem('walletInformation')
// }

const traerCategorias = () => {
  return traerDatosDelLS()?.categories; // devuelve lo que encuentre en el LS bajo el nombre .categories, si no hay nada entonces que me muestre lo que hardcodeamos abajo en el array categories (se leeria como hay traerDatosSelLS ? entonces mostrame la que dice categories, sino solamente ignorame)
};

//CATEGORÍAS CARGADAS (YA SEA HARDCODEADO O LO QUE HAYA EN EL LS)
let categories = traerCategorias() || [
  //esto se lee como "che categories, traeme primero lo que haya en el LS y si no hay nada entonces mostrame esto hardcodeado" (si traerCategorias es falsy o null entonces pasa a la siguiente instruccion)
  {
    id: randomId(),
    nombre: "Comida",
  },
  {
    id: randomId(),
    nombre: "Servicios",
  },
  {
    id: randomId(),
    nombre: "Salidas",
  },
  {
    id: randomId(),
    nombre: "Transporte",
  },
  {
    id: randomId(),
    nombre: "Educacion",
  },
  {
    id: randomId(),
    nombre: "Trabajo",
  },
];
console.log(categories); //aca vamos a estar viendo si en definitiva habia algo en en LS o si se muestra lo hardcodeado

// RECORRER Y AGREGAR CATEGORÍAS  ---FUNCIONA ✓---
const listaCategorias = (category) => {
  just("#list-categorie").innerHTML = "";
  for (let { nombre, id } of category) {
    just("#list-categorie").innerHTML += `
        <li class="tag has-text-weight-semibold is-flex is-justify-content-space-between">
                <p>${nombre}</p>
                <div class="column is-narrow has-text">
                <a href="#" onclick="showEditCategory('${id}')" id="${id}" class="mr-4 is-size-7 edit-link btn-edition-category">Editar</a>
                <a href="#" onclick="removeCategoryList('${id}')" id="${id}" class="is-size-7 delete-link">Eliminar</a>
                </div>
        </li>`;
  }
};
listaCategorias(categories);

//MUESTRA EDITAR CATEGORIA, OCULTA VIEW CATEGORIA Y TOMA NUEVO VALOR DEL INPUT Y LO EMPUJA A UNA FUNCION  ---FUNCIONA ✓---
const showEditCategory = (identifier) => {
  //recibe como parametro un ID
  just("#edit-categories").classList.remove("is-hidden"); //le sacamos el hidden a la view de editar categoria
  just(".section-view-categories").classList.add("is-hidden"); //le ponemos el hidden a la view de categorias principal
  let categorieToEdit = categories.filter(
    (categoria) => categoria.id === identifier
  ); //creamos una variable "categorias a editar" la cual guarde la condicion que del array categorias, filtre *en nuevo array* las categorias que pasen el filtro de que el id sea el mismo === que el que esta entrando como parametro `identifier` y que esas sean las categorias a editar (osea si haces click en comida, que no se modifique otra que no sea solo esa elegida)
  just("#edition-categoria-input").value = categorieToEdit[0].nombre; //llamamos al input donde se va a estar escribiendo la modificacion y accedemos a su value y lo ponemos como el reemplazo del item en la posicion 0 ya que nos estaba devolviendo un array
  just("#edit-category-btn").addEventListener("click", () =>
    categorieEdition(categorieToEdit[0].id)
  ); //este evento va a ejecutar la funcion editar categoria
};

// FUNCION QUE ACTUALIZA AHORA EL NOMBRE QUE APARECE EN VIEW CATEGORY POR EL CAMBIO HECHO ANTERIORMENTE  ---FUNCIONA ✓---
const categorieEdition = (identifier) => {
  //creamos una funcion que tome como parametro un id
  const userChosenName = just("#edition-categoria-input").value; //dentro creamos una variable que guarde el nuevo valor del input que pide editar la categoria
  let newCategories = {
    //creamos un nuevo objeto con las categorias que existen
    id: identifier, //conservamos el id que viene como parametro
    nombre: userChosenName, //y el nombre le pasamos la info ya obtenida anteriormente
  };
  let newestCategory = categories.map((categoryOfArr) =>
    categoryOfArr.id === identifier ? { ...newCategories } : categoryOfArr
  ); //creamos otra variable que guarde la modificacion y me cree un nuevo array con eso nuevo (todo esto lo hace .map) y dentro del map le decimos que a la categoria que tenga un id que sea igual al que estoy recibiendo como parametro, que modifique esa categoria por la nueva ingresada (osea que si se eligio comidas para modificar, que sea comidas quien se vea afectada y no otro valor -ya que comida original y comida a modificar tendrian el mismo id)
  listaCategorias(newestCategory);
};

//HACER QUE TODOS LOS SELECT TENGAN LA MISMA INFO --- FUNCIONA ✓---
const fillSelect = (arrayCategoria) => {
  all(".category-select").forEach((select) => {
    //traemos a todos los select (el de filtro el de operacion y el de editar operacion) y le decimos, que por cada select que haya (son 3) le agregue una categoria (como?)     ------>
    select.innerHTML = "";
    for (let categoria of arrayCategoria) {
      //<--- por cda categoria de categories (que es un array d objetos) +++se podria destructurar directamente escribiendo let {nombre, id} y luego no habria que poner abajo categoria.id sino simplemente id o nombre
      select.innerHTML += `<option value="${categoria.id}">${categoria.nombre}</option>`; //cree en el select con un innerHtml que sea un option value y q el valor de id y nombre lo traiga de lo que haya en ese objeto dentro del array select (linea 143)
    }
  });
};
fillSelect(categories);
just("#category-filter").addEventListener("change", () => {
  console.log(just("#category-filter").value);
});











//++++++++++++++++++++++++++++++++++++ SEPT 1 ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Define the getStoredOperations function first
const getStoredOperations = () => {
    const storedOperationsLS = localStorage.getItem("operations") //guardamos en una variable lainformacion que este bajo el nombre operations (como viene del LS viene como string)
    return storedOperationsLS ? JSON.parse(storedOperationsLS) : []  //y aca decimos si storedOperationstiene informacion, entonces lo que tenga lo pase a un objeto
};

//++++++++++++++++++++++++++++++++++++ SEPT 2 ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CREA UNA NUEVA LISTA PARA CADA NUEVA OPERACION EN OPERACIONES VIEW  ---FUNCIONA ✓---
const listOperations = () => {
    just('.img-sin-operaciones').classList.add('is-hidden')
    just(".section-operation-created").innerHTML = `<section class="column-of-new-operation columns is-justify-content-space-between">
    <div class="column">
        Descripcion
    </div>
    <div class="column">
        Categoria
    </div>
    <div class="column">
        Fecha
    </div>
    <div class="column">
        Monto
    </div>
    <div class="column has-text-right">
        Acciones
    </div>
    </section>` //le digo que cuando se ejecute al principio me tire esto primero
    const operations = getStoredOperations();
    for (let { id, description, category, date, amount } of operations) {
        just(".section-operation-created").innerHTML += `
        <div class="column-of-each-operation columns is-justify-content-space-between">
        <div class="column is-flex-wrap-wrap">
        <p>${description}</p>
        </div>
        <div class="column">
        <p>${category}</p>
        </div>
        <div class="column">
        <p>${date}</p>
        </div>
        <div class="column">
        <p>${amount}</p>
        </div>
        <div class="column has-text-right">
        <button onclick="editOperationList('${id}')" class="button is-text is-small edit-operation-btn" id="${id}">Editar</button>
        <button onclick="removeOperationList('${id}')" class="button is-text is-small delete-operation-btn" id="${id}">Eliminar</button>
        </div>
        </div>`;
        }
};




//++++++++++++++++++++++++++++++++++++ SEPT 3 ++++++++++++++++++++++++++++++++++++++++++++++++++++++
//funcion para guardar la nueva operation en el LS
const saveOperation = (operation) => {
    const updatedOperations = getStoredOperations() //aca guardamos en una variable local lo que haya guardadose en la funcion anterior donde nos traiamos y transformabamos la info del LS
    updatedOperations.push(operation); //lo que hayamos obtenido ahora lo pusheamos a lo q entraria como parametro ()........
    localStorage.setItem("operations", JSON.stringify(updatedOperations)) //y le decimos que devuelva al LS la operacion actualizada (lo nuevo que pusheamos al array) y pasada previamente a string
};

//++++++++++++++++++++++++++++++++++++ SEPT 4 ++++++++++++++++++++++++++++++++++++++++++++++++++++++
const nuevaOperacion = () => {
    const newOperation = {
        id: randomId(),
        description: just("#input-text-description").value,
        category: just("#selects-for-type").value,
        date: just("#input-date").value,
        amount: just("#input-number-amount").value,
    };
    saveOperation(newOperation)
    return newOperation
};

//++++++++++++++++++++++++++++++++++++ SEPT 5 and finished +++++++++++++++++++++++++++++++++++++++++++
just(".btn-add-new-operation").addEventListener("click", () => {
    const operationsUserInfo = nuevaOperacion(); //guarda en una variable la info que se cargo en nueva operacion
    listOperations(); //esa informacion cargada se la pasa a la funcion saveOperation    
});

//localStorage.clear()    // WHY IS NOT CLEANING THE INTERNAL STORAGE UNLESS THAT I DO DELETE ON LS?






// A HACER:
//         + UTILIDAD AL BOTON ELIMINAR OPERACION
//         + ESCONDER LA IMG Y SPAN CUANDO SE AGREGE UNA OPERACION




















