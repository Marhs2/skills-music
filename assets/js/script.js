let $saveData
const $ = (element) => document.querySelector(element);
const $$ = (element) => [...document.querySelectorAll(element)];
const $itemBox = $('.contents');
const $title = $('h2');
const $input = $('.form-group .form-control');
const $searchBtn = $('.form-group .input-group-btn');
let data;
let music;


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

    const noResearch = document.createElement('div');
    noResearch.textContent = "검색된 앨범이 없습니다.";
    noResearch.style.fontSize = '20px'
    noResearch.style.display = 'none'
    $itemBox.appendChild(noResearch);




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


    function search() {
        const query = $input.value.trim().toLocaleLowerCase();
        let hasResult = false
        save.forEach((e) => {

            const title = e.querySelector(".produ-cost h5");
            const artistName = e.querySelector('.fa-microphone').nextElementSibling;

            if (query && (title.textContent.toLocaleLowerCase().includes(query) || artistName.textContent.toLocaleLowerCase().includes(query))) {
                e.style.display = "block";
                hasResult = true; 
            } else {
                e.style.display = "none";
            }


        })
        noResearch.style.display = hasResult ? "none" : "block";
    }

    $input.addEventListener('keypress', (e) => {
        e.key === 'Enter' ? search() : '';
    })

    $searchBtn.addEventListener('click', () => {
        search()
    })




    // let rese = $$('.fa-calendar');
    // let array = [];


}

init()
load()




$title.textContent = "All"
