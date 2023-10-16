(() => {

	/**
	*	cache DOM
	*/
	const $logoutBtn = $('#btn-logout'); //登出按鈕
	const $mailResendBtn = $('#btn-mailResend'); //重寄驗證信按鈕
	const $checkBtn = $('#btn-all-set'); //確認並鎖定報名基本資料按鈕
	const $afterConfirmZone = $('#afterConfirmZone'); //確認並鎖定報名基本資料後區域

	/**
	* init
	*/
	// get progress
	student.getStudentRegistrationProgress()
	.then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw res;
		}
	})
	.then((json) => {
		!!json || location.replace('./');
		_setEmailVerifyAlert(json);
		_setProgress(json);
		_setHeader(json);
		_checkConfirm(json);
	})
	.catch(async (err) => {
		console.error(err);
        if (err.status && err.status === 401) {
			await swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
			.then(()=>{
				location.href = "./index.html";
			});
        } else {
            err.json && err.json().then((data) => {
                console.error(data);
                swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            })
        }
	});

	/**
	*	bind event
	*/
	$logoutBtn.on('click', _handleLogout);
	$mailResendBtn.on('click', _handleResendMail);
	$checkBtn.on('click', _checkAllSet);

	//登出處理
	function _handleLogout() {
		loading.start();
		student.logout()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			swal({title: `登出成功。`, type:"success", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
			});
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				swal({title: `ERROR`, type:"error", text: data.messages[0], confirmButtonText: '確定', allowOutsideClick: false});
			})
			loading.complete();
		})
	}

	//重寄驗證信處理
	function _handleResendMail() {
		loading.start();
		student.resendEmail()
		.then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then(async (data) => {
			await swal({title: `已寄出驗證信，請至填寫信箱查看。`, type:"info", confirmButtonText: '確定', allowOutsideClick: false})
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
			});
			loading.complete();
		})
	}

	function _setEmailVerifyAlert(data) {
		if (!data.email_verified) {
			$('.alert-emailVerify').show();
		}
	}

	function _setProgress(data) {
		// 資格驗證
		if (!!data.has_qualify) {
			$('.nav-qualify').addClass('list-group-item-success');
		}

		// 個人基本資料
		!!data.has_personal_info && $('.nav-personalInfo').addClass('list-group-item-success');

		if(data.has_qualify ===false){
			// 學生還沒有完成資格檢視時，出現提示訊息（請先完成資格檢視）
			$('.nav-personalInfo').addClass('disabled');
			$('.nav-personalInfo').addClass('show-qualify-first');
			$('.nav-personalInfo').click(function(e){e.preventDefault();});
			$('.nav-personalInfo').attr("href", '');
		}

		// 分發志願
		!!data.has_admission && $('.nav-admission').addClass('list-group-item-success');

		// 分發志願
		!!data.has_uploaded && $('.nav-upload').addClass('list-group-item-success');

		if(data.is_opening === false){
			// 學生沒有在開放期間時，出現提示訊息（非開放時間）
			$('.nav-admission').addClass('disabled');
			$('.nav-admission').addClass('show-deadline');
			$('.nav-admission').click(function(e){e.preventDefault();});
			$('.nav-admission').attr("href", '');

			$('.nav-upload').addClass('disabled');
			$('.nav-upload').addClass('show-deadline');
			$('.nav-upload').click(function(e){e.preventDefault();});
			$('.nav-upload').attr("href", '');
		} else if(data.has_personal_info === false){
			// 學生有在開放期間時，但沒有填個人基本資訊時，出現提示訊息（請先填寫個人基本資訊）
			$('.nav-admission').addClass('disabled');
			$('.nav-admission').addClass('show-personal-info-first');
			$('.nav-admission').click(function(e){e.preventDefault();});
			$('.nav-admission').attr("href", '');

			$('.nav-upload').addClass('disabled');
			$('.nav-upload').addClass('show-personal-info-first');
			$('.nav-upload').click(function(e){e.preventDefault();});
			$('.nav-upload').attr("href", '');
		}

		//志願檢視
		if(data.has_admission===false){
			$('.nav-result').addClass('disabled');
			$('.nav-result').addClass('show-admission-first');
			$('.nav-result').click(function(e){e.preventDefault();});
		}
	}

	function _setHeader(data) {
		const systemMap = ['','二年制副學士班', '四年制產學合作學士班'];
		const system_id = (data.system_id) ?data.system_id :0;
		//因為 身份別 是固定的，所以要處理報名序號跟報名層級
		data.system_id
		student.setHeader({
			system: systemMap[system_id],
			id: (data.user_id).toString().padStart(6, "0")
		});
	}

	function _checkAllSet() {
		swal({
			title: '確認後就「無法再次更改資料」，您真的確認送出嗎？',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#5cb85c',
			cancelButtonColor: '#dc3454',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			reverseButtons: true
		})
		.then( (result)	=>{
			//console.log(result);
			if(result){
				const data = {
					"confirmed": true
				};
				student.dataConfirmation(data)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					// console.log(json);
					swal({title: `成功確認資料。`, text:"如果需要再修改資料請利用「資料修正表」，或是重新申請一組新的帳號。", type:"success", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=>{
						location.href = "./download.html";
					});
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
							swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
						})
					}
					loading.complete();
				});
			} else { //取消
				return;
			}
		});
	}

	function  _checkConfirm(json) {
		if (!!json.confirmed_at) {
			$checkBtn.removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已確認並鎖定報名基本資料').show() && $afterConfirmZone.show();
		} else if (!json.has_qualify) {
			// 沒有輸入資格驗證的狀況下，隱藏提交按鈕
			$checkBtn.hide();
		} else if ( !json.has_personal_info) {
			// 個人基本資料未填寫者，隱藏提交按鈕
			$checkBtn.hide();
		} else if (!json.has_admission) {
			// 志願類組未選擇者，隱藏提交按鈕
			$checkBtn.hide();
		} else if (!json.is_opening) {
			// 還沒有確認並鎖定報名基本資料，且不在報名期間內，不能點送出完成填報按鈕
			$checkBtn.prop('disabled', true).text('目前非報名時間').show();
		} else if (!json.has_uploaded) {
			// 未上傳簡章規定必繳文件者，隱藏提交按鈕
			$checkBtn.prop('disabled', true).show();
		} else {
			$checkBtn.show();
		}
	}

})();
