
/**
*	cache DOM
*/

const $departmenList = $('#departmen-list');
const $searchFilterInput = $('#search'); // 搜尋欄
const $searchBtn = $('#search-btn'); // 搜尋按鈕

/**
*	init
*/

_init();

/**
*	bind event
*/

$searchBtn.on('click', _filterInput); // 學生列表篩選
$searchFilterInput.keypress((e) => { e.keyCode == 13 && _filterInput(); }); // 偵測是否在輸入欄按下 enter

async function _init() {
    try {
        const response = await getDepartmentsQuota();
        if (!response.ok) { throw response; }
        const quotaDatas = await response.json();

        let html = '';
        let htmlArray = [];
        let count = 0;
        for (let schooldata of quotaDatas) {
            let schoolTitle = schooldata.title;
            let schoolEnglishTitle = schooldata.eng_title;
            for (let departmentData of schooldata.young_associate_departments) {
                htmlArray[count] = `
                    <tr>
                        <td style="text-align: center; vertical-align:middle;">
                            ${departmentData.card_code}
                        </td>
                        <td style="text-align: center; vertical-align:middle;">
                            ${schoolTitle}
                            <br/>
                            ${schoolEnglishTitle}
                        </td>
                        <td style="text-align: center; vertical-align:middle;">
                            <a target="_blank" href="${departmentData.url}">
                                ${departmentData.title}
                                <br/>
                                ${departmentData.eng_title}
                            </a>
                        </td>
                        <td style="text-align: center; vertical-align:middle;">
                            ${departmentData.admission_selection_ratify_quota}
                        </td>
                    </tr>
                `;
                count++;
            }
        }
        shuffle(htmlArray); // 亂數排序 暫時沒有時間幫他們做 sorting table
        for(let htmlLine of htmlArray) {
            html += htmlLine;
        }
        await $departmenList.html(html);
        await $.bootstrapSortable(true); // 啟用列表排序功能
        await loading.complete();
    } catch (e) {
        console.error(e);
        await e.json && e.json().then((data) => {
            swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
        })
        await loading.complete();
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function _filterInput(){
    let value = $searchFilterInput.val().toLowerCase();

    $departmenList.find('tr').filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });

    return;
}


function getDepartmentsQuota() {
    return fetch(`${env.baseUrl}/young-associate/department/quota`, {
        credentials: 'include'
    });
}