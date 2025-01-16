let $saveData
const $ = (element) => document.querySelector(element);
const $$ = (element) => [...document.querySelectorAll(element)];
const $itemBox = $('.contents')
const $title = $('h2')
const option = {
    maximumFractionDigits: 4
}


async function load() {
    const data = await fetch('./music_data.json');
    const obj = await data.json();

    const music = { ...obj.data }


    Object.keys(music).forEach((e) => {
        const res = music[e]

        let regex = /[^0-9]/g;
        let price = res.price.replace(regex, "")
        price = price.toLocaleString('en-US')


        const newMusic = document.createElement('div')

        newMusic.innerHTML = `
                         <div class="col-md-2 col-sm-2 col-xs-2 product-grid">
                            <div class="product-items">
                                    <div class="project-eff">
                                        <img class="img-responsive" src="images/${res.albumJaketImage}" alt="Time for the moon night">
                                    </div>
                                <div class="produ-cost">
                                    <h5>${res.albumName}</h5>
                                    <span>
                                        <i class="fa fa-microphone"> 아티스트</i> 
                                        <p>${res.artist}(Lovelyz)</p>
                                    </span>
                                    <span>
                                        <i class="fa  fa-calendar"> 발매일</i> 
                                         
                                        <p>${res.release}</p>
                                    </span>
                                    <span>
                                        <i class="fa fa-money"> 가격</i>
                                        <p>₩${price}</p>
                                    </span>
                                    <span class="shopbtn">
                                        <button class="btn btn-default btn-xs">
                                            <i class="fa fa-shopping-cart"></i> 추가하기 
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
        `

        $itemBox.appendChild(newMusic)
    })

    const musicPrice = {...document.querySelectorAll(".produ-cost > span:nth-child(3) > p")}
    let sum
    Object.keys(musicPrice).forEach((e) =>{
        let cel = musicPrice[e]
        cel = cel.innerHTML.toLocaleString('en-US')
        console.log(cel);
        cel = parseInt(cel.innerHTML)
        console.log(cel);
    })

    


}


load()

$title.textContent = "All"
