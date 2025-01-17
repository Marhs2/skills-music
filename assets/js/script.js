let $saveData
const $ = (element) => document.querySelector(element);
const $$ = (element) => [...document.querySelectorAll(element)];
const $itemBox = $('.contents')
const $title = $('h2')
let data;
let obj;
let music;
let day = [];
const option = {
    maximumFractionDigits: 4
}



async function load() {
    try {
        const response = await fetch('./music_data.json');
        const data = await response.json();
        music = data.data; // 직접 music 변수에 저장
        return music;
    } catch (error) {
    }
}



async function init() {



    await load();



    Object.keys(music).forEach((e) => {
        const res = music[e]

        let regex = /[^0-9]/g;
        let price = parseInt(res.price.replace(regex, ""))
        price = price.toLocaleString('en-US')


        const newMusic = document.createElement('div')

        newMusic.classList.add('col-md-2', 'col-sm-2', 'col-xs-2', 'product-grid');

        newMusic.innerHTML = `
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
        `

        $itemBox.appendChild(newMusic)
    })

    let save = [...document.querySelectorAll('.product-grid')]
    let rese = $$('.fa-calendar');
    let array = [];

    function sortFun() {
        for (let i = 0; i < rese.length - 1; i++) {
            const before = parseInt(rese[i].nextElementSibling.innerText.replace('.', '').replace('.', ''))
            const after = parseInt(rese[i + 1].nextElementSibling.innerText.replace('.', '').replace('.', ''))
            save[i]


            for (let j = 0; i < rese.length - 1; j++) {
                if (after > before) {
                    const temp = save[i]
                    $itemBox.removeChild(save[i])
                    $itemBox.insertBefore(temp, save[i + 1])
                }
            }



        }
    }



    sortFun()

}

init()
load()




$title.textContent = "All"
