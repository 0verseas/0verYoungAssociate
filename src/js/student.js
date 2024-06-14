const student = (() => {

	const baseUrl = env.baseUrl;

	function setHeader(headerData) {
		const $studentInfoHeader = $('#header-studentInfo');
		const $headerSystem = $studentInfoHeader.find('#headerSystem');
		const $headerId = $studentInfoHeader.find('#headerId');

		headerData = headerData || {
			system: "",
			id: "重新整理"
		}

		$headerSystem.html(headerData.system);
		$headerId.html(headerData.id);
	}

	function getAdmissionCount () {
		return fetch(baseUrl + `/young-associate/admission-count`, {
			method: 'GET'
		});
	}

	async function getCountryList() {
		if (localStorage.countryList
			&& localStorage.countryList !== ""
			&& localStorage.countryListExpiration
			&& localStorage.countryListExpiration
			&& localStorage.countryListExpiration > new Date().getTime()) {
			return JSON.parse(localStorage.countryList);
		} else {
			try {
				const response = await fetch(baseUrl + `/country-lists`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});
				if (!response.ok) { throw response; }
				const json = await response.json();

				let group_to_values = await json.reduce(function (obj, item) {
					obj[item.continent] = obj[item.continent] || [];
					obj[item.continent].push({id: item.id, country: item.country});
					return obj;
				}, {});

				let groups = await Object.keys(group_to_values).map(function (key) {
					return {continent: key, country: group_to_values[key]};
				});

				localStorage.countryList = JSON.stringify(groups);
                localStorage.countryListExpiration = new Date().getTime() + (1440 * 60 * 1000);
				return groups;
			} catch (e) {
				console.log('Boooom!!');
				console.log(e);
			}
		}
	}

	function getSchoolList(countryId) {
		return fetch(baseUrl + `/overseas-school-lists?country_id=` + countryId, {
			method: 'GET'
		});
	}

	function register(data) {
		return fetch(baseUrl + `/young-associate/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function isLogin() {
		return fetch(baseUrl + `/young-associate/login`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function login(data) {
		return fetch(baseUrl + `/young-associate/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function logout() {
		return fetch(baseUrl + `/young-associate/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function verifyEmail(email, token) {
		return fetch(baseUrl + `/young-associate/verify-email/${email}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({ token })
		})
	}

	function resendEmail() {
		return fetch(baseUrl + `/young-associate/verify-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function sendResetPassword(data) {
		return fetch(baseUrl + `/young-associate/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function resetPassword(data, email) {
		return fetch(baseUrl + `/young-associate/reset-password/` + email, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function checkResetPasswordToken(email, token) {
		return fetch(baseUrl + `/young-associate/reset-password?email=` + email + `&token=` + token, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	function getStudentPersonalData() {
		return fetch(baseUrl + `/young-associate/personal-data`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentPersonalData(data) {
		return fetch(baseUrl + `/young-associate/personal-data`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	// POST /young-associate/verify-qualification
	function verifyQualification(data) {
		return fetch(`${baseUrl}/young-associate/verify-qualification`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function getVerifyQualification() {
		return fetch(`${baseUrl}/young-associate/verify-qualification`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
	}

	function getAdmissionSelectionOrder() {
		var urls = [
		baseUrl + '/young-associate/admission-order',
		baseUrl + '/young-associate/admission-order-list'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function setAdmissionSelectionOrder(data) {
		return fetch(baseUrl + `/young-associate/admission-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function getOrderResultList(url) {
		return fetch(baseUrl + url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getStudentRegistrationProgress() {
		return fetch(baseUrl + `/young-associate/registration-progress`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function dataConfirmation(data) {
		return fetch(baseUrl + `/young-associate/data-confirmation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}
	//檔案大小計算是否超過 limit MB
	function sizeConversion(size,limit) {
		let maxSize = limit*1024*1024;

		return size >=maxSize;
	}

	function getStudentUploadedAdmissionBrochureRequirmentFiles() {
		return fetch(baseUrl + `/young-associate/admission-paper/files/get`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function uploadAdmissionBrochureRequirmentFiles(data, type) {
		return fetch(baseUrl + `/young-associate/admission-paper/upload/${type}`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
	}

	function deleteStudentUploadedAdmissionBrochureRequirmentFiles(type, name) {
		return fetch(baseUrl + `/young-associate/admission-paper/${type}/${name}`, {
			method: 'DELETE',
			credentials: 'include'
		})
	}

	// 學生想要查榜，去後端看榜單
	function getAdmissionRoster(data) {
		return fetch(baseUrl + `/young-associate/search-admission-roster`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	return {
		setHeader,
		getAdmissionCount,
		getCountryList,
		getSchoolList,
		register,
		isLogin,
		login,
		logout,
		verifyEmail,
		resendEmail,
		sendResetPassword,
		resetPassword,
		checkResetPasswordToken,
		getStudentPersonalData,
		setStudentPersonalData,
		verifyQualification,
		getVerifyQualification,
		getStudentRegistrationProgress,
		getAdmissionSelectionOrder,
		setAdmissionSelectionOrder,
		getOrderResultList,
		dataConfirmation,
		sizeConversion,
		getStudentUploadedAdmissionBrochureRequirmentFiles,
		uploadAdmissionBrochureRequirmentFiles,
		deleteStudentUploadedAdmissionBrochureRequirmentFiles,
		getAdmissionRoster
	};

})();
