function togglMode(){
    const html = document.documentElement
    const image = document.querySelector("#profile img")

    if(html.classList.contains("light")){
        html.classList.remove("light")
        image.setAttribute("src", "./assets/perfil1.jpeg")
    }
    else{
        html.classList.add("light")
        image.setAttribute("src", "./assets/perfil1.jpeg")
    }
}