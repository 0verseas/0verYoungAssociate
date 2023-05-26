(() => {

	/**
	*	cache DOM
	*/

	/**
	*	init
	*/
	loading.complete();
	_init();

	/**
	*	bind event
	*/

	async function _init() {
		// $('.correction-form-link').attr("href",env.baseUrl+"/admission-data-correction-form/young-associate");
		student.getStudentRegistrationProgress()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			if(!json.has_qualify) {
				swal({title:`請先完成資格檢視`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './qualify.html';
				});
			} else if(!json.has_personal_info) {
				swal({title:`請先完成個人基本資料填寫`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './personalInfo.html';
				});
			} else if(!json.has_admission) {
				swal({title:`請先完成志願選填組`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './admission.html';
				});
			} else if(json.confirmed_at == null){
				swal({title:`尚未確認並鎖定個人基本資料，資料確認不須更改後，請按下「確認並鎖定個人基本資料」按鈕。`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './result.html';
				});
			}
			loading.complete();
		})
		.then(() => {
			$('#btn-smart').attr('href', env.baseUrl + '/young-associate/print-admission-paper');
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
	}

})();
