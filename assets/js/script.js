let $saveData
const $ = (element) => document.querySelector(element);
const $$ = (element) => [...document.querySelectorAll(element)];
const $itemBox = $('.contents');
const $title = $('h2');
const $input = $('.form-group .form-control');
const $searchBtn = $('.form-group .input-group-btn');
const $mainMenu = $('#main-menu')
const $cart = $('.panel-body  i:nth-child(1)')
let $musciLayer = [...document.querySelectorAll('.product-grid')]
let $purchase = {}

console.log($cart);

const response = await fetch('./music_data.json');
const data = await response.json();
let $music = data.data;

const option = {
    maximumFractionDigits: 4
}

$title.textContent = "ALL"

$itemBox.innerHTML = ``

$music.sort((a, b) => {
    const dataA = new Date(a.release)
    const dataB = new Date(b.release)

    return dataB -  dataA
})


async function Music() {

    const noResearch = document.createElement('div');
    noResearch.textContent = "검색된 앨범이 없습니다.";
    noResearch.style.fontSize = '20px'
    noResearch.style.display = 'none'
    $itemBox.appendChild(noResearch);

    $mainMenu.removeChild($mainMenu.querySelector('li:nth-child(3)'))




    let array = []
    $music.forEach((album) => {


        if (!array.includes(album.category)) {
            array.push(album.category)
            creatTab(album.category)
        }
        const newMusic = document.createElement('div')

        newMusic.classList.add('col-md-2', 'col-sm-2', 'col-xs-2', 'product-grid');

        newMusic.innerHTML = createItemHtml(album);

        $itemBox.appendChild(newMusic)
    })


    function search() {

        let save = [...document.querySelectorAll('.product-grid')]


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

    $input.addEventListener('keyup', (e) => {
        if (e.key == "Enter") search();
    })

    $searchBtn.addEventListener('click', () => {
        search()
    })



    function creatTab(e) {
        const newTab = document.createElement('li')
        newTab.innerHTML = `<a href="#"><i class="fa fa-youtube-play fa-2x"></i> <span>${e}</span></a>`
        $mainMenu.appendChild(newTab)
    }



}


async function tabFilter() {
    const $searchPart = document.querySelector('.text-center')
    $mainMenu.addEventListener('click', (e) => {

        const $mainMenuTab = $$('#main-menu li:nth-child(n+2)')

        const category = e.target.closest('a')?.querySelector('span').textContent
        if (!category) return;

        console.log(category);

        $musciLayer = [...document.querySelectorAll('.product-grid')]

        $mainMenuTab.forEach((a) => {
            a.querySelector('a').classList.remove('active-menu')
        })
        e.target.closest('a').classList.add('active-menu')

        $title.textContent = category







        $itemBox.innerHTML =
            (category === 'ALL' ? $music : $music.filter((music) => music.category === category))
                .map(res => `<div class="col-md-2 col-sm-2 col-xs-2 product-grid">${createItemHtml(res)}</div>`)
                .join('');








        // $music.forEach((res) => {
        //     if (category == 'ALL') {
        //         const newMusic = document.createElement('div')

        //         newMusic.classList.add('col-md-2', 'col-sm-2', 'col-xs-2', 'product-grid');

        //         newMusic.innerHTML = createItemHtml(res);

        //         $itemBox.appendChild(newMusic)
        //         r    eturn;
        //     }
        //     if (category == res.category) {
        //         const newMusic = document.createElement('div')

        //         newMusic.classList.add('col-md-2', 'col-sm-2', 'col-xs-2', 'product-grid');

        //         newMusic.innerHTML = createItemHtml(res);

        //         $itemBox.appendChild(newMusic)

        //     }
        // })

    })







}

function addCart() {
    let amount = {}
    setTimeout(() => {
        let btns = $$('.btn-xs');
        btns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const $objectName = e.target.parentNode.parentNode.querySelector('h5').textContent



                if (Object.hasOwn(amount, $objectName)) {
                    amount[$objectName]++
                } else {
                    amount[$objectName] = 1;
                }

                e.target.textContent = `추가하기 (${amount[$objectName]}개)`;
                e.target.classList.add("fa", "fa-shopping-cart")
                e.target.style.padding = '4px 1px'


            });
        });
    }, 0);
}



const createItemHtml = (album) => `
    <div class="product-items">
            <div class="project-eff">
                <img class="img-albumponsive" src="images/${album.albumJaketImage}" alt="Time for the moon night">
            </div>
        <div class="produ-cost">
            <h5>${album.albumName}</h5>
            <span>
                <i class="fa fa-microphone"> 아티스트</i> 
                <p>${album.artist}(Lovelyz)</p>
            </span>
            <span>
                <i class="fa  fa-calendar"> 발매일</i> 

                <p>${album.release}</p>
            </span>
            <span>
                <i class="fa fa-money"> 가격</i>
                <p>₩${parseInt(album.price.replace(/[^0-9]/g, "")).toLocaleString('en-US')}</p>
            </span>
            <span class="shopbtn">
                <button class="btn btn-default btn-xs">
                    <i class="fa fa-shopping-cart"></i> 카트담기 
                </button>
            </span>
        </div>
    </div>
    `
addCart()
tabFilter()
Music()





