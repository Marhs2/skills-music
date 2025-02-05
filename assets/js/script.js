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
let btns = $$('.btn-xs');
let $musciLayer = [...document.querySelectorAll('.product-grid')]
let $purchase = {}
let musicObject = []


const response = await fetch('./music_data.json');
const data = await response.json();
let $music = data.data;

const option = {
    maximumFractionDigits: 4
}

$mainMenu.querySelector('li:nth-child(3)').remove()
$title.textContent = "ALL"
$itemBox.innerHTML = ``
$shoppingCart.innerHTML = ''
$cart.innerHTML = `<i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>0</strong> 개 금액 ￦ 0원 `


$music.sort((a, b) => new Date(b.release) - new Date(a.release))

async function Music() {
    $music.forEach((album, idx) => {
        const newMusic = document.createElement('div')
        newMusic.classList.add('col-md-2', 'col-sm-2', 'col-xs-2', 'product-grid');
        newMusic.innerHTML = createItemHtml(album, idx);
        $itemBox.appendChild(newMusic)
    })

    function search() {
        let Musics = [...document.querySelectorAll('.product-grid')]
        const query = $input.value.trim().toLocaleLowerCase();

        const noResearch = document.createElement('div');
        noResearch.classList.add('research')
        noResearch.textContent = "검색된 앨범이 없습니다.";
        noResearch.style.fontSize = '20px'
        noResearch.style.display = 'none'

        !$itemBox.innerHTML.includes(noResearch.innerHTML) ? $itemBox.appendChild(noResearch) : ''

        let hasResult = false
        Musics.forEach((e) => {
            const title = e.querySelector(".produ-cost h5");
            const artistName = e.querySelector('.fa-microphone').nextElementSibling;

            if (query && (title.textContent.toLocaleLowerCase().includes(query) || artistName.textContent.toLocaleLowerCase().includes(query))) {
                e.style.display = "block";

                const highlightText = (text, query) => {
                    const regex = new RegExp(query, 'gi');
                    return text.replace(regex, match =>
                        `<span style="background-color: yellow; color:black; display:inline;">${match}</span>`
                    );
                };

                title.innerHTML = highlightText(title.textContent, query);
                artistName.innerHTML = highlightText(artistName.textContent, query);

                hasResult = true;
            } else {
                e.style.display = "none";
            }

        })
        document.querySelector('.research').style.display = hasResult ? "none" : "block";
    }

    $input.addEventListener('keyup', (e) => {
        if (e.key == "Enter") search();
    })

    $searchBtn.addEventListener('click', () => {
        search()
    })
}

function creatTab() {
    let array = []
    $music.filter((item) => {
        const newTab = document.createElement('li')
        if (array.includes(item.category)) return;
        array.push(item.category)
        newTab.innerHTML = `<a href="#"><i class="fa fa-youtube-play fa-2x"></i> <span>${item.category}</span></a>`
        $mainMenu.appendChild(newTab)
    });
}

async function tabFilter() {
    await Music()
    btns = $$('.btn-xs');
    cart()
    $mainMenu.addEventListener('click', (e) => {
        const $mainMenuTab = $$('#main-menu li:nth-child(n+2)')
        const category = e.target.closest('a')?.querySelector('span').textContent
        if (!category) return;
        $musciLayer = [...document.querySelectorAll('.product-grid')]
        $mainMenuTab.forEach((a) => {
            a.querySelector('a').classList.remove('active-menu')
        })
        e.target.closest('a').classList.add('active-menu')
        $title.textContent = category
        $itemBox.innerHTML =
            (category === 'ALL' ? $music : $music.filter((music) => music.category === category))
                .map((album, idx) => `<div class="col-md-2 col-sm-2 col-xs-2 product-grid">${createItemHtml(album, idx)}</div>`)
                .join('');
        btns = $$('.btn-xs');
        cart()
    })
}

