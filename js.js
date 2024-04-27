const filmNameInputValue = document.getElementById("inputSearch")  //input
const btnSearch = document.getElementById("btnSearch")  //inputun buttonu
const iconSearch = document.querySelector(".iconSearch") // səhifə kiçik olanda görünən icon


//7f267504,4c7d0804,44daee6f, 4a1c55b0, da7217d3,7bf6189b,db153328,c55d8e96

const apikey = "c55d8e96"

document.querySelector('.menuIcon').addEventListener(`click`, () => {  //səhifə kiçik olanda solda görünən menu icona klik olanda menu açılması üçün
    document.querySelector(".sidebarMenu").style.left = 0
})

document.querySelector('.menuCloseIcon').addEventListener(`click`, () => { // həmin menunun bağlanması üçün

    document.querySelector(".sidebarMenu").style.left = "-100%"
})


function rndIdForFilm() {  // apidən film əldə etmək üçün bizə 7 rəqəmli id  lazımdı onu bu funksiyadan random əldə edirik
    let rndNum = Math.floor(Math.random() * 10000000)
    if (1000000 <= rndNum && rndNum <= 2450000) {
        return rndNum
    } else {
        return rndIdForFilm()
    }
}


for (let i = 0; i < 20; i++) { //bunu dövrə salmışamki səhifə açılanda bir neçə film ilkin olaraq görünsün
    writeFilmsWithFetch()
}



function writeFilmsWithFetch() {  // filmləri apidən alan funksiya

    fetch(`http://www.omdbapi.com/?i=tt${rndIdForFilm()}&apikey=${apikey}`) //api-ə sorğu atırıq öz keyimiz və random aldığımız rəqəmlə. rəqəmi ona görə random alırıq ki yuxarıdakı hər dövrdə bu funksiya fərqli rəqəm alsın ki ekrana da fərqli film çıxsın

        .then(result => {

            if (result.ok) {  // əgər məlumat almaq mümkündürsə
                return result.json()  // həmin məlumatı json formatda return edirik
            } else { //əgər uğursuzdursa error çıxarırıq
                throw new Error("Result not found");
            }
        })
        .then(importData => { // əgər film haqqında məlumat gəlirsə və uğurludusa 

            if (importData.Poster != "N/A" && importData.Poster != undefined) { // və həmin filmin poster şəkli varsa 
                setFilmDescription(importData) // həmin gələn datanı filmi ekrana çıxarmaq üçün altda yazacağımız funksiyaya ötürürük
            } else {
                writeFilmsWithFetch() // əgər məlumat uğurlu gəlsə də posteri yoxdursa onda funksiya yenidən çağır
            }
        })
        .catch(error => { // error halı
            console.log("Film yüklənərkən problem yarandı:", error);
        })

}


function setFilmDescription(importData) { // gələn məlumatı işləyirik. belə ki  newDiv yaradırıq hansı ki filmin hər şeyini özündə saxlayacaq və htmldə olan centerMain elementinə  həmin divi göndəririk

    let newDiv = document.createElement("div") //div yaradırıq
    newDiv.classList.add("filmDiv")  // class əlavə edirik



    let newImg = document.createElement("img")  //img yaradırıq və filmin posterini ünvanını mənimsədirik
    newImg.setAttribute("src", `${importData.Poster}`)

    newImg.setAttribute("alt", `${importData.Title}`) // lazım olanları əlavə edirik
    newImg.setAttribute("loading", "lazy")
    newImg.classList.add("filmPoster")
    newDiv.appendChild(newImg)



    // aşağıda isə filmin görünməsini istədiyimiz bütün məlumatlarını əlavə edirik
    let descDiv = document.createElement("div")
    descDiv.classList.add("filmDescription")

    let pElement = document.createElement("p")
    pElement.classList.add("filmName")
    pElement.innerHTML = `<strong>Name:</strong> ${importData.Title}`
    descDiv.appendChild(pElement)


    let ulForDesc = document.createElement("ul")
    ulForDesc.setAttribute("style", "list-style: none;")

    let liForUlActors = document.createElement("li")
    liForUlActors.innerHTML = `<strong>Actors:</strong> ${importData.Actors} <br>`


    let liForUlDirector = document.createElement("li")
    liForUlDirector.innerHTML = `<strong>Director and Writer:</strong> ${importData.Director} and ${importData.Writer} <br>`


    let liForUlRatings = document.createElement("li")
    if (importData.Ratings.length != 0) {

        liForUlRatings.innerHTML = `<strong>Ratings:</strong> ${importData.Ratings[0].Source} - ${importData.Ratings[0].Value} <br>`
    } else {
        liForUlRatings.innerHTML = `<strong>Ratings:</strong> Not Found <br>`
    }


    let liForUlIMDB = document.createElement("li")

    if (importData.imdbRating != undefined) {
        liForUlIMDB.innerHTML = `<strong>IMDB:</strong> ${importData.imdbRating} <br>`

    } else {
        liForUlIMDB.innerHTML = `<strong>IMDB:</strong>Not Found <br>`
    }


    ulForDesc.appendChild(liForUlActors)
    ulForDesc.appendChild(liForUlDirector)
    ulForDesc.appendChild(liForUlRatings)
    ulForDesc.appendChild(liForUlIMDB)


    descDiv.appendChild(ulForDesc)
    newDiv.appendChild(descDiv)


    document.getElementById("centerMain").appendChild(newDiv)  // sonda isə yaratdıqlarımızı yığdığımız divi centerMain-ə əlavə edirik
}




