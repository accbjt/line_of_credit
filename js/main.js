var submissionCount = 0;

var Submission = {
	creditLine: 0,
	amount: 0,
	apr: 0,
	day: 0,
	payment: null,
	totalOwed: 0,
	create: function(inputs){
		var self = this;
		var newInputs = inputs.map(function(input){
											if(this.type !== 'radio'){
												return this;
											}
								    });

		newInputs.each(function(){
			self[this.name] = this.valueAsNumber;
		});

		this.payment = $('input:checked')[0].name === 'payment' ? true : false; 

		$('.total-section').before(this.renderTableRow());

		this.total();
		this.totalCreditLeft();

		$($('form')[1]).children('input').val('');
		$('input[type="radio"]').prop('checked', false);
	},
	date: function(){
		return "September "+this.day+", 2015"
	},
	aprToDecimal: function(){
		return parseFloat(this.apr)/100
	},
	daysCharged: function(){
		return this.day === 1 ? this.daysInAMonth()-this.day+1 : this.daysInAMonth()-this.day;
	},
	daysInAYear: function(){
		return 365
	},
	daysInAMonth: function(){
		return 30
	},
	interestCharged: function(){
		var calculation = this.amount * this.aprToDecimal() / this.daysInAYear() * this.daysCharged();

		return parseFloat(calculation);
	},
	totalCharges: function(){
		var calculation = this.interestCharged()+this.amount;

		if(this.payment){
			var calculation = -calculation;
		};

		return calculation;
	},
	renderTableRow: function(){
		return $([
							"<tr>",
							"  <td>"+this.date()+"</td>",
							"  <td>$"+this.amount+"</td>",
							"  <td>"+this.daysCharged().toFixed(2)+"</td>",
							"  <td>$"+this.interestCharged().toFixed(2)+"</td>",
							"  <td class='total' data-total='"+this.totalCharges()+"'>$"+this.totalCharges().toFixed(2)+"</td>",
							"</tr>"
						].join("\n"));
	},
	total: function(){
		var totalAmount = 0;

		$('.total').each(function(i){
			totalAmount = totalAmount+parseFloat(this.dataset.total);
		});

		this.totalOwed = parseFloat(totalAmount);

		$('.total-amount').empty();
		$('.total-amount').append("$"+parseFloat(totalAmount).toFixed(2));
	},
	totalCreditLeft: function(){
		var creditLine = parseFloat($('input[name="creditLine"]').val());
		var totalCredit = creditLine-this.totalOwed;

		$('.total-credit').empty();
		$('.total-credit').append("$"+totalCredit.toFixed(2));
	}
};

$('.submit').on('click', function(e){
	var Entry = Object.create(Submission);
	Entry.create($('input'));
});

$('input[type="radio"]').on('click', function(e){
	$(this).siblings('[type="radio"]')[0].checked = false;
});