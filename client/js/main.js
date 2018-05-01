$(document).ready(function(){
	$('.deleteCustomer').on('click', deleteCustomer);
});

function deleteCustomer(){
	
	var confirmation = confirm("Är du säker?");

	
	if(confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/skapaBokning');
		});
		window.location.replace('/skapaBokning');
	} else {
		return false;
	}
}