async function cart() {
    let totalSum = 0;
    let countSum = 0;
    btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if (!e.target.matches('button')) return;
            const findParent = (element) => e.target.closest('.product-items').querySelector(element)
            const makeInt = (res) => parseInt(res.replace(/[^0-9]/g, ''))
            const nextElmentText = (res) => res.nextElementSibling.textContent;
            const title = findParent('h5').textContent

            if (!(title in musicObject)) {
                musicObject[title] = {
                    count: 1,
                    artist: nextElmentText(findParent('.fa-microphone')),
                    date: makeInt(nextElmentText(findParent('.fa-calendar'))),
                    price: nextElmentText(findParent('.fa-money')),
                    imgSrc: findParent('img').src,
                }
            } else {
                musicObject[title].count++
            }

            countSum++
            totalSum += makeInt(nextElmentText(findParent('.fa-money')))
            btn.innerHTML = `<i class="fa fa-shopping-cart"></i> 추가하기 (${musicObject[title].count}개)`
            $cart.innerHTML = `<i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${countSum}</strong> 개 금액 ￦ ${totalSum.toLocaleString('en-US')}원</a>`
            const albumInput = document.querySelector(`#${e.target.closest('.product-items').id} .albumqty input`)
            albumInput ? albumInput.value = musicObject[title].count : ''

            if ($shoppingCart.querySelector(`#${e.target.closest('.product-items').id}`) && [...$shoppingCart.querySelectorAll(`h4`)].filter((title) => musicObject.includes(title))) return;

            const newAlbum = document.createElement('tr')
            newAlbum.id = `${e.target.closest('.product-items').id}`
            newAlbum.innerHTML += `<td class="albuminfo">
                                                <img src="${findParent('img').src}">
                                                <div class="info">
                                                    <h4>${title}</h4>
                                                    <span>
                                                        <i class="fa fa-microphone"> 아티스트</i>
                                                        <p>${nextElmentText(findParent('.fa-microphone'))}(Lovelyz)</p>
                                                    </span>
                                                    <span>
                                                        <i class="fa  fa-calendar"> 발매일</i>
                                                        <p>${nextElmentText(findParent('.fa-calendar'))}</p>
                                                    </span>
                                                </div>
                                            </td>
                                            <td class="albumprice">
                                                ${nextElmentText(findParent('.fa-money'))}
                                            </td>
                                            <td class="albumqty">
                                                <input type="number" class="form-control" value="1" min="1">
                                            </td>
                                            <td class="pricesum">
                                                ₩${(makeInt(nextElmentText(findParent('.fa-money'))) * musicObject[title].count).toLocaleString('en-US')}
                                            </td>
                                            <td>
                                                <button class="btn btn-default">
                                                    <i class="fa fa-trash-o"></i> 삭제
                                                </button>
                                            </td>`
            $shoppingCart.appendChild(newAlbum)


        })
    })
}

// async function addCart() {
//     btns.forEach((btn) => {
//         btn.addEventListener('click', (e) => {
//             const $objectName = e.target.closest('button').parentNode.parentNode.querySelector('h5').innerText
//             const $objectInfo = e.target.closest('button').parentNode.parentNode.querySelectorAll('p')
//             const $objectImg = e.target.closest('div').parentNode.querySelector('img')
//             let countSum = 0;
//             let PriceSum = 0;

//             if (Object.hasOwn(musicObject, $objectName)) {
//                 musicObject[$objectName].count++
//             } else {
//                 musicObject[$objectName] = {
//                     count: 1,
//                     img: $objectImg.src,
//                     price: $objectInfo[2].textContent,
//                     release: $objectInfo[1].textContent,
//                     artist: $objectInfo[0].textContent
//                 }
//             }
//             e.target.closest('button').innerHTML = `<i class="fa fa-shopping-cart"></i> 추가하기 (${musicObject[$objectName].count}개)`;

