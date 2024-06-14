(() => {
    /**
     * private variable & constant
     */

    /**
     *	cache DOM
     */
    const $admissionRoster = $('#admission-roster');  // 榜單資訊區
    const $searchBtn = $('#btn-search');  // 查榜按鈕
    const $name = $('#name'); // 姓名
    const $birthday = $('#birthday');  // YYYY/MM/DD

    /**
     *	bind event
     */
    $searchBtn.on('click', getAdmissionRoster);

    /**
     * init
     */
    $birthday.datepicker({
        updateViewDate: true, // 會自動避免並修正直接輸入錯誤/無效的月/日，例：不是潤年的時候輸入2月29日，設true會自動跳下一天到3月1日
        autoclose: true, // 選完會自動關閉選擇器
        startView: 2, // 以個位數年份單位開始瀏覽
        maxViewMode: 3, // 最高以10年單位瀏覽年份
        immediateUpdates: true, // 只要選了其中一個項目，立即刷新欄位的年/月/日的數字
        defaultViewDate: '-18y', // 預設選項是 18 年前開始
    });
    loading.complete();

    // 找找學生是不是有在榜上
    function getAdmissionRoster(){
        $('.result').hide();  // 重新點下查詢按鈕就要把之前的結果藏起來

        // 檢查有沒有什麼地方不對的

        if ($name.val() === ""){  // 沒填寫姓名
            swal({title: `請填寫姓名`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }
        let $nameString ='';
        $nameString = $name.val().trim(); // 取得名字並去除前後空白
        $name.val($nameString);

        if ($("input[name='gender']:checked").val() === undefined){  // 沒填寫生理性別
            swal({title: `請選擇生理性別`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }

        if ($birthday.val() === ""){  // 沒填寫生日
            swal({title: `請填寫生日`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }

        const data = {
            name: $nameString,
            birthday: $birthday.val(),
            gender: $("input[name='gender']:checked").val()
        }

        // 去後端查榜啦
        loading.start();
        student.getAdmissionRoster(data)
            .then((res) => {
                if (res.ok){
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                showAdmissionRoster(json);
            })
            .catch((err) => {
                if (err.status && err.status === 404) {  // 找不到QQ or 未獲錄取
                    err.json().then((data) => {
                        if (data.messages[0] == '未獲錄取' ) {
                            $('#form-result').show();
                            $('#no-result-case1').text('未獲錄取');
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（未獲錄取）
                        } else {
                            $('#form-result').show();
                            $('#no-result-case1').text('查無結果，請檢查輸入資料是否有誤');
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（無資料）
                        }
                    })
                } else {
                    err.json && err.json().then((data) => {
                        console.error(data);
                        swal({title: `ERROR: \n${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    })
                }
                loading.complete();
            });
    }

    // 恭喜金榜題名！
    function showAdmissionRoster(admissionInfo) {
        console.log(admissionInfo);
        // 別忘記前輩說的「別相信任何使用者輸入的東西」，先過濾過濾吧
        let studentName = encodeHtmlCharacters(admissionInfo.name);
        let studentEngName = encodeHtmlCharacters(admissionInfo.eng_name);
        let admissionChannel = '';
        if(admissionInfo.overseas_student_id.substring(0, 2) == '99'){
            admissionChannel = '單獨招生';
        } else {
            admissionChannel = '聯合分發';
        }
        let rosterHtml = `
            <thead>
                <tr>
                    <th>報名序號</th>
                    <th>僑生編號</th>
                    <th>中、英文姓名</th>
                    <th>錄取校系</th>
                    <th>報名管道</th>
                </tr>
            </thead>
            <tbody>
        `;
        admissionInfo.student_young_associate_department_admission_selection_order.forEach((element, index) => {
            let deptTitle, schoolTitle = '';  // 錄取的學校及系所名
            deptTitle = element.department_data.title;
            schoolTitle = element.department_data.school.title;
            trClass = (index % 2 == 0) ?'table-warning':'';
            rosterHtml += `<tr class="${trClass}"><td class="align-middle" data-th="報名序號">${admissionInfo.user_id}</td>  <!--報名序號-->
                <td class="align-middle" data-th="僑生編號">${admissionInfo.overseas_student_id}</td>  <!--僑生編號-->
                <td class="align-middle" data-th="中、英文姓名">${studentName}<br />${studentEngName}</td>  <!--中、英文姓名-->
                <td class="align-middle" data-th="錄取校系">${schoolTitle}<br />${deptTitle}</td>  <!--錄取的學校及系所-->
                <td class="align-middle" data-th="報名管道">${admissionChannel}</td>  <!--報名管道-->
                <tr/>`;
        });
        rosterHtml+=`</tbody>`;

        $admissionRoster.html(rosterHtml);


        $('.accepted').show("normal");  // 顯示查詢結果區（金榜題名）
        loading.complete();
    }

    // 轉換一些敏感字元避免 XSS
    function encodeHtmlCharacters(bareString) {
        if (bareString === null) return '';
        return bareString.replace(/&/g, "&amp;")  // 轉換 &
            .replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
            .replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
            .replace(/ /g, " &nbsp;")
            ;
    }

})();