function createModal(importData) {

    // aşağıda modala lazımı elementləri yaradırıq

    // parent
    let newDiv = document.createElement("div");
    newDiv.classList.add("modal")

    // button
    let button = document.createElement("button")
    button.classList.add("close-modal")
    button.textContent = "X"
    newDiv.appendChild(button)

    //left
    let leftModal = document.createElement("div")
    leftModal.classList.add("leftModal")

    let imgForModal = document.createElement("img")
    imgForModal.classList.add("imgModal")

    leftModal.appendChild(imgForModal)
    newDiv.appendChild(leftModal)

    //right
    let rightModal = document.createElement("div")
    rightModal.classList.add("rightModal")

    let ulForRight = document.createElement("ul")
    ulForRight.classList.add("ulForRight")

    rightModal.appendChild(ulForRight)
    newDiv.appendChild(rightModal)



    document.body.appendChild(newDiv)


    // DELETE
    document.querySelector(".close-modal").addEventListener('click', () => {
        newDiv.parentNode.removeChild(newDiv);
    })



    //və yaratdıqdan sonra isə yuxarıdakı elementlərə lazımı məlumatları göndəririk

    document.querySelector(".imgModal").setAttribute("src", `${importData.Poster}`)
    document.querySelector(".imgModal").setAttribute("alt", `${importData.Title}`)



    document.querySelector(".ulForRight").innerHTML =
        `<li><strong>Film Name:</strong> ${importData.Title} </li>
    <li><strong>Director:</strong>
     ${importData.Director} </li>
    <li><strong>Actors:</strong>
     ${importData.Actors} </li>
    <li><strong> Country:</strong>
     ${importData.Country} </li>
    <li><strong>Ratings:</strong>
     ${importData.Ratings[0].Source}-${importData.Ratings[0].Value}</li>
    <li><strong>Writer:</strong>
     ${importData.Writer} </li>
    <li><strong>IMDB:</strong>
     ${importData.imdbRating}</li> `


}



btnSearch.addEventListener("click", () => { // input buttona klik olanda

    move_name = filmNameInputValue.value // inputdakı dəyəri götürürük
    filmNameInputValue.value="" // sonra inputun içərisindəki dəyəri sıfırlayırıq


    fetch(`http://www.omdbapi.com/?t=${move_name}&apikey=${apikey}`) //sorğu atırıq
        .then(result => {
            return result.json()  // nəticəni return edirik
        })
        .then(importData => {

            createModal(importData)  // və modal yaradan funksiyanı çağırıb nəticəni göndəririk


        })
        .catch(error => {  // error olduğu halda ekrana error çıxarırıq
            document.querySelector(".ulForRight").innerHTML = `<strong> This film is not find</strong> <br> <br> ${error}`

        })

})


iconSearch.addEventListener("click", () => {  // searc icona click olanda input və button görünür. səhifənin ortasındakı sayt adı qismi yoxa çıxır
    document.getElementById("nameSite").style.display = "none"
    iconSearch.style.display = "none"
    btnSearch.style.display = "block"
    filmNameInputValue.style.display = "block"
})