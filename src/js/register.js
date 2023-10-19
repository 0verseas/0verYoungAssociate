(() => {
	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + env.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

	/**
	*	private variable
	*/
	let _emailValid = false;
	let _passValid = false;
	let _passwordComplex = false;  // 密碼複雜度檢查

	/**
	*	cache DOM
	*/
	const $Register = $('.Register');
	const $email = $Register.find('#Register__inputEmail');
	const $password = $Register.find('#Register__inputPassword');
	const $passwordConfirm = $Register.find('#Register__inputPasswordConfirm');
	const $registerBtn = $Register.find('.Register__btnRegister');
	const $passwordWarning = $('#password-warning');
	const $agreePersonalProtectionLaw = $('#agreePersonalProtectionLaw');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$email.on('blur', _checkEmail);
	$password.on('blur', _checkPassword);
	$passwordConfirm.on('blur', _checkPassword);
	$registerBtn.on('click', _handleSubmit);
	$agreePersonalProtectionLaw.on('change',agreeBoxChange);

	/**
	*	private method
	*/

	function _init() {
		loading.complete();
	}

	function _checkEmail() {
		const email = $email.val();
		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
			$email.addClass('invalidInput');
			_emailValid = false;
		} else {
			$email.removeClass('invalidInput');
			_emailValid = true;
		}
	}

	function _checkPassword() {
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();

		// 判斷密碼長度
		if (oriPass.length >= 8 && checkPasswordComplex(oriPass)) {
			$password.removeClass('invalidInput');
			$passwordWarning.hide();
			_passValid = true;
			_passwordComplex = true;
		} else {
			$password.addClass('invalidInput');
			$passwordWarning.show();
			_passValid = false;
			_passwordComplex = false
		}

		// 判斷確認密碼長度與以及是否與密碼相同
		if ((passConfirm.length >= 8) && (passConfirm === oriPass)) {
			$passwordConfirm.removeClass('invalidInput');
			_passValid = true;
		} else {
			$passwordConfirm.addClass('invalidInput');
			_passValid = false;
		}
	}

	function _handleSubmit() {
		const email = $email.val();
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();

		if (!_emailValid) {
			swal({title: `信箱格式錯誤。`, type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			return;
		}

		if (!_passwordComplex){
			swal({title: `密碼複雜度不足`, type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			return;
		}

		if (!_passValid) {
			swal({title: `密碼格式錯誤，或「確認密碼」與「密碼」內容不符。`, type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			return;
		}

		const data = {
			email: email,
			password: sha256(oriPass),
			password_confirmation: sha256(passConfirm),
			google_recaptcha_token: ''
		}
		loading.start();
		grecaptcha.ready(function() {
            grecaptcha.execute(env.reCAPTCHA_site_key, {
              action: 'MalaysiaSpringRegister'
            }).then(function(token) {
                data.google_recaptcha_token=token;
            }).then(function(){
				student.register(data)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					location.href="./qualify.html";
					loading.complete();
				})
				.catch((err) => {
					if (err.status === 429){  // 註冊太多次啦 Too Many Requests
						err.json && err.json().then((data) => {
							console.error(data);
							swal({title: `警告`, type:"warning", text: data.messages[0], confirmButtonText: '確定', allowOutsideClick: false});
						})
					} else {
						err.json && err.json().then((data) => {
							console.error(data);
							swal({title: `ERROR`, type:"error", text: data.messages[0], confirmButtonText: '確定', allowOutsideClick: false});
						})
					}
					loading.complete();
				})
			});
        });
	}

	// 是否同意個資法
	function agreeBoxChange() {
		if(!$agreePersonalProtectionLaw[0].checked){  // 沒勾選
			$registerBtn[0].disabled = true;
		} else {
			$registerBtn[0].disabled = false;
		}
	}

	// 確認密碼複雜度
	function checkPasswordComplex(input) {
		// 至少8碼且大寫、小寫、數字或特殊符號（數字那一排不含反斜線和豎線）至少兩種
		// ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=]).{8,}$
		const reg = /^((?=.*\d)(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-z])|(?=.*\d)(?=.*[~!@#$%^&*()_+\-=])|(?=.*[a-z])(?=.*[~!@#$%^&*()_+\-=])|(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=])).{8,}$/;
		return !!reg.test(input);
	}

})();
