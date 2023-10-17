(() => {
	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + env.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

	/**
	*	cache DOM
	*/
	const $registerNum = $('#registerNum');
	const $email = $('#email');
	const $pass = $('#password');
	const $loginBtn = $('#btn-login');
	const $downloadLinks = $('#download-links');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$loginBtn.on('click', _handleLogin);
	$pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); }); //原本沒驗證碼 所以就密碼輸入欄位判斷是否有按enter的鍵盤事件

	/**
	*	event handlet
	*/

	async function _init() {
		try {
            $downloadLinks.append(
                '<a href="https://get.adobe.com/tw/reader/" target="_blank" class="list-group-item list-group-item-action">觀看中文PDF軟體</a>\n' +
                '<a href="https://www.7-zip.org/" target="_blank" class="list-group-item list-group-item-action">解壓縮軟體</a>\n' +
                '<a href="' + env.baseUrl + '/admission-data-correction-form/young-associate" target="_blank" class="list-group-item list-group-item-action">報名資料修正表</a>'
			);
			const response = await student.getAdmissionCount();
			if (!response.ok) { throw response; }
			const admissionCount = await response.json();
			$registerNum.text(admissionCount);
		} catch (e) {
			console.log(e);
		}

		loading.complete();
	}

	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();

		const loginData = {
			email: email,
			password: sha256(pass),
			google_recaptcha_token: ''
		};
		grecaptcha.ready(function() {
            grecaptcha.execute(env.reCAPTCHA_site_key, {
              action: 'YoungAssociateLogin'
            }).then(function(token) {
                // token = document.getElementById('btn-login').value
                loginData.google_recaptcha_token=token;
            }).then(function(){
				loading.start();
				student.login(loginData)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res.status;
					}
				})
				.then((json) => {
					if(!json.has_qualify) {
						location.href = './qualify.html';
					} else if(!json.has_personal_info) {
						location.href = './personalInfo.html';
					} else if(!json.has_admission) {
						if(json.is_opening){
							location.href = './admission.html';
						} else {
							location.href = './personalInfo.html';
						}
					}  else if(!json.has_uploaded) {
						if(json.is_opening){
							location.href = './upload.html';
						} else {
							location.href = './personalInfo.html';
						}
					} else if(json.confirmed_at === null){
						location.href = './result.html';
					} else {
						location.href = './download.html';
					}
					loading.complete();
				})
				.catch((err) => {
					err === 401 && swal({title:`帳號或密碼輸入錯誤。`, confirmButtonText:'確定', type:'error'});
					err === 403 && swal({title:`Google reCaptcha Failed，請稍等五分鐘後再嘗試或寄信到海外聯招會信箱詢問。`, confirmButtonText:'確定', type:'error'});
					err === 429 && swal({title:`登入錯誤次數太多，請稍後再試。`, confirmButtonText:'確定', type:'error'});
					loading.complete();
				});
			});
        });
	}

})();
