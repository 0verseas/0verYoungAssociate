(() => {
	/**
	*	private variable
	*/
	let _countryList = [];
	let _citizenshipList = [];

	/**
	*	cache DOM
	*/
	const $signUpForm = $('#form-signUp');
	const $saveBtn = $signUpForm.find('.btn-save');

	// 海外僑生
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');

	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $alertStayLimitCertif = $signUpForm.find('.alert-stayLimiCertif');

	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');

	const $ethnicChineseRadio = $signUpForm.find('.radio-ethnicChinese');

	const $citizenshipContinentSelect = $signUpForm.find('.select-citizenshipContinent');
	const $citizenshipSelect = $signUpForm.find('.select-citizenshipCountry');
	const $citizenshipList = $('#citizenshipList');
	const citizenshipList = document.getElementById('citizenshipList');

	$signUpForm.find('.question.kangAo').removeClass('hide');

	/**
	*	bind event
	*/
	// $identityRadio.on('change', _handleChangeIdentity);
	$saveBtn.on('click', _handleSave);

	// 海外僑生
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation);
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);
	$ethnicChineseRadio.on('change',_checkEthnicChineseValidation);
	$citizenshipContinentSelect.on('change', _setCitizenshipCountryOption);
	$citizenshipSelect.on('change', _addCitizenship);

	/**
	*	event handler
	*/

	/**
	* init
	*/
	_init();
	loading.complete();

	async function _init() {
		// set Continent & Country select option
		await student.getCountryList().then((data) => {
			_countryList = data;
			$citizenshipContinentSelect.empty();
			$citizenshipContinentSelect.append('<option value="-1" hidden disabled selected>請選擇</option>');
			data.forEach((val, i) => {
				$citizenshipContinentSelect.append(`<option value="${i}">${val.continent}</option>`);
			});
			$citizenshipSelect.selectpicker({title: '請先選擇洲別(Continent)'});
			$citizenshipSelect.attr('disabled',true);
			$citizenshipSelect.selectpicker('refresh');
		});
		// get data
		await student.getVerifyQualification().then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			_setData(json);
		})
		.then(() => {
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				swal({title: `請登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				})
			}
			loading.complete();
		});
		if(document.body.scrollWidth<768)  // 判別網頁寬度 少於768會今入單欄模式
		smoothScroll(document.body.scrollHeight/2.2,800);  // 用整體長度去做計算  滑動到需要填寫欄位位置
	}

	const smoothScroll = (number = 0, time) => {
		if (!time) {
			document.body.scrollTop = document.documentElement.scrollTop = number;
			return number;
		}
		const spacingTime = 20; // 動畫循環間隔
		let spacingInex = time / spacingTime; // 計算動畫次數
		let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 擷取當前scrollbar位置
		let everTop = (number - nowTop) / spacingInex; // 計算每次動畫的滑動距離
		let scrollTimer = setInterval(() => {
			if (spacingInex > 0) {
				spacingInex--;
				smoothScroll(nowTop += everTop); //在動畫次數結束前要繼續滑動
			} else {
				clearInterval(scrollTimer); // 結束計時器
			}
		}, spacingTime);
	};

	// 儲存
	function _handleSave() {
		// 海外僑生
		let tmpString = '';
		_citizenshipList.forEach(object => {
			tmpString += object.id+',';
		});
		const citizenshipString = tmpString.substr(0,tmpString.length-1);
		const isDistribution = +$signUpForm.find('.isDistribution:checked').val();
		const distributionTime = $signUpForm.find('.input-distributionTime').val();
		const distributionOption = +$signUpForm.find('.distributionMoreQuestion:checked').val();
		const stayLimitOption = +$signUpForm.find('.radio-stayLimit:checked').val();
		const hasBeenTaiwan = +$signUpForm.find('.radio-hasBeenTaiwan:checked').val();
		const hasBeenTaiwanOption = +$signUpForm.find('.radio-whyHasBeenTaiwan:checked').val();
		const ethnicChinese = +$signUpForm.find('.radio-ethnicChinese:checked').val();
		const invalidDistributionOption = [4, 5, 6, 7];
		if (!!isDistribution && invalidDistributionOption.includes(distributionOption)) return swal({title:`分發來臺選項不具報名資格`, confirmButtonText:'確定', type:'error'});
		if (!!isDistribution && distributionTime === '') return swal({title:`未填寫分發來臺年份或填寫格式不正確`, confirmButtonText:'確定', type:'error'});
		if (stayLimitOption === 1) return swal({title:`海外居留年限選項不具報名資格`, confirmButtonText:'確定', type:'error'});
		if (!!hasBeenTaiwan && hasBeenTaiwanOption === 9) return swal({title:`在臺停留選項不具報名資格`, confirmButtonText:'確定', type:'error'});
		if (ethnicChinese === 0) return swal({title:`非華裔者不具報名資格`, confirmButtonText:'確定', type:'error'});
		if (! citizenshipString.length>0) return swal({title:`請先選取你的國籍`, confirmButtonText:'確定', type:'error'});// 陣列長度 <= 0 代表沒有選取國籍
		// console.log(`是否曾經分發來臺就學過？ ${!!isDistribution}`);
		// console.log(`曾分發來臺於西元幾年分發來臺？ ${distributionTime}`);
		// console.log(`曾分發來臺請就下列選項擇一勾選 ${distributionOption}`);
		// console.log(`海外居留年限 ${stayLimitOption}`);
		// console.log(`報名截止日往前推算僑居地居留期間內，是否曾在某一年來臺停留超過 120 天？ ${!!hasBeenTaiwan}`);
		// console.log(`在臺停留日期請就下列選項，擇一勾選，並檢附證明文件： ${hasBeenTaiwanOption}`);
		// console.log(`是否為華裔者： ${ethnicChinese}`);

		loading.start();
		student.verifyQualification({
			has_come_to_taiwan: !!isDistribution,
			come_to_taiwan_at: distributionTime,
			reason_of_come_to_taiwan: distributionOption,
			overseas_residence_time: stayLimitOption,
			stay_over_120_days_in_taiwan: !!hasBeenTaiwan,
			reason_selection_of_stay_over_120_days_in_taiwan: hasBeenTaiwanOption,
			is_ethnic_Chinese: ethnicChinese,
			citizenship: citizenshipString,
			force_update: true // TODO:
		})
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then(async(json) => {
			await swal({title:"儲存成功", type:"success", confirmButtonText: '確定'});
			window.location.href = './personalInfo.html';
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				swal({title:`ERROR`, text: data.messages[0], type: `error`, confirmButtonText: '確定', allowOutsideClick: false});
			})
			loading.complete();
		});
	}


	// 判斷是否分發來臺就學的一推選項是否符合資格
	function _checkDistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const validOption = [1, 2, 3];
		$signUpForm.find('.distributionMoreAlert').hide();
		if (validOption.includes(option)) {
			$signUpForm.find('.distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 海外居留年限判斷
	function _checkStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$alertStayLimitCertif.hide();
		$signUpForm.find('.stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
				$alertStayLimitCertif.fadeIn();
				break;
			default:
		}
	}

	// 為何在臺超過一百二十天
	function _checkWhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$('.whyHasBeenTaiwanAlert').hide();
		if (option === 9) {
			$('.whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$('.whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	// 是否為華裔學生
	function _checkEthnicChineseValidation() {
		const $this = $(this);
		const ethnicChinese = +$this.val();
		!!ethnicChinese && $signUpForm.find('.ethnicChineseAlert.invalid').fadeOut();
		!!ethnicChinese || $signUpForm.find('.ethnicChineseAlert.invalid').fadeIn();
	}

	function _switchShowDistribution() {
		const $this = $(this);
		const isDistribution =  +$this.val();
		!!isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	function _checkHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		!!option && $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeIn();
		!!option || $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeOut();
	}

	// 初始化時渲染國籍列表
	function _initCitizenshipList(data){
		const citizenshipIdArray = data.split(',');
		citizenshipIdArray.forEach(value=>{
			let keep = true;
			for(let i=0;i<5 && keep;i++){
				for(let j=0;j<_countryList[i].country.length && keep;j++){
					if(_countryList[i].country[j].id == value){
						_citizenshipList.push( {'continent': i,'id' : value} );
						keep=false;
					}
				}
			}
		});
		_generateCitizenshipList();
		return;
	}

	// 選洲，更換國家選項
	function _setCitizenshipCountryOption() {
		// 取得選取的洲代碼
		const order = $(this).val();
		// reset 國籍列表選單
		$citizenshipSelect.empty();
		// 防止有人選取預設選項
		if (+order === -1) {
			$citizenshipSelect.selectpicker({title: '請先選擇洲別(Continent)'});
            $citizenshipSelect.attr('disabled',true);
			return;
		}
		$citizenshipSelect.selectpicker({title: '請選擇國家'});
		$citizenshipSelect.attr('disabled',false);
		// 渲染選取洲別的國家到下拉式選單中
		_countryList[order].country.forEach((val, i) => {
			if(_citizenshipList.findIndex(order => order.id == val.id) === -1){ // 在已選擇國籍名單中 就不渲染避免重複選取
				$citizenshipSelect.append(`<option value="${val.id}">${val.country}</option>`);
			}
		});
		$citizenshipSelect.selectpicker('refresh');
		$citizenshipSelect.parent().find('button').removeClass('bs-placeholder');
	}

	// 選擇國籍選項 新增至已選擇國籍列表
	function _addCitizenship(){
		// 目前暫定可選國籍上限 20 選超過直接出現提示訊息
		if(_citizenshipList.length < 20 && $(this).val() > 0){
			// 將選擇的洲別與國家代碼儲存
			_citizenshipList.push( {'continent': $citizenshipContinentSelect.val(),'id' : $(this).val()} );
			// 重新渲染已選擇國籍列表
			_generateCitizenshipList();
		} else {
			swal({title: `國籍數量已達上限`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
		}
	}

	// 刪除已選擇國籍列表之國籍
	function _removeCitizenship(){
		// 先提取國家代碼
		const id = $(this).data("id");
		// 用國家代碼搜尋已選擇國籍列表找到Index
		const citizenshipIndex = _citizenshipList.findIndex(order => order.id == id)
		// 使用Index和splice來刪除已選擇國籍
		_citizenshipList.splice(citizenshipIndex,1);
		_generateCitizenshipList();
	}

	// 渲染已選擇國籍列表
	function _generateCitizenshipList(){
		// 每次都清空重新渲染
		let rowHtml = '';
		// 從已選擇國籍列表中處理資料渲染到畫面上
		for(let i in _citizenshipList) {
			// 用已選擇國籍列表中儲存的洲別與國家代碼從儲存的國家列表中找到國家名稱
			let country = _countryList[_citizenshipList[i].continent].country.find(list => list.id == _citizenshipList[i].id).country;
			// 將變數編寫成Html格式的字串
			rowHtml = rowHtml + `
			<tr data-wishIndex="${i}">
				<td style="vertical-align:middle;">
					${country}
				</td>
				<td>
					<button type="button" data-continent="${_citizenshipList[i].continent}" data-id="${_citizenshipList[i].id}" class="btn btn-danger btn-sm remove-citizenship"><i class="fa fa-times" aria-hidden="true"></i></button>
				</td>
			</tr>
			`;
		}
		// 將Html字串選染到已選擇國籍table中
		citizenshipList.innerHTML = rowHtml;
		// 宣告已選擇國籍table中的刪除按鈕並新增點選事件
		const $removeCitizenship = $citizenshipList.find('.remove-citizenship');
		$removeCitizenship.on("click", _removeCitizenship);
		// reset 洲別與國家選項 並清空國家列表 避免重複選取到一樣國家
		$citizenshipContinentSelect.append('<option value="-1" hidden disabled selected>請選擇</option>');
		$citizenshipSelect.empty();
		$citizenshipSelect.selectpicker({title: '請先選擇洲別(Continent)'});
        $citizenshipSelect.attr('disabled',true);
		$citizenshipSelect.selectpicker('refresh');
	}

	/**
	*	private method
	*/

	function _setData(data) {

		// 海外僑生
		// 曾分發來臺
		!!data.has_come_to_taiwan &&
		$signUpForm.find('.isDistribution[value=1]').prop('checked',true).trigger('change') &&
		$signUpForm.find('.input-distributionTime').val(data.is_ethnic_Chinese).trigger('change') &&
		$signUpForm.find(`.distributionMoreQuestion[value=${data.reason_of_come_to_taiwan}]`).prop('checked',true).trigger('change');

		// 是否華裔學生
		$signUpForm.find(`.radio-ethnicChinese[value=${data.overseas_residence_time}]`).prop('checked',true).trigger('change');

		// 海外居留年限
		$signUpForm.find(`.radio-stayLimit[value=${data.overseas_residence_time}]`).prop('checked',true).trigger('change');

		// 在臺停留日期
		!!data.stay_over_120_days_in_taiwan &&
		$signUpForm.find('.radio-hasBeenTaiwan[value=1]').prop('checked',true).trigger('change') &&
		$signUpForm.find(`.radio-whyHasBeenTaiwan[value=${data.reason_selection_of_stay_over_120_days_in_taiwan}]`).prop('checked',true).trigger('change');

		// 國籍
		_initCitizenshipList(data.citizenship);
	}
})();
