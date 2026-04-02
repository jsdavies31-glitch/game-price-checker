
const button = document.getElementById("submit")
const container = document.getElementById('outputDiv');
const inputTtile = document.getElementById('gameTitle')
const id = getUserID()

button.addEventListener("click",fetchGames)

inputTtile.addEventListener('keydown', function(event){
  if (event.key === 'Enter' && inputTtile.value != ""){
    fetchGames()
  }
})


async function fetchGames(onclick) {
  let title = inputTtile.value

  if (title == ""){
    title = "Crimson Desert"
  } 

  
  console.log(title)
   let response = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${title}`)
   let data = await response.json()
   console.log(data)
   const {gameID} = data[0]
   console.log(gameID)
   searchbyGameID(gameID)
    
}


async function searchbyGameID(gameID){
    let response = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`)
    let data = await response.json()
    console.log(data)

    const {thumb,steamAppID,title} = data.info
    const {price: cheapest} = data.cheapestPriceEver
    const {dealID,price,retailPrice} = data.deals[0]

    console.log(thumb,steamAppID,cheapest,dealID,price,retailPrice)
    const dealURL = `https://www.cheapshark.com/redirect?dealID=${dealID}`
    console.log(dealURL)

    writeResult(thumb,cheapest,dealURL,price,retailPrice,title)
}

function writeResult(thumb,cheapest,dealURL,price,retailPrice,title){
    //container.innerHTML =""

    const cardData = {
      thumb: thumb,
      dealURL: dealURL,
      price: price,
      retailPrice: retailPrice,
      title: title
    }

    let gameCard = document.createElement('div')
    gameCard.className = "game-card"


    //remove card control

    const removeBtn = document.createElement('button')
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', () =>  container.removeChild(gameCard))


    let header = document.createElement('h2')
    header.textContent = title
    
    let img = document.createElement('img')
    img.src = thumb;
    //img.className = "game-img";

    let dealPrice = document.createElement('p')
    dealPrice.textContent = "Deal Price: $" + price

    let rrp  = document.createElement('p')
    rrp.textContent = "RRP: $" + retailPrice

    let dealLink = document.createElement('a')
    dealLink.href = dealURL;
    dealLink.className = "btn";
    dealLink.textContent = "View Deal";
    dealLink.target = "_blank"; 

    gameCard.appendChild(removeBtn)
    gameCard.appendChild(header)
    gameCard.appendChild(img)
    gameCard.appendChild(dealPrice)
    gameCard.appendChild(rrp)
    gameCard.appendChild(dealLink)
    container.appendChild(gameCard)

    writeToRedis(cardData)
}

function getUserID(){
  let id = localStorage.getItem('userId')

  if (!id){
    id = crypto.randomUUID()
    localStorage.setItem('userId',id)
  }

  return id
}

   
async function writeToRedis(data){
  console.log(data)
  console.log(JSON.stringify(data))
    //const dataJson = JSON.stringify({ data})
    //console.log(dataJson)

    try{
    const response  = await fetch('/user/cards',{
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id,
      data})
   })

   const result =  await response.json()
   console.log("express says ", result)

    } catch (err){
        console.error("error sending request")
    }
    
}

async function load() {
  let data = await fetch(`/user/${id}`)
  res = await data.json()
  //let titles = res.map(item => {thumb,cheapest,dealURL,price,retailPrice,title} = item)
  console.log(res)
 // console.log(titles)

 loadResults(res)
}

load()

function loadResults(data){
    data.forEach(item => {
    const {thumb,dealURL,price,retailPrice,title} = item

    let gameCard = document.createElement('div')
    gameCard.className = "game-card"

    const removeBtn = document.createElement('button')
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', () =>  container.removeChild(gameCard))


    let header = document.createElement('h2')
    header.textContent = title
    
    let img = document.createElement('img')
    img.src = thumb;
  

    let dealPrice = document.createElement('p')
    dealPrice.textContent = "Deal Price: $" + price

    let rrp  = document.createElement('p')
    rrp.textContent = "RRP: $" + retailPrice

    let dealLink = document.createElement('a')
    dealLink.href = dealURL;
    dealLink.className = "btn";
    dealLink.textContent = "View Deal";
    dealLink.target = "_blank"; 

    gameCard.appendChild(removeBtn)
    gameCard.appendChild(header)
    gameCard.appendChild(img)
    gameCard.appendChild(dealPrice)
    gameCard.appendChild(rrp)
    gameCard.appendChild(dealLink)
    container.appendChild(gameCard)
    });

    
}