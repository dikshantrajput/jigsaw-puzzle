import {createElement, setCompletePuzzle,shuffleImageParts} from "./helpers.js";

const imageInput = document.getElementsByName("image")[0];
const startButton = document.querySelector(".jigsaw__start__button")
// const levelSelector = document.querySelector(".level__selector");
const successBtn = document.querySelector(".success__btn");
const restartBtn = document.querySelector(".restart__btn");
const globalErrorElement = document.getElementById("error");
const successModal = document.querySelector(".success__modal");
const finalSuccessModal = document.querySelector(".final__success__modal");

var dragged
let globalErrorMessage = ""
let file
let parts_set = new Set;
let temp = new Set;
let count = 0;
let partsSelected = 2;

let grid = false;

const clearPreviousData = ()=>{
    document.querySelector(".jigsaw__left__container").innerHTML = ""
    document.querySelector(".jigsaw__right__container").innerHTML = ""
}

const showImage = (e)=>{
    clearPreviousData()
    file = e.target.files[0]
    const acceptedTypes = ["jpeg","jpg","png"]

    if(file == undefined){
        alert("No file selected")
    }

    const extension = file.type.split('/')[1]

    if(! acceptedTypes.includes(extension)){
        globalErrorMessage = "Please select a valid image file"
        return 
    }else{
        globalErrorMessage = ""
    }

    const reader = new FileReader(file)

    reader.onload = function(ev){
        const previewFileUrl = ev.target.result
        setCompletePuzzle(partsSelected,previewFileUrl,grid)
    }

    reader.readAsDataURL(file)

    globalErrorElement.innerHTML = globalErrorMessage
}

imageInput.addEventListener("change",showImage)

const shuffleImage = ()=>{
    parts_set.clear();
    temp.clear();
    count = 0;
    clearPreviousData()

    if(!file || file == undefined){
        globalErrorElement.innerHTML = "Please upload a file"
        window.scrollTo(0,globalErrorElement.getBoundingClientRect.top)
        return
    }else{
        globalErrorElement.innerHTML = ""
    }

    const reader = new FileReader(file)

    reader.onload = function(ev){
        const previewFileUrl = ev.target.result
        shuffleImageParts(partsSelected,previewFileUrl,globalErrorElement,grid)
    }

    reader.readAsDataURL(file)
}

startButton.addEventListener("click",shuffleImage)

document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

document.addEventListener("drop",(ev)=>{
    ev.preventDefault()
    if(ev.target.classList.contains("droppable__area")){
        let element = createElement("div","",null)
        element.classList.add("dragged__element")
        element.draggable = true
        element.dataset.id = dragged.dataset.id
        element.style.backgroundImage = dragged.style.backgroundImage;
        element.style.backgroundRepeat = dragged.style.backgroundRepeat;
        
        if(grid){
            element.style.backgroundPositionY = dragged.style.backgroundPositionY;
        }

        element.style.backgroundPositionX = dragged.style.backgroundPositionX;

        ev.target.append(element)

        if(!temp.has(dragged.dataset.id)){
            count++;
        }

        temp.add(dragged.dataset.id)

        if(ev.target.dataset.id != dragged.dataset.id){
            parts_set.delete(dragged.dataset.id)
        }else{
            parts_set.add(dragged.dataset.id)
        }

        if(parts_set.size == partsSelected){
            if(partsSelected == 9){
                gameOver()
                return
            }
            successModal.classList.toggle("hide")
        }else{
            if(count == partsSelected){
                startButton.innerHTML = "Reset"
                globalErrorElement.innerHTML = "You have used all the pieces but the puzzle is not correct. Try again"
            }else{
                globalErrorElement.innerHTML = ""
            }
        }
        dragged.parentNode.removeChild(dragged);
    }else if(ev.target.classList.contains("dragged__element")){
        globalErrorElement.innerHTML = ""
    }
})

// levelSelector.addEventListener("change",(ev)=>{
//     const level = (ev.target.value)
//     if(level == "" || level == undefined){
//         return 
//     }
//     if(level == 9){
//         grid = true
//     }
//     partsSelected = level
// })

document.addEventListener("dragstart",(ev)=>{
    dragged = ev.target
})

const gameOver = ()=>{
    finalSuccessModal.classList.toggle("hide")
}

successBtn.addEventListener("click",()=>{
    switch(partsSelected){
        case 2:
            partsSelected = 3
            break;
        case 3:
            grid = true
            partsSelected = 9
            break;
        default:
            gameOver()
            return
    }
    successModal.classList.toggle("hide")
    startButton.click()
})

restartBtn.addEventListener("click",()=>{
    location.reload()
})