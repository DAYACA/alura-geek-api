import {priceLength, moneyFormat, testUrl } from './form_validations.js'

const d = document,
    url = 'http://localhost:3001/articulos',
    $form = d.querySelector('.crud-form'),
    $contentDiv = d.querySelector('.container-items'),
    $title = d.querySelector('.crud-title'),
    $template = d.getElementById('crud-template').content,
    $fragment = d.createDocumentFragment()


async function getAll() {
    try {
        let res = await fetch(url),
            json = await res.json()
        //console.log(json)

        json.forEach(el => {
            //console.log(el)
            $template.querySelector('.title-product').textContent = el.title;
            $template.querySelector('.image_product').src = el.src
            $template.querySelector('.image_product').alt = el.title
            $template.querySelector('.price-product').textContent = `Precio: $${el.price}`
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.title;
            $template.querySelector(".edit").dataset.src = el.src;
            $template.querySelector(".edit").dataset.price = el.price;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone)
        });

        $contentDiv.appendChild($fragment)
    } catch (err) {
        let message = err.statusText || 'Ocurrió un error';
        $contentDiv.insertAdjacentHTML('afterend', `<p><b>Error ${err.status}: ${message}</b></p>`)
    }
}

d.addEventListener('DOMContentLoaded', getAll)

d.addEventListener('submit', async e =>{
    if(e.target === $form){
        e.preventDefault()

        if(!e.target.id.value){
        //POST
            try {
                let price = priceLength(e.target.price.value),
                    confirmUrl = testUrl(e.target.src.value)
                    
                    if(price === true){
                        if(confirmUrl === true){
                            let options = {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                mode: 'cors',
                                body: JSON.stringify({
                                    title: e.target.title.value,
                                    src: e.target.src.value,
                                    price: moneyFormat(e.target.price.value)
                                })
                            }, 
                                res = await fetch(url, options),
                                json = await res.json() 
                                console.log(confirmUrl)
            
                                if(!res.ok) throw {status: res.status, statusText: res.statusText}
                                location.reload()
                        }else{
                            let message = 'La URL de la imagen no cumple con el patron (https://imagen.png)...';
                            $form.insertAdjacentHTML('afterend', `<p><b>Error: ${message}</b></p>`)
                        }
                        
                    }else{
                        let message = 'El valor del articulo no cumple con el criterio de mínimo 4 de digitos o excede el máximo de 6 digitos';
                        $form.insertAdjacentHTML('afterend', `<p><b>Error: ${message}</b></p>`)
                    }

            } catch (err) {
                console.log(err)
            }

        }else{
            //PUT
            try {
                let options = {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    mode: 'cors',
                    body: JSON.stringify({
                        title: e.target.title.value,
                        src: e.target.src.value,
                        price: e.target.price.value
                    })
                 }, 
                    res = await fetch(`${url}/${e.target.id.value}`, options),
                    json = await res.json() 

                if(!res.ok) throw {status: res.status, statusText: res.statusText}
                location.reload()
            } catch (err) {
                console.log(err)
            }
        }
    }
})

d.addEventListener('click', async(e) => {
    if(e.target.matches('.edit')){
        $title.textContent = 'Editar Articulo'
        $form.id.value = e.target.dataset.id
        $form.title.value = e.target.attributes[2].value
        $form.src.value = e.target.attributes[3].value
        $form.price.value = e.target.attributes[4].value
    }

    if(e.target.matches('.delete')){
        let Todelete = confirm(`¿Estás seguro de eliminar el articulo?`)

        if(Todelete){
            try {
                console.log(e.target.dataset.id)

                let options = {
                    method: 'DELETE',
                    headers: {"Content-Type": "application/json"}
                },  res = await fetch(`${url}/${e.target.dataset.id}`, options),
                    json = await res.json()

                if(!res.ok) throw {status: res.status, statusText: res.statusText}
                location.reload()
            } catch (err) {
                console.log(err)
            }
        }
        
    }
})