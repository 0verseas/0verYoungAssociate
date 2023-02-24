(() => {

    /**
     *	private variable
     */

    let _specialStatus = 0;
    let _disabilityCategory = '視覺障礙';
    let _currentDadStatus = 'alive';
    let _currentMomStatus = 'alive';
    let _countryList = [];

    let _hasEduType = false; // 有無學校類別
    let _hasSchoolLocate = false; // 有無學校所在地列表，true 則採用 $schoolNameSelect，否則採用 $schoolNameText
    let _schoolCountryId = "";
    let _originSchoolCountryId = "";
    let _originSchoolType = ""; // 原本的學校類型
    let _currentSchoolType = "";
    let _currentSchoolLocate = "";
    let _currentSchoolName = "";
    let _schoolList = [];
    let _schoolType = { // 有類別的地區
        "105": ["國際學校", "華校", "參與緬甸師資培育專案之華校", "緬校（僅緬十畢業）", "緬十畢業且在當地大學一年級修業完成", "緬十畢業且在當地大學二年級（含）以上修業完成"], // 緬甸
        "109": ["印尼當地中學", "海外臺灣學校"], // 印尼
        "128": ["馬來西亞華文獨立中學", "國民（型）中學、外文中學", "馬來西亞國際學校（International School）", "海外臺灣學校"], // 馬來西亞
        "133": ["海外臺灣學校", "越南當地中學"], // 越南
        "130": ["泰北未立案之華文中學", "泰國當地中學"] // 泰國
    };
    const _disabilityCategoryList = ["視覺障礙", "聽覺障礙", "肢體障礙", "語言障礙", "腦性麻痺", "自閉症", "學習障礙"];
    let _errormsg = [];

    /**
     *	cache DOM
     */

    const $personalInfoForm = $('#form-personalInfo'); // 個人資料表單

    // 申請人資料表
    const $email = $('#email');
    // const $backupEmail = $('#backupEmail'); // 備用 E-Mail
    const $name = $('#name'); // 姓名（中）
    const $engName = $('#engName'); // 姓名（英）
    const $birthday = $('#birthday'); // 生日
    const $birthContinent = $('#birthContinent'); // 出生地（州）
    const $birthLocation = $('#birthLocation'); // 出生地（國）
    const $special = $personalInfoForm.find('.special'); // 是否為「身心障礙」或「特殊照護」或「特殊教育」者
    const $specialForm = $('#specialForm'); // 身心障礙表單
    const $disabilityCategory = $('#disabilityCategory'); // 障礙類別
    const $disabilityLevel = $('#disabilityLevel'); // 障礙等級
    const $otherDisabilityCategoryForm = $('#otherDisabilityCategoryForm'); // 其他障礙說明表單
    const $otherDisabilityCategory = $('#otherDisabilityCategory'); // 其他障礙說明
    const $proposeGroup = $('#proposeGroup'); // 協助推薦來臺就學之學校或組織

    // 僑居地資料
    const $residenceContinent = $('#residenceContinent'); // 州
    const $residentLocation = $('#residentLocation'); // 國
    const $residentId = $('#residentId'); // 身分證號碼（ID no.）
    const $residentPassportNo = $('#residentPassportNo'); // 護照號碼
    const $residentPhoneCode = $('#residentPhoneCode'); // 電話國碼
    const $residentPhone = $('#residentPhone'); // 電話號碼
    const $residentCellphoneCode = $('#residentCellphoneCode'); // 手機國碼
    const $residentCellphone = $('#residentCellphone'); // 手機號碼
    const $residentAddress = $('#residentAddress'); // 地址（中 / 英）

    // 在臺資料 (選填)
    const $taiwanIdType = $('#taiwanIdType'); // 證件類型
    const $taiwanIdNo = $('#taiwanIdNo'); // 該證件號碼
    const $taiwanPassport = $('#taiwanPassport'); // 臺灣護照號碼
    const $taiwanPhone = $('#taiwanPhone'); // 臺灣電話
    const $taiwanAddress = $('#taiwanAddress'); // 臺灣地址

    // 學歷
    const $educationSystemDescription = $('#educationSystemDescription'); // 學制描述
    const $schoolContinent = $('#schoolContinent'); // 學校所在地（州）
    const $schoolCountry = $('#schoolCountry'); // 學校所在地（國）

    const $schoolTypeForm = $('#schoolTypeForm'); // 學校類別表單
    const $schoolType = $('#schoolType'); // 學校類別

    const $schoolLocationForm = $('#schoolLocationForm'); // 學校所在地、學校名稱 (select) 表單
    const $schoolLocation = $('#schoolLocation'); // 學校所在地
    const $schoolNameSelect = $('#schoolNameSelect'); // 學校名稱 (select)

    const $schoolNameTextForm = $('#schoolNameTextForm'); // 學校名稱表單
    const $schoolNameText = $('#schoolNameText'); // 學校名稱 (text)

    const $schoolAdmissionAt = $('#schoolAdmissionAt'); // 入學時間
    const $schoolGraduateAt = $('#schoolGraduateAt'); // 畢業時間

    // 家長資料
    // 父親
    const $dadStatus = $('.dadStatus'); // 存歿
    const $dadDataForm = $('#form-dadData'); // 資料表單
    const $dadName = $('#dadName'); // 姓名（中）
    const $dadEngName = $('#dadEngName'); // 姓名（英）
    const $dadBirthday = $('#dadBirthday'); // 生日
    const $dadJobForm = $('.dadJobForm');
    const $dadJob = $('#dadJob'); // 職業
    const $dadPhoneCode = $('#dadPhoneCode'); // 聯絡電話國碼
    const $dadPhone = $('#dadPhone'); // 聯絡電話
    const $dadPhoneForm = $('#dad-phone');// 父親電話欄位
    // 母親
    const $momStatus = $('.momStatus'); // 存歿
    const $momDataForm = $('#form-momData'); // 資料表單
    const $momName = $('#momName'); // 姓名（中）
    const $momEngName = $('#momEngName'); // 姓名（英）
    const $momBirthday = $('#momBirthday'); // 生日
    const $momJobForm = $('.momJobForm');
    const $momJob = $('#momJob'); // 職業
    const $momPhoneCode = $('#momPhoneCode'); // 聯絡電話國碼
    const $momPhone = $('#momPhone'); // 聯絡電話
    const $momPhoneForm = $('#mom-phone');// 母親電話欄位
    // 監護人（父母皆不詳才需要填寫）
    const $guardianForm = $('#form-guardian'); // 資料表單
    const $guardianName = $('#guardianName'); // 姓名（中）
    const $guardianEngName = $('#guardianEngName'); // 姓名（英）
    const $guardianBirthday = $('#guardianBirthday'); // 生日
    const $guardianJob = $('#guardianJob'); // 職業
    const $guardianPhoneCode = $('#guardianPhoneCode'); // 聯絡電話國碼
    const $guardianPhone = $('#guardianPhone'); // 聯絡電話

    // 在臺聯絡人
    const $twContactName = $('#twContactName'); // 姓名
    const $twContactRelation = $('#twContactRelation'); // 關係
    const $twContactPhone = $('#twContactPhone'); // 聯絡電話
    const $twContactAddress = $('#twContactAddress'); // 地址
    const $twContactWorkplaceName = $('#twContactWorkplaceName'); // 服務機關名稱
    const $twContactWorkplacePhone = $('#twContactWorkplacePhone'); // 服務機關電話
    const $saveBtn = $('#btn-save');

    /**
     *	init
     */

    _init();

    /**
     *	bind event
     */

    $birthContinent.on('change', _reRenderCountry);
    $special.on('change', _changeSpecial);
    $disabilityCategory.on('change', _switchDisabilityCategory);
    $residenceContinent.on('change', _reRenderResidenceCountry);
    $schoolContinent.on('change', _reRenderSchoolCountry);
    $schoolCountry.on('change', _chSchoolCountry);
    $schoolType.on('change', _chSchoolType);
    $schoolLocation.on('change', _chSchoolLocation);
    $dadStatus.on('change', _chDadStatus);
    $momStatus.on('change', _chMomStatus);
    $saveBtn.on('click', _handleSave);
    $residentLocation.on('change', _showResidentIDExample);
    $taiwanIdType.on('change', _showTaiwanIdExample);

    function _init() {
        //先初始化國家列表
        student.getCountryList()
            .then((json) => {
                _countryList = json;
                let stateHTML = '<option value="-1" data-continentIndex="-1" hidden disabled selected>Continent</option>';
                json.forEach((obj, index) => {
                    stateHTML += `<option value="${index}" data-continentIndex="${index}">${obj.continent}</option>`
                });
                $birthContinent.html(stateHTML);
                $residenceContinent.html(stateHTML);
                $schoolContinent.html(stateHTML);
                // 總是有人亂填生日 甚至變成未來人 只好設個上限 最年輕就是報名當下剛滿十歲
                $birthday.datepicker({
                    updateViewDate: true, // 會自動避免並修正直接輸入錯誤/無效的月/日，例：不是潤年的時候輸入2月29日，設true會自動跳下一天到3月1日
                    autoclose: true, // 選完會自動關閉選擇器
                    startView: 2, // 以個位數年份單位開始瀏覽
                    maxViewMode: 3, // 最高以10年單位瀏覽年份
                    immediateUpdates: true, // 只要選了其中一個項目，立即刷新欄位的年/月/日的數字
                    startDate: '-121y', // 當前年份-121y
                    endDate: '-9y' // 當前年份-9y
                });
                // 總是有人亂填生日 甚至變成未來人 只好設個上限 父母最年輕就是報名當下剛滿二十二歲
                $dadBirthday.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-21y'
                });
                $momBirthday.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-21y'
                });
                // 總是有人亂填生日 監護人不要變成未來人就好了
                $guardianBirthday.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-9y'
                });
                $schoolAdmissionAt.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    minViewMode: 1,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-0y'
                });
                $schoolGraduateAt.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    minViewMode: 1,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: new Date(env.year+'/09/30'),
                });
            })
            .then(()=>{
                //再初始化個人資訊
                _initPersonalInfo();
            })
    }

    function _initPersonalInfo() {
        student.getStudentPersonalData()
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                let formData = json;
                if (formData['name'] === null) {
                    formData = {
                        "gender": "",
                        "birthday": "",
                        "birth_location": "",
                        "special": 0,
                        "propose_group": "",
                        "disability_category": "",
                        "disability_level": "",
                        "resident_location": "",
                        "resident_id": "",
                        "resident_passport_no": "",
                        "resident_phone": "",
                        "resident_cellphone": "",
                        "resident_address": "",
                        "taiwan_id_type": "",
                        "taiwan_id": "",
                        "taiwan_passport": "",
                        "taiwan_phone": "",
                        "taiwan_address": "",
                        "education_system_description": "",
                        "school_country": "",
                        "school_name": "",
                        "school_type": "",
                        "school_locate": "",
                        "school_admission_at": "",
                        "school_graduate_at": "",
                        "dad_status": "alive",
                        "dad_name": "",
                        "dad_eng_name": "",
                        "dad_birthday": "",
                        "dad_job": "",
                        "dad_phone": "",
                        "mom_status": "alive",
                        "mom_name": "",
                        "mom_eng_name": "",
                        "mom_birthday": "",
                        "mom_job": "",
                        "mom_phone": "",
                        "guardian_name": "",
                        "guardian_eng_name": "",
                        "guardian_birthday": "",
                        "guardian_job": "",
                        "guardian_phone": "",
                        "tw_contact_name": "",
                        "tw_contact_relation": "",
                        "tw_contact_phone": "",
                        "tw_contact_address": "",
                        "tw_contact_workplace_name": "",
                        "tw_contact_workplace_phone": "",
                    }
                }

                // init 申請人資料表
                $email.val(json.email);
                // $backupEmail.val(formData.backup_email);
                $name.val(json.name);
                $engName.val(json.eng_name);
                $("input[name=gender][value='" + formData.gender + "']").prop("checked", true);
                $birthday.val(formData.birthday);
                $birthContinent.val(_findContinent(formData.birth_location)).change();
                $birthLocation.val(formData.birth_location);
                $proposeGroup.val(formData.propose_group);
                _specialStatus = formData.special;
                $("input[name=special][value='" + _specialStatus + "']").prop("checked", true).change();
                if (_specialStatus === 1) {
                    if (_disabilityCategoryList.indexOf(formData.disability_category) > -1) {
                        $disabilityCategory.val(formData.disability_category).change();
                    } else {
                        $disabilityCategory.val("-1").change();
                        $otherDisabilityCategory.val(formData.disability_category);
                    }
                    $disabilityLevel.val(formData.disability_level);
                }

                // init 僑居地資料
                $residenceContinent.val(_findContinent(formData.resident_location)).change();
                $residentLocation.val(formData.resident_location);
                $residentId.val(formData.resident_id);
                $residentPassportNo.val(formData.resident_passport_no);
                [document.getElementById("residentPhoneCode").value, document.getElementById("residentPhone").value] = _splitWithSemicolon(formData.resident_phone);
                [document.getElementById("residentCellphoneCode").value, document.getElementById("residentCellphone").value] = _splitWithSemicolon(formData.resident_cellphone);
                // $residentAddress.val(_splitWithSemicolon(formData.resident_address)[0]);
                $residentAddress.val(formData.resident_address); // 原本僑居地地址有兩欄，如果恢復其他語言地址欄位請記得取消這邊的註解
                // $residentOtherLangAddress.val(_splitWithSemicolon(formData.resident_address)[1]);
                _showResidentIDExample();

                // init 在臺資料
                $taiwanIdType.val(formData.taiwan_id_type);
                $taiwanIdNo.val(formData.taiwan_id);
                $taiwanPassport.val(formData.taiwan_passport);
                $taiwanPhone.val(formData.taiwan_phone);
                $taiwanAddress.val(formData.taiwan_address);

                // init 學歷述
                $educationSystemDescription.val(formData.education_system_description);
                $schoolContinent.val(_findContinent(formData.school_country)).change();
                $schoolCountry.val(formData.school_country);

                _schoolCountryId = formData.school_country;
                _originSchoolCountryId = formData.school_country;
                _originSchoolType = formData.school_type; // 取得資料庫目前的「學校類型」資料
                _currentSchoolType = (formData.school_type !== null) ? formData.school_type : "";
                _currentSchoolLocate = (formData.school_locate !== null) ? formData.school_locate : "";
                _currentSchoolName = formData.school_name;

                _reRenderSchoolType();

                // 入學時間、畢業時間初始化
                $schoolAdmissionAt.val(formData.school_admission_at);
                $schoolGraduateAt.val(formData.school_graduate_at);

                // init 家長資料
                // 父
                _currentDadStatus = formData.dad_status;
                $("input[name=dadStatus][value='" + formData.dad_status + "']").prop("checked", true);
                $dadName.val(formData.dad_name);
                $dadEngName.val(formData.dad_eng_name);
                $dadBirthday.val(formData.dad_birthday);
                $dadJob.val(formData.dad_job);
                [document.getElementById("dadPhoneCode").value, document.getElementById("dadPhone").value] = _splitWithSemicolon(formData.dad_phone);

                // 母
                _currentMomStatus = formData.mom_status;
                $("input[name=momStatus][value='" + formData.mom_status + "']").prop("checked", true);
                $momName.val(formData.mom_name);
                $momEngName.val(formData.mom_eng_name);
                $momBirthday.val(formData.mom_birthday);
                $momJob.val(formData.mom_job);
                [document.getElementById("momPhoneCode").value, document.getElementById("momPhone").value] = _splitWithSemicolon(formData.mom_phone);

                // 監護人
                $guardianName.val(formData.guardian_name);
                $guardianEngName.val(formData.guardian_eng_name);
                $guardianBirthday.val(formData.guardian_birthday);
                $guardianJob.val(formData.guardian_job);
                [document.getElementById("guardianPhoneCode").value, document.getElementById("guardianPhone").value] = _splitWithSemicolon(formData.guardian_phone);

                // init 在臺聯絡人
                $twContactName.val(formData.tw_contact_name);
                $twContactRelation.val(formData.tw_contact_relation);
                $twContactPhone.val(formData.tw_contact_phone);
                $twContactAddress.val(formData.tw_contact_address);
                $twContactWorkplaceName.val(formData.tw_contact_workplace_name);
                $twContactWorkplacePhone.val(formData.tw_contact_workplace_phone);
            })
            .then(() => {
                // init selectpicker 如果有值 要渲染要出來 一定要用 refresh 參數
                $birthLocation.selectpicker('refresh');
                $residentLocation.selectpicker('refresh');
                $schoolCountry.selectpicker('refresh');
                _showSpecialForm();
                _handleOtherDisabilityCategoryForm();
                _switchDadDataForm();
                _switchMomDataForm();
            })
            .then(() => {
                // 為了風格統一 去除預設格式
                $birthLocation.parent().find('button').removeClass('bs-placeholder');
                $residentLocation.parent().find('button').removeClass('bs-placeholder');
                $schoolCountry.parent().find('button').removeClass('bs-placeholder');
                loading.complete();
            })
            .catch((err) => {
                if (err.status && err.status === 401) {
                    swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
                    .then(()=>{
                        location.href = "./index.html";
                    });
                } else {
                    err.json && err.json().then((data) => {
                        console.error(data);
                        swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
                        .then(() => {
                            if(data.messages[0] === '請先完成資格檢視'){
                                location.href = "./qualify.html";
                            }else{
                                location.href = "./result.html";
                            }
                        });
                    })
                }
                loading.complete();
            })
    }

    function _findContinent(locationId) { // 找到州別
        for (let i = 0; i < _countryList.length; i++) {
            let countryObj = _countryList[i].country.filter((obj) => {
                return obj.id === locationId;
            });
            if (countryObj.length > 0) {
                return '' + i;
            }
        }
        return -1;
    }

    function _splitWithSemicolon(phoneNum) {
        // 先檢查傳入值是否為null
        if(phoneNum == null) return ['',''];
        let i = phoneNum.indexOf("-");
        return [phoneNum.slice(0, i), phoneNum.slice(i + 1)];
    }

    function _reRenderCountry() {
        const continent = $(this).find(':selected').data('continentindex');

        let countryHTML = '';
        if (continent !== -1) {
            $birthLocation.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            })
            $birthLocation.attr('disabled',false); // enable selector
        } else {
            $birthLocation.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $birthLocation.attr('disabled',true); // disable selector
        }
        $birthLocation.html(countryHTML); // render option
        $birthLocation.selectpicker('refresh'); // refresh selector
        $birthLocation.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }

    function _reRenderResidenceCountry() {
        const continent = $(this).find(':selected').data('continentindex');
        const identity35Rule = ["113", "127", "134", "135"]; // 海外僑生、在臺僑生不能選到香港、澳門、臺灣跟大陸

        let countryHTML = '';
        if (continent !== -1) {
            $residentLocation.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                if (identity35Rule.indexOf(obj.id) > -1) { return; }
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            })
            $residentLocation.attr('disabled',false); // enable selector
        } else {
            $residentLocation.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $residentLocation.attr('disabled',true); // disable selector
        }
        $residentLocation.html(countryHTML); // render option
        $residentLocation.selectpicker('refresh'); // refresh selector
        $residentLocation.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }

    function _showResidentIDExample() {
        document.getElementById("residentHongKongIdExample").style.display = "none";
        document.getElementById("residentMacauIdExample").style.display = "none";
        if ($residentLocation.val() == 113) {
            document.getElementById("residentHongKongIdExample").style.display = "block";
        }
        if ($residentLocation.val() == 127) {
            document.getElementById("residentMacauIdExample").style.display = "block";
        }
    }

    function _reRenderSchoolCountry() {
        const continent = $(this).find(':selected').data('continentindex');
        // 非在台碩博不能選到臺灣
        const countryFilterRule = ["134"];

        let countryHTML = '';
        if (continent !== -1) {
            $schoolCountry.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                if (countryFilterRule.indexOf(obj.id) !== -1) { return; }
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            });
            $schoolCountry.attr('disabled',false); // enable selector
        } else {
            $schoolCountry.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $schoolCountry.attr('disabled',true); // disable selector
        }
        $schoolCountry.html(countryHTML); // reder option
        $schoolCountry.selectpicker('refresh'); // refresh selector
        $schoolCountry.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }

    function _switchDisabilityCategory() {
        _disabilityCategory = $(this).val();
        _handleOtherDisabilityCategoryForm();
    }

    function _handleOtherDisabilityCategoryForm() {
        if (_disabilityCategory === "-1") {
            $otherDisabilityCategoryForm.fadeIn();
        } else {
            $otherDisabilityCategoryForm.hide();
        }
    }

    function _changeSpecial() {
        _specialStatus = Number($(this).val());
        _showSpecialForm();
    }

    function _showSpecialForm() {
        if (_specialStatus === 1) {
            $specialForm.fadeIn();
        } else {
            $specialForm.hide();
        }
    }

    function _showTaiwanIdExample() {
        document.getElementById("taiwanIdExample1").style.display = "none";
        document.getElementById("taiwanIdExample2").style.display = "none";
        if ($taiwanIdType.val() == '居留證') {
            document.getElementById("taiwanIdExample1").style.display = "block";
        }
        if ($taiwanIdType.val() == '身分證') {
            document.getElementById("taiwanIdExample2").style.display = "block";
        }
    }

    async function _chSchoolCountry() {
        // 更換學校國家時，取得國家 id 作為後續渲染使用
        // 並初始化相關變數，接下去觸發渲染學校類型事件
        _schoolCountryId = $(this).val();
        _currentSchoolType = "";
        _currentSchoolLocate = "";
        _currentSchoolName = "";
        await _reRenderSchoolType();

        if(_hasEduType){
            await $schoolNameTextForm.hide();
        }

        if (_originSchoolCountryId !== '' && _schoolCountryId !== _originSchoolCountryId) {
            $('.alert-schoolCountry').show();
        } else {
            $('.alert-schoolCountry').hide();
        }
    }

    async function _reRenderSchoolType() {
        // 處理該國籍是否需要選擇學校類型，以及學校類型 select bar 渲染工作
        if (_schoolCountryId in _schoolType) {
            let typeHTML = '';
            if(_currentSchoolType == ""){
                typeHTML = '<option value="-1" disabled selected hidden>請選擇</option>';
            }
            await _schoolType[_schoolCountryId].forEach((value, index) => {
                typeHTML += `<option value="${value}">${value}</option>`;
            });
            await $schoolType.html(typeHTML);
            if (_currentSchoolType !== "") {
                await $schoolType.val(_currentSchoolType);
            }
            await $schoolTypeForm.fadeIn();
            _hasEduType = true;
        } else {
            await $schoolTypeForm.hide();
            _hasEduType = false;
        }
        await _reRenderSchoolLocation();
    }

    function _chSchoolType() {
        // 取得修改後的學校類型，以此判斷是否要渲染學校列表
        // 初始化學校所在地、名稱變數，接下去觸發渲染學校列表事件
        _currentSchoolType = $(this).val();
        _currentSchoolLocate = "";
        _currentSchoolName = "";
        _reRenderSchoolLocation();

        // 如果學校類型改變了就讓善意的提醒浮出水面
        if (_originSchoolType != _currentSchoolType) {
            $('.alert-schoolType').show();
        } else { // 學校類型改回原本的就讓善意的提醒沉到水底
            $('.alert-schoolType').hide();
        }
    }

    async function _reRenderSchoolLocation() {
        await $schoolNameTextForm.hide();
        await $schoolLocationForm.hide();
        // 沒有選國家則不會出現學校名稱欄位
        if (!!_schoolCountryId) {
            const getSchoolListresponse = await student.getSchoolList(_schoolCountryId);
            const data = await getSchoolListresponse.json();
            if(getSchoolListresponse.ok){
                // schoolWithType: 當前類別的學校列表
                let schoolWithType = [];
                if (_schoolCountryId in _schoolType) {
                    schoolWithType = await data.filter((obj) => {
                        return obj.type === _currentSchoolType;
                    })
                } else {
                    schoolWithType = await data.filter((obj) => {
                        return obj.type === null;
                    })
                }
                if (schoolWithType.length > 0) {
                    // 當前類別有學校列表的話，渲染所在地、學校名稱列表
                    let group_to_values = await schoolWithType.reduce(function(obj, item) {
                        obj[item.locate] = obj[item.locate] || [];
                        obj[item.locate].push({ name: item.name });
                        return obj;
                    }, {});

                    // 海外臺校 檳城的好像廢校了
                    if(_currentSchoolType=='海外臺灣學校' && _currentSchoolLocate == '' && _schoolCountryId == 128){
                        _currentSchoolLocate = "雪蘭莪";
                    }

                    // group by 學校所在地
                    let groups = await Object.keys(group_to_values).map(function(key) {
                        return { locate: key, school: group_to_values[key] };
                    });
                    let schoolLocationHTML = '';
                    _schoolList = groups;
                    // 渲染學校所在地、隱藏學校名稱輸入
                    await _schoolList.forEach((value, index) => {
                        schoolLocationHTML += `<option value="${value.locate}">${value.locate}</option>`;
                    });
                    await $schoolLocation.html(schoolLocationHTML);
                    if (_currentSchoolLocate !== "") {
                        await $schoolLocation.val(_currentSchoolLocate);
                    } else {
                        _currentSchoolLocate = _schoolList[0].locate;
                    }
                    await $schoolLocationForm.show();
                    await _reRenderSchoolList();
                    _hasSchoolLocate = true;
                } else {
                    // 沒有學校列表，則單純顯示學校名稱 text field
                    await $schoolNameTextForm.show();
                    await $schoolNameText.val(_currentSchoolName);
                    _hasSchoolLocate = false;
                }
            } else {
                const message = data.messages[0];
                await swal({
                    title: `ERROR！`,
                    html:`${message}`,
                    type:"error",
                    confirmButtonText: '確定',
                    allowOutsideClick: false
                });
            }
        }
    }

    function _chSchoolLocation() {
        _currentSchoolLocate = $(this).val();
        _currentSchoolName = "";
        _hasSchoolLocate = true;
        _reRenderSchoolList();
    }

    function _reRenderSchoolList() {
        // 重新渲染學校列表
        let locateIndex = _schoolList.findIndex(order => order.locate === _currentSchoolLocate);
        let schoolListHTML = '';
        _schoolList[locateIndex].school.forEach((value, index) => {
            schoolListHTML += `<option value="${value.name}">${value.name}</option>`;
        });
        $schoolNameSelect.html(schoolListHTML);
        if (_currentSchoolName !== "") {
            $schoolNameSelect.val(_currentSchoolName);
        }

        $schoolNameSelect.selectpicker('refresh');
    }

    function _chDadStatus() {
        _currentDadStatus = $(this).val();
        _switchDadDataForm();
    }

    function _switchDadDataForm() {
        if (_currentDadStatus === "undefined") {
            $dadDataForm.hide();
        } else {
            $dadDataForm.fadeIn();
            $guardianName.val('');
            $guardianEngName.val('');
            $guardianBirthday.val('');
            $guardianJob.val('');
            $guardianPhoneCode.val('');
            $guardianPhone.val('');
        }
        if(_currentDadStatus === 'alive'){
            $dadPhoneForm.fadeIn();
            $dadJobForm.fadeIn();
        } else {
            $dadPhoneForm.hide();
            $dadJobForm.hide();
            document.getElementById('dadJob').value="";
            document.getElementById('dadPhoneCode').value="";
            document.getElementById('dadPhone').value="";
        }
        _switchGuardianForm();
    }

    function _chMomStatus() {
        _currentMomStatus = $(this).val();
        _switchMomDataForm();
    }

    function _switchMomDataForm() {
        if (_currentMomStatus === "undefined") {
            $momDataForm.hide();
        } else {
            $momDataForm.fadeIn();
            $guardianName.val('');
            $guardianEngName.val('');
            $guardianBirthday.val('');
            $guardianJob.val('');
            $guardianPhoneCode.val('');
            $guardianPhone.val('');
        }
        if(_currentMomStatus === 'alive'){
            $momPhoneForm.fadeIn();
            $momJobForm.fadeIn();
        } else {
            $momPhoneForm.hide();
            $momJobForm.hide();
            document.getElementById('momJob').value="";
            document.getElementById('momPhoneCode').value="";
            document.getElementById('momPhone').value="";
        }
        _switchGuardianForm();
    }

    function _switchGuardianForm() {
        if (_currentDadStatus === "undefined" && _currentMomStatus === "undefined") {
            $guardianForm.fadeIn();
        } else {
            $guardianForm.hide();
        }
    }

    async function _handleSave() {
        let sendData = {};
        if (sendData = await _validataForm()) {
            loading.start();
            await student.setStudentPersonalData(sendData)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then(async (json) => {
                // console.log(json);
                await swal({title:"儲存成功", type:"success", confirmButtonText: '確定'});
                window.location.reload();
                loading.complete();
                scroll(0,0);
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                });
                loading.complete();
            })
        } else {
            swal({
                title: `填寫格式錯誤`,
                html: `請檢查以下表單：<br/>` + _errormsg.join('、<br/>'),
                type:"error",
                confirmButtonText: '確定',
                allowOutsideClick: false
            });
        }
    }

    function _checkValue(col, type, colName=null, isRequired=false, LocateOrIdType='else'){
        /*
        *   3400～4DFF：中日韓認同表意文字擴充A區，總計收容6,582個中日韓漢字。
        *   4E00～9FFF：中日韓認同表意文字區，總計收容20,902個中日韓漢字。
        *   0023： #
        *   002d： -
        *   0027: '
        *   00b7：半形音界號 ·
        *   2027：全形音界號 ‧
        *   \s ： 空白
        *   \d ： 數字
        *   00c0~33FF：包含大部分國家的文字
        *   0020：空格space
        *   \p{sc=Han}/gu ： 中日韓漢字
        */
        let str = col.val();
        if(str){
            switch (type) {
                case 'Chinese':
                    str = (str.match(/\p{sc=Han}|[\u2027\u00b7]/gu) == null)? '' : str.match(/\p{sc=Han}|[\u2027\u00b7]/gu).join("");
                    break;
                case 'English':
                    str = str.replace(/[\s]/g, "\u0020").replace(/[^\u0020\u0027a-zA-Z.,-]/g, "");
                    break;
                case 'General':
                    str = str.replace(/[\s]/g, "\u0020").replace(/[\<\>\"]/g, "");
                    break;
                case 'IdNumber':
                    if (LocateOrIdType == 113) { // 香港
                        // 香港身份證號驗證格式，1或2位字母+6位數字+(1位數字或字母效驗碼)
                        if (str.match(/^[A-z]{1,2}\d{6}[(](\d{1}|[A-z])[)]$/) == null) { // 不符合上述的格式就回傳格式錯誤
                            str = '';
                        }
                    } else if (LocateOrIdType == 127) { // 澳門
                        // 澳門身份證號驗證格式，(1位數字爲0/1/5/7)+6位數字+(1位數字效驗碼)
                        if (str.match(/^[0157]{1}\d{6}[(]\d{1}[)]$/) == null) { // 不符合上述的格式就回傳格式錯誤
                            str = '';
                        }
                    } else if (LocateOrIdType == "身分證") { // 在臺證件爲身分證
                        // 驗證格式，1位字母爲地區+1位數字爲1/2(性別)+8位數字
                        const taiwan_idRegex = /^[A-z]{1}[1-2]{1}\d{8}$/;
                        if (str.match(taiwan_idRegex) == null) { // 不符合上述的格式就回傳格式錯誤
                            str = '';
                        }
                    } else if (LocateOrIdType == "居留證") { // 在臺證件爲居留證
                        // 驗證格式，1位字母爲地區(不包括 Y，而 L，S，R 則是服務站地區未合併的關係，故還是不加入黑名單)+1位數字爲A/B/C/D/8/9(新式舊式性別區分)+8位數字
                        const taiwan_permitRegex = /^[A-XZa-xz]{1}([A-Da-d8-9]{1})\d{8}$/;
                        if (str.match(taiwan_permitRegex) == null) { // 不符合上述的格式就回傳格式錯誤
                            str = '';
                        }
                    } else if (LocateOrIdType == 105){ // 緬甸身份證含有/()
                        str = str.replace(/[^0-9A-z\/()\u0020]/g, "");
                    } else { // 其餘證件只允許字母數字和-號
                        str = str.replace(/[^0-9A-z\u002d]/g, "");
                    }
                    break;
                case 'Number':
                    str = str.replace(/[^\d\u0020\u0023]/g, "");
                    break;
                case 'Date':
                    return !(/^[1-2]\d{3}\/((01|03|05|07|08|10|12)\/(0[1-9]|[1-2]\d{1}|3[0-1])|(02|04|06|09|11)\/(0[1-9]|[1-2]\d{1}|30)|(0[1-9]|1[0-2]))$/).test(str);
                case 'EMail':
                    return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
            }
            if (type !== 'else') col.val(str);
        }
        if(!str && isRequired) {
            _errormsg.push(colName);
            col.addClass('invalidInput');
            if (colName === '出生地') $('.birthContinent').addClass('invalidInput');
            if (colName === '僑居地國別') $('.residentLocation').addClass('invalidInput');
        }
        return;
    }

    // 送出前檢查
    async function _validataForm() {
        _errormsg = [];
        const disabilityLevel = ['極重度','重度','中度','輕度'] // 身心障礙程度
        let disabilityCategory = "" // 給後端的身心障礙類別
        // 申請人
        _checkValue($name,'Chinese','姓名（中）',true);
        _checkValue($engName,'English','姓名（英）',true);
        _checkValue($(".gender:checked"),'else','性別',true);
        _checkValue($birthday,'Date','生日',true);
        _checkValue($birthLocation,'else','出生地',true);
        _checkValue($proposeGroup,'General');

        if(!$(".special:checked").val()) {
            _errormsg.push('身心障礙選項');
        } else if ($(".special:checked").val() === "1") {
            if($disabilityCategory.val() !== "-1" && !_disabilityCategoryList.includes($disabilityCategory.val())) {
                _errormsg.push('身心障礙類別錯誤');
            } else if($disabilityCategory.val() === "-1" && _checkValue($otherDisabilityCategory,'General')) {
                _errormsg.push('其他身心障礙類別說明');
            } else if($disabilityCategory.val() === "-1" && $otherDisabilityCategory.val()){
                disabilityCategory = $otherDisabilityCategory.val();
            } else {
                disabilityCategory = $disabilityCategory.val();
            }
            if(!disabilityLevel.includes($disabilityLevel.val())) _errormsg.push('身心障礙程度錯誤');
        }

        // 僑居地
        _checkValue($residentLocation,'else','僑居地國別',true);
        _checkValue($residentId,'IdNumber','僑居地身分證號碼',true,$residentLocation.val());
        if ($residentPassportNo.val()) _checkValue($residentPassportNo,'IdNumber','僑居地護照號碼',true);
        _checkValue($residentPhoneCode,'Number','僑居地電話國碼',true);
        _checkValue($residentPhone,'Number','僑居地電話號碼',true);
        _checkValue($residentCellphoneCode,'Number','僑居地手機國碼',true);
        _checkValue($residentCellphone,'Number','僑居地手機號碼',true);
        _checkValue($residentAddress,'General','僑居地地址',true);

        // 學歷
        _checkValue($educationSystemDescription,'General','學制描述',true);
        _checkValue($schoolNameSelect,'General','學校名稱',_hasSchoolLocate);
        _checkValue($schoolNameText,'General','學校名稱',!_hasSchoolLocate);
        _checkValue($schoolType,'else','學校類別',_hasEduType);
        _checkValue($schoolLocation,'else','學校所在地',_hasEduType);
        _checkValue($schoolAdmissionAt,'General','入學時間',true);
        _checkValue($schoolGraduateAt,'General','畢業時間',true);

        // 父
        _checkValue($dadStatus,'else','父親存歿',true);
        if(_currentDadStatus !== "undefined"){
            _checkValue($dadName,'Chinese','父親姓名（中）',true);
            _checkValue($dadEngName,'English','父親姓名（英）',true);
            _checkValue($dadBirthday,'Date','父親生日',true);
            if(_currentDadStatus === "alive") {
                _checkValue($dadJob,'General','父親職業',true);
                _checkValue($dadPhoneCode,'Number','父親聯絡電話國碼',true);
                _checkValue($dadPhone,'Number','父親聯絡電話號碼',true);
            }
        }
        // 母
        _checkValue($momStatus,'else','母親存歿',true);
        if(_currentMomStatus !== "undefined"){
            _checkValue($momName,'Chinese','母親姓名（中）',true);
            _checkValue($momEngName,'English','母親姓名（英）',true);
            _checkValue($momBirthday,'Date','母親生日',true);
            if(_currentMomStatus === "alive") {
                _checkValue($momJob,'General','母親職業',true);
                _checkValue($momPhoneCode,'Number','母親聯絡電話國碼',true);
                _checkValue($momPhone,'Number','母親聯絡電話號碼',true);
            }
        }
        // 父母皆為「不詳」，須填寫監護人資料
        if (_currentMomStatus === "undefined" && _currentMomStatus === "undefined") {
            _checkValue($guardianName,'Chinese','監護人姓名（中）',true);
            _checkValue($guardianEngName,'English','監護人姓名（英）',true);
            _checkValue($guardianBirthday,'Date','監護人生日',true);
            _checkValue($guardianJob,'General','監護人職業',true);
            _checkValue($guardianPhoneCode,'Number','監護人聯絡電話國碼',true);
            _checkValue($guardianPhone,'Number','監護人聯絡電話號碼',true);
        }
        // 在臺資料（選填）轉換字串
        if ($taiwanIdNo.val() !== "") _checkValue($taiwanIdNo,'IdNumber','在臺證件號碼',true,$taiwanIdType.val());
        _checkValue($taiwanPassport,'IdNumber','臺灣護照號碼');
        _checkValue($taiwanPhone,'Number');
        _checkValue($taiwanAddress,'General');
        // 在臺聯絡人（選填）轉換字串
        _checkValue($twContactName,'Chinese');
        _checkValue($twContactRelation,'General');
        _checkValue($twContactPhone,'Number');
        _checkValue($twContactAddress,'General');
        _checkValue($twContactWorkplaceName,'General');
        _checkValue($twContactWorkplacePhone,'Number');
        if(_errormsg.length > 0) {
            return false;
        } else {
            return {
                name: $name.val(),
                eng_name: $engName.val(),
                gender: $(".gender:checked").val(),
                birthday: $birthday.val(),
                birth_location: $birthLocation.val(),
                special: $(".special:checked").val(),
                disability_category: disabilityCategory,
                disability_level: ($(".special:checked").val() === "1")? $disabilityLevel.val() : "",
                propose_group: $proposeGroup.val(),
                resident_location: $residentLocation.val(),
                resident_id: $residentId.val(),
                resident_passport_no: ($residentPassportNo.val() === null)? "" : $residentPassportNo.val(),
                resident_phone: $residentPhoneCode.val() + '-' + $residentPhone.val(),
                resident_cellphone: $residentCellphoneCode.val() + '-' + $residentCellphone.val(),
                resident_address: $residentAddress.val(),
                taiwan_id_type: ($taiwanIdType === null)? "" : $taiwanIdType.val(),
                taiwan_id: ($taiwanIdNo === null)? "" : $taiwanIdNo.val(),
                taiwan_passport: ($taiwanPassport === null)? "" : $taiwanPassport.val(),
                taiwan_phone: ($taiwanPhone === null)? "" : $taiwanPhone.val(),
                taiwan_address: ($taiwanAddress === null)? "" : $taiwanAddress.val(),
                education_system_description: $educationSystemDescription.val(),
                school_country: $schoolCountry.val(),
                school_type: (_hasEduType)? $schoolType.val():'',
                school_locate: (_hasEduType)? $schoolLocation.val():'',
                school_name: (_hasSchoolLocate)? $schoolNameSelect.val() : $schoolNameText.val(),
                school_admission_at: $schoolAdmissionAt.val(),
                school_graduate_at: $schoolGraduateAt.val(),
                dad_status: _currentDadStatus,
                dad_name: (_currentDadStatus === "undefined") ?"" :$dadName.val(),
                dad_eng_name: (_currentDadStatus === "undefined")? "" : $dadEngName.val(),
                dad_birthday: (_currentDadStatus === "undefined")? "" : $dadBirthday.val(),
                dad_job: (_currentDadStatus === "alive")? $dadJob.val() : "",
                dad_phone: (_currentDadStatus === "alive")? $dadPhoneCode.val() + "-" + $dadPhone.val() : "",
                mom_status: _currentMomStatus,
                mom_name: (_currentMomStatus !== "undefinded")? $momName.val() : "",
                mom_eng_name: (_currentMomStatus !== "undefined")? $momEngName.val() : "",
                mom_birthday: (_currentMomStatus !== "undefined")? $momBirthday.val() : "",
                mom_job: (_currentMomStatus === "alive")? $momJob.val() : "",
                mom_phone: (_currentMomStatus === "alive")? $momPhoneCode.val() + "-" + $momPhone.val() : "",
                guardian_name: $guardianName.val(),
                guardian_eng_name:$guardianEngName.val(),
                guardian_birthday:$guardianBirthday.val(),
                guardian_job:$guardianJob.val(),
                guardian_phone:$guardianPhoneCode.val() + "-" + $guardianPhone.val(),
                tw_contact_name: ($twContactName === null)? "" : $twContactName.val(),
                tw_contact_relation: ($twContactRelation === null)? "" : $twContactRelation.val(),
                tw_contact_phone: ($twContactPhone === null)? "" : $twContactPhone.val(),
                tw_contact_address: ($twContactAddress === null)? "" : $twContactAddress.val(),
                tw_contact_workplace_name: ($twContactWorkplaceName === null)? "" : $twContactWorkplaceName.val(),
                tw_contact_workplace_phone: ($twContactWorkplacePhone === null)? "" : $twContactWorkplacePhone.val(),
            };
        }
    }
})();