//             Object.keys(musicObject).forEach((item) => {
//                 const itemObject = musicObject[item]
//                 countSum += itemObject.count
//                 PriceSum += (parseInt(itemObject.price.replace(/[^0-9]/g, '')) * itemObject.count)
//                 $cart.innerHTML = `<i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${countSum}</strong> 개 금액 ￦ ${PriceSum.toLocaleString('en-US')}원 `
//             })

//             const newItme = document.createElement('tr')
//             newItme.innerHTML += `
//                 <td class="albuminfo" id="${e.currentTarget.closest('.product-items').id}">
//                     <img src="${$objectImg.src}">
//                     <div class="info">
//                         <h4>${$objectName}</h4>
//                         <span>
//                             <i class="fa fa-microphone"> 아티스트</i> 
//                             <p>${$objectInfo[0].textContent}</p>
//                         </span>
//                         <span>
//                             <i class="fa  fa-calendar"> 발매일</i> 
//                             <p>${$objectInfo[1].textContent}</p>
//                         </span>
//                     </div>
//                 </td>
//                 <td class="albumprice">
//                 ${$objectInfo[2].textContent}
//                 </td>
//                 <td class="albumqty">
//                     <input type="number" class="form-control" value="1" min='1'>
//                 </td>
//                 <td class="pricesum">
//                     ${$objectInfo[2].textContent}
//                 </td>
//                 <td>
//                     <button class="btn btn-default">
//                             <i class="fa fa-trash-o"></i> 삭제
//                     </button>
//                 </td>`

//             !$shoppingCart.querySelector(`#${e.currentTarget.closest('.product-items').id}`) ? $shoppingCart.appendChild(newItme) : ''
//             Object.keys(musicObject).forEach((item) => {
//                 const object = musicObject[item]
//                 $shoppingCart.querySelector(`#${e.currentTarget.closest('.product-items').id}`).parentNode.querySelector('.albumprice').textContent = object.price
//                 $shoppingCart.querySelector(`#${e.currentTarget.closest('.product-items').id}`).parentNode.querySelector('.pricesum').textContent = `₩ ${(parseInt(object.price.replace(/[^0-9]/g, '')) * object.count).toLocaleString('en-US')}`
//                 $shoppingCart.querySelector(`#${e.currentTarget.closest('.product-items').id}`).parentNode.querySelector('.form-control').value = object.count
//                 document.querySelector('.totalprice span').textContent = `₩${(parseInt(object.price.replace(/[^0-9]/g, '')) * object.count).toLocaleString('en-US')}`
//             })

//         });
//     });
// }

// function cartMange() {
//     const total = $('.totalprice').querySelector('span')
//     let sum = 0;
//     let count = 0;

//     total.textContent = 0

//     function totalChange() {
//         let sum2 = 0;
//         let count2 = 0;
//         [...$shoppingCart.children].forEach((item) => {
//             sum2 += parseInt(item.querySelector('.pricesum').textContent.replace(/[^0-9]/g, ''))
//             count2 += parseInt(item.querySelector('input').value)
//         })

//         count = count2
//         sum = sum2
//     }

//     $shoppingCart.addEventListener('click', (e) => {
//         const findPar = e.target.parentNode.parentNode
//         const totalPrice = (e.target.closest('input').value * findPar.querySelector('.albumprice').textContent.replace(/[^0-9]/g, '')).toLocaleString('en-US')
//         findPar.querySelector('.pricesum').textContent = `₩ ${totalPrice}`
//         total.textContent = `₩${sum.toLocaleString('en-US')}`
//         $cart.innerHTML = `<i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${count}</strong> 개 금액 ￦ ${sum}원 `
//         totalChange()
//     })
// }

const createItemHtml = (album, idx) =>
    `    <div class="product-items" id="item${idx}">
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
                ${musicObject[album.albumName] ?
        `<i class="fa fa-shopping-cart"></i> 추가하기 (${musicObject[album.albumName]?.count}개)` :
        '<i class="fa fa-shopping-cart"></i> 쇼핑카트담기'
    }
                </button>
            </span>
        </div>
    </div>
    `
// cartMange()
tabFilter()
creatTab()
cart()