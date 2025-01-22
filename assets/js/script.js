let $saveData
const $ = (element) => document.querySelector(element);
const $$ = (element) => [...document.querySelectorAll(element)];
const $itemBox = $('.contents');
const $title = $('h2');
const $input = $('.form-group .form-control');
const $searchBtn = $('.form-group .input-group-btn');
const $mainMenu = $('#main-menu')
const $cart = $('.panel-body > button')
const $shoppingCart = $('.table tbody')
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

    return dataB - dataA
})


async function Music() {

    const noResearch = document.createElement('div');
    noResearch.textContent = "검색된 앨범이 없습니다.";
    noResearch.style.fontSize = '20px'
    noResearch.style.display = 'none'
    $itemBox.appendChild(noResearch);

    $mainMenu.removeChild($mainMenu.querySelector('li:nth-child(3)'))




    let array = []
    $music.forEach((album, idx) => {


        if (!array.includes(album.category)) {
            array.push(album.category)
            creatTab(album.category)
        }
        const newMusic = document.createElement('div')

        newMusic.classList.add('col-md-2', 'col-sm-2', 'col-xs-2', 'product-grid');

        newMusic.innerHTML = createItemHtml(album, idx);

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

async function addCart() {
    await Music()
    let amount = {}
    let btns = $$('.btn-xs');
    btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const $objectName = e.target.closest('button').parentNode.parentNode.querySelector('h5').innerText
            const $objectInfo = e.target.closest('button').parentNode.parentNode.querySelectorAll('p')
            const $objectImg = e.target.parentNode.parentNode.parentNode.querySelector('img')
            let countSum = 1;
            let PriceSum = 20000;

            if (Object.hasOwn(amount, $objectName)) {
                amount[$objectName].count++
            } else {
                amount[$objectName] = {
                    count: 1,
                    img: $objectImg.src,
                    price: $objectInfo[2].textContent,
                    release: $objectInfo[1].textContent,
                    artist: $objectInfo[0].textContent
                }
            }

            localStorage.setItem('data', JSON.stringify(amount))


            e.target.textContent = `추가하기 (${amount[$objectName].count}개)`;
            e.target.classList.add("fa", "fa-shopping-cart")
            e.target.style.padding = '4px 1px'



            Object.keys(amount).forEach((item) => {
                const itemObject = amount[item]
                countSum += itemObject.count
                PriceSum += (parseInt(itemObject.price.replace(/[^0-9]/g, '')) * itemObject.count)



                $cart.innerHTML = `<i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${countSum}</strong> 개 금액 ￦ ${PriceSum.toLocaleString('en-US')}원 `
            })

            const newItme = document.createElement('tr')


            newItme.innerHTML += `
                <td class="albuminfo" id="${e.target.closest('.product-items').id}">
                    <img src="${$objectImg.src}">
                    <div class="info">
                        <h4>${$objectName}</h4>
                        <span>
                            <i class="fa fa-microphone"> 아티스트</i> 
                            <p>${$objectInfo[0].textContent}</p>
                        </span>
                        <span>
                            <i class="fa  fa-calendar"> 발매일</i> 
                            <p>${$objectInfo[1].textContent}</p>
                        </span>
                    </div>
                </td>
                <td class="albumprice">
                ${$objectInfo[2].textContent}
                </td>
                <td class="albumqty">
                    <input type="number" class="form-control" value="1">
                </td>
                <td class="pricesum">
                    ${$objectInfo[2].textContent}
                </td>
                <td>
                    <button class="btn btn-default">
                        <i class="fa fa-trash-o"></i> 삭제
                    </button>
                </td>`

            !$shoppingCart.querySelector(`#${e.target.closest('.product-items').id}`) ? $shoppingCart.appendChild(newItme) : ''

            Object.keys(amount).forEach((item) => {
                const object = amount[item]
                $shoppingCart.querySelector(`#${e.target.closest('.product-items').id}`).parentNode.querySelector('.albumprice').textContent = object.price
                $shoppingCart.querySelector(`#${e.target.closest('.product-items').id}`).parentNode.querySelector('.pricesum').textContent = `₩ ${(parseInt(object.price.replace(/[^0-9]/g, '')) * object.count).toLocaleString('en-US')}`
            })



        });
    });
}



const createItemHtml = (album, idx) => `
    <div class="product-items" id="item${idx}">
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





