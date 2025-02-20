(() => {

	/**
	*	cache DOM
	*/

	const $resetPasswordBtn = $('#btn-resetPassword');
	const $email = $('#email');

	/**
	*	init
	*/

	_init();

	$resetPasswordBtn.on('click', _handleResetPassword);

	/**
	*	bind event
	*/

	function _init() {
		loading.complete();
	}

	function _handleResetPassword() {

		const email = $email.val();

		if (_checkEmail(email)) {
			const data = {
				email
			}
			student.sendResetPassword(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then(() => {
				swal({title: `信件已送出，請至信箱確認。`, type:"info", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					// console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});

				})
				loading.complete();
			});
		} else {
			swal({title: `信箱格式錯誤`, type:"error", confirmButtonText: '確定', allowOutsideClick: false});
		}
	}

	function _checkEmail() {
		const email = $email.val();
		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
			return false;
		} else {
			return true
		}
	}

})();
