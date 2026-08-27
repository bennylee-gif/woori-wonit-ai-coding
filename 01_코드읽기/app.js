// 사용자 계좌 목록 데이터
const accountList = [
	{
		accountId: 1,
		accountNo: "1002-345-678901",
		accountType: "입출금",
		balance: 1523000,
		status: "정상",
		ownerName: "김연지"
	},
	{
		accountId: 2,
		accountNo: "1002-345-112233",
		accountType: "적금",
		balance: 1200000,
		status: "정상",
		ownerName: "김연지"
	},
	{
		accountId: 3,
		accountNo: "1002-345-998877",
		accountType: "청약",
		balance: 397000,
		status: "휴면",
		ownerName: "김연지"
	}
];

// 계좌에서 발생한 거래내역 데이터
const transactionList = [
	{ txId: 10, txType: "출금", amount: 45000, category: "쇼핑", memo: "온라인쇼핑몰 결제", counterparty: "쿠팡", txDatetime: "2026-08-25T18:42:00" },
	{ txId: 9, txType: "출금", amount: 12000, category: "식비", memo: "점심 식사", counterparty: "김밥천국", txDatetime: "2026-08-25T12:15:00" },
	{ txId: 8, txType: "입금", amount: 3200000, category: "급여", memo: "8월 급여", counterparty: "(주)원아이티", txDatetime: "2026-08-25T09:00:00" },
	{ txId: 7, txType: "출금", amount: 55000, category: "통신", memo: "휴대폰 요금", counterparty: "SK텔레콤", txDatetime: "2026-08-24T10:20:00" },
	{ txId: 6, txType: "출금", amount: 1800, category: "교통", memo: "버스 이용", counterparty: "서울교통공사", txDatetime: "2026-08-23T08:05:00" },
	{ txId: 5, txType: "출금", amount: 89000, category: "의료", memo: "치과 진료비", counterparty: "미소치과", txDatetime: "2026-08-22T15:30:00" },
	{ txId: 4, txType: "출금", amount: 320000, category: "이체", memo: "월세 이체", counterparty: "박집주인", txDatetime: "2026-08-21T09:10:00" },
	{ txId: 3, txType: "출금", amount: 68000, category: "쇼핑", memo: "생필품 구매", counterparty: "이마트", txDatetime: "2026-08-20T19:45:00" },
	{ txId: 2, txType: "입금", amount: 150000, category: "이체", memo: "용돈 받음", counterparty: "김엄마", txDatetime: "2026-08-19T11:00:00" },
	{ txId: 1, txType: "출금", amount: 4500, category: "식비", memo: "카페", counterparty: "스타벅스", txDatetime: "2026-08-18T08:30:00" }
];

// 숫자에 천 단위 구분기호와 원 단위 표시를 붙인다.
function formatWon(amount) {
	return amount.toLocaleString("ko-KR") + "원";
}

// 계좌번호 가운데 자리를 마스킹한다.
function maskAccountNumber(accountNumber) {
	const accountParts = accountNumber.split("-");
	const maskedLastPart = accountParts[2].slice(0, 1) + "****" + accountParts[2].slice(-1);

	return accountParts[0] + "-" + accountParts[1] + "-" + maskedLastPart;
}

// 출금 거래만 카테고리별로 모아 금액을 합산한다.
function summarizeWithdrawalsByCategory(transactions) {
	return transactions.reduce((categoryTotals, transaction) => {
		if (transaction.txType === "출금") {
			const category = transaction.category;
			categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
		}

		return categoryTotals;
	}, {});
}

// 거래 유형을 기준으로 거래내역을 필터링한다.
function filterTransactions(transactions, transactionType) {
	return transactionType === "전체"
		? transactions
		: transactions.filter(transaction => transaction.txType === transactionType);
}

// CSS 선택자로 HTML 요소를 찾는다.
const query = selector => document.querySelector(selector);

// 계좌 목록을 화면에 출력한다.
query("#acc").innerHTML = "<h2>계좌 목록</h2>" + accountList.map(account => `
	<div class="row">
		<b>${account.ownerName}</b> · ${account.accountType} · ${maskAccountNumber(account.accountNo)}<br>
		${formatWon(account.balance)} <span class="${account.status === "정상" ? "ok" : "bad"}">${account.status}</span>
	</div>
`).join("");

// 카테고리별 출금 합계를 계산한 뒤 화면에 출력한다.
const categoryTotals = summarizeWithdrawalsByCategory(transactionList);
query("#cat").innerHTML = "<h2>카테고리별 출금 합계</h2>" + Object.keys(categoryTotals).map(category => `
	<div class="row">${category} : ${formatWon(categoryTotals[category])}</div>
`).join("");

// 전체 거래내역을 화면에 출력한다.
const filteredTransactions = filterTransactions(transactionList, "전체");
query("#tx").innerHTML = "<h2>전체 거래내역</h2>" + filteredTransactions.map(transaction => `
	<div class="row">
		${transaction.txDatetime.slice(0, 10)} · ${transaction.memo}<br>
		<span class="${transaction.txType === "입금" ? "ok" : "bad"}">
			${transaction.txType === "입금" ? "+" : "-"}${formatWon(transaction.amount)}
		</span>
	</div>
`).join("");
