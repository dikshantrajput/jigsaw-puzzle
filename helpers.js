const  leftContainer = document.querySelector(".jigsaw__left__container")
const  rightContainer = document.querySelector(".jigsaw__right__container")

export const createElement = (type = "div",content = "")=>{
    const newElement = document.createElement(type)
    content != "" ? type.innerHTML = content : null
    return newElement
}

export const setCompletePuzzle = (parts = 2,imageUrl,grid = false)=>{
    const containerWidth = rightContainer.clientWidth
    const containerHeight = rightContainer.clientHeight

    if(grid){
        let positionX = 0;
        let positionY = 0;
        let c = 0;
        for(var i=0;i<3;i++){
            for(var j=0;j<3;j++){

                positionY = (containerHeight/3) * i
                positionX = (containerWidth/3) * j

                let puzzlePart = createElement("div","")
            
                puzzlePart.classList.add("piece","jigsaw__grid__piece")
                puzzlePart.dataset.id = c+1
        
                puzzlePart.style.backgroundImage = `url(${imageUrl})`
                puzzlePart.style.backgroundRepeat = `no-repeat`
                puzzlePart.style.width = `${100/3}%`
        
                puzzlePart.style.backgroundPositionX = `-${positionX}px`
                puzzlePart.style.backgroundPositionY = `-${positionY}px`
        
                rightContainer.append(puzzlePart)
                c++
            }
        }
    }else{
        for(let i= 0;i<parts;i++){
            let puzzlePart = createElement("div","")
            
            puzzlePart.classList.add("piece","piece__half")
            puzzlePart.dataset.id = i+1
    
            puzzlePart.style.backgroundImage = `url(${imageUrl})`
            puzzlePart.style.backgroundRepeat = `no-repeat`
            puzzlePart.style.width = `${100/parts}%`
    
            const positionX = (containerWidth/parts) * i
    
            puzzlePart.style.backgroundPositionX = `-${positionX}px`
    
            rightContainer.append(puzzlePart)
        }
    }
}

const createGridsInRightContainer = (parts,grid)=>{
    if(grid){
        let c = 0;

        for(var i=0;i<3;i++){
            for(var j=0;j<3;j++){
                let puzzlePart = createElement("div","")
            
                puzzlePart.classList.add("piece","jigsaw__grid__piece","piece__grid")
                puzzlePart.classList.add("droppable__area")
                puzzlePart.dataset.id = c+1
        
                puzzlePart.style.width = `${100/3}%`
        
                rightContainer.append(puzzlePart)
                c++
            }
        }
    }else{
        for(let i=0;i<parts;i++){
            let puzzlePart = createElement("div","")
            
            puzzlePart.classList.add("piece","piece__half","piece__grid")
            puzzlePart.classList.add("droppable__area")
            puzzlePart.dataset.id = i+1
    
            puzzlePart.style.width = `${100/parts}%`
    
            rightContainer.append(puzzlePart)
        }
    }
    
} 

export const shuffleImageParts = (parts,file,errorElement = null,grid=false)=>{
    const containerWidth = rightContainer.clientWidth
    const containerHeight = rightContainer.clientHeight

    createGridsInRightContainer(parts,grid)
    
    if(!file || file == undefined){
        errorElement.innerHTML = "Please upload a file"
        window.scrollTo(0,errorElement.getBoundingClientRect.top)
    }else{
        errorElement.innerHTML = ""
    }

    if(grid){
        var leftPosition = 0;
        var topPosition = 0;

        var temp_array = [];

        for(var i=0;i<3;i++){
            topPosition = 0
            for(var j=0;j<3;j++){
                console.log(leftPosition)
                temp_array.push({leftPosition,topPosition})
                topPosition+=(leftContainer.clientHeight/3)
            }
            leftPosition+=(leftContainer.clientWidth/3)
        }

        console.log(temp_array)

        if(parts == 9){
            shuffle(temp_array)
        }else{
            temp_array.reverse()
        }


        let positionY = 0;
        let positionX = 0;
        let c = 0;

        for(var i=0;i<3;i++){
            for(var j=0;j<3;j++){

                positionY = (containerHeight/3) * i
                positionX = (containerWidth/3) * j
            
                let puzzlePart = createElement("div","")
                puzzlePart.draggable = true
                puzzlePart.classList.add("piece","jigsaw__grid__piece","left__piece__grid")
                puzzlePart.classList.add("draggable__piece")
                puzzlePart.dataset.id = c+1

                puzzlePart.style.backgroundImage = `url(${file})`
                puzzlePart.style.backgroundRepeat = `no-repeat`
                puzzlePart.style.width = `${100/3}%`

                puzzlePart.style.left = temp_array[c].leftPosition + 'px'
                puzzlePart.style.top = temp_array[c].topPosition + 'px'

                puzzlePart.style.backgroundPositionX = `-${positionX}px`
                puzzlePart.style.backgroundPositionY = `-${positionY}px`

                leftContainer.append(puzzlePart)
                c++;
            }
        }
    }else{

        var leftPosition = 0;

        var temp_array = [0];

        for(var j=1;j<parts;j++){
            leftPosition+=(leftContainer.clientWidth/parts)
            temp_array.push(leftPosition)
        }

        if(parts == 10){
            shuffle(temp_array)
        }else{
            temp_array.reverse()
        }

        for(let i= 0;i<parts;i++){
            let puzzlePart = createElement("div","")
            puzzlePart.draggable = true
            puzzlePart.classList.add("piece","piece__half","left__piece")
            puzzlePart.classList.add("draggable__piece")
            puzzlePart.dataset.id = i+1

            puzzlePart.style.backgroundImage = `url(${file})`
            puzzlePart.style.backgroundRepeat = `no-repeat`
            puzzlePart.style.width = `${100/parts}%`

            puzzlePart.style.left = temp_array[i] + 'px'

            const positionX = (containerWidth/parts) * i

            puzzlePart.style.backgroundPositionX = `-${positionX}px`

            leftContainer.append(puzzlePart)
        }
    }
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}