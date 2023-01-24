function getUserInfo(){
var requestUri='';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user = urlParams.get('user');
var recuserid;

if(user =='' || user ==null){
recuserid = _spPageContextInfo.userId;
}
else{
recuserid =user;
}

var userid= recuserid;
  var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";
  var requestHeaders = { "accept" : "application/json;odata=verbose" };
  $.ajax({
    url : requestUri,
    contentType : "application/json;odata=verbose",
    headers : requestHeaders,
    success : onSuccess,
    error : onError
  });

  function onSuccess(data, request){
    var loginName = data.d.LoginName;
    loginName = loginName.substring(loginName.indexOf("\\") + 1);
 		fillCard(loginName);
 
  }

  function onError(error) {
    alert("error");
  }





function fillCard(user){
$.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='opengroup\\"+user+"'",
        type: "GET",
        headers: { "ACCEPT": "application/json;odata=verbose" },
        async: false,
        success: function (data) {          
            var properties = data.d.UserProfileProperties.results; 
            console.log(properties);
 
            getSkills();
  			for (var i = 0; i < properties.length; i++) {
                if (properties[i].Key == "PictureURL") {  
                    var photoUrl= properties[i].Value;
                    $('.userPhoto').attr('src', "http://portal.pallet.ru/my/User%20Photos/Profile%20Pictures/smirnovda_MThumb.jpg");
                }

                if (properties[i].Key == "PreferredName") {  
                    var userFIO= properties[i].Value;
                    $('.userFIO').text(userFIO);
                }
                if (properties[i].Key == "Office") {  
                    var office= properties[i].Value;
                    $('.city').text(office);
                }
                if (properties[i].Key == "WorkEmail") {  
                    var workEmail= properties[i].Value;
                    $('.workEmail').text(workEmail);
                }
                if (properties[i].Key == "WorkPhone") {  
                    var workPhone= properties[i].Value;
                    $('.workPhone').text(workPhone);
                }
                if (properties[i].Key == "CellPhone") {  
                    var cellPhone= properties[i].Value;
                    $('.cellPhone').text(cellPhone);
                }
            }         
        },
        error: function () {
            //alert("Failed to get details");                
        }
    });
}
}



    





function getSkills() {
            var historyArray=[];
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const user = urlParams.get('user');
			var recuserid;
			
			if(user =='' || user ==null){
			recuserid = _spPageContextInfo.userId;
			$('.tohide').show();
			$('.wallet').show();
			}
			else{
			recuserid =user;
			$('.tohide').hide();
			$('.wallet').hide();
			}
            var clientContext = new SP.ClientContext.get_current();
            var oList = clientContext.get_web().get_lists().getByTitle('Исполнители');
            console.log(oList);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='HEexecutor' LookupId='TRUE'/><Value Type='Lookup'>" + recuserid + "</Value></Eq></Where></Query></View>");
            var collListItem = oList.getItems(camlQuery);
            clientContext.load(oList);
            clientContext.load(collListItem);
            clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceededOffice), Function.createDelegate(this, onQueryFailedOffice));
            function onQuerySucceededOffice(sender, args) {

                var listItemEnumerator = collListItem.getEnumerator();
                console.log(listItemEnumerator)
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                   $('.skills').text(oListItem.get_item('HEskills'));
                   $('.money').text(oListItem.get_item('HEOpenCoinWallet'));
                   $('.position').text(oListItem.get_item('HEposition'));
                   $('.department').text(oListItem.get_item('HEdepartment'));
                   $('.money').append('<img style="width:40px"src="http://portal.pallet.ru/requests/SiteAssets/dist/helpexchange/imgs/coin.jpg"/>');
     			   //$('.skills').attr('href','http://portal.pallet.ru/requests/Lists/Executors/EditForm.aspx?ID='+oListItem.get_item('ID'));
     			    			   
     			   for (var i = 0; i < oListItem.get_item('HELookupHistoryArray').length; i++) {
				    historyArray.push(oListItem.get_item('HELookupHistoryArray')[i]);				 
				}

                }
                
                $('.edit').click(function(){
                openEditDial(oListItem.get_item('ID'));
                });
                
                 for (var i = 0; i < historyArray.length; i++) {
				 
				    $('.closedTasks').append("<a href='http://portal.pallet.ru/requests/Lists/HelpExchange/DispForm.aspx?ID="+historyArray[i].get_lookupId()+"'><p class='mb-1' style='font-size: .77rem;'>"+historyArray[i].get_lookupValue()+"</p></a><hr>")
				    				 
				}

                
				console.log(historyArray);
				getCurrentTasks();
                 
            }

            function onQueryFailedOffice(sender, args) {

                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }

        };



function getCurrentTasks() {
            var historyArray=[];
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const user = urlParams.get('user');
			var recuserid;
			
			if(user =='' || user ==null){
			recuserid = _spPageContextInfo.userId;
			}
			else{
			recuserid =user;
			}
            var clientContext = new SP.ClientContext.get_current();
            var oList = clientContext.get_web().get_lists().getByTitle('Биржа Помощи');
            console.log(oList);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml("<View><Query><Where><And><Eq><FieldRef Name='HelpExchangeExecutors' LookupId='TRUE'/><Value Type='Lookup'>" + recuserid + "</Value></Eq><Neq><FieldRef Name='OgStatus'/><Value Type='Text'>Закрыта</Value></Neq></And></Where></Query></View>");
            var collListItem = oList.getItems(camlQuery);
            clientContext.load(oList);
            clientContext.load(collListItem);
            clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceededOffice), Function.createDelegate(this, onQueryFailedOffice));
            function onQuerySucceededOffice(sender, args) {

                var listItemEnumerator = collListItem.getEnumerator();
                console.log(listItemEnumerator)
                while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                   console.log(oListItem.get_item('Title'));
 
	          $('.openTasks').append("<a href='http://portal.pallet.ru/requests/Lists/HelpExchange/DispForm.aspx?ID="+oListItem.get_item('ID')+"'><p class='mb-1' style='font-size: .77rem;'>"+oListItem.get_item('Title')+"</p></a><hr>")
				    
                }
                
				
                 
            }

            function onQueryFailedOffice(sender, args) {

                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }

        };



function openEditDial(recId){
var options = {
    url: 'http://portal.pallet.ru/requests/Lists/Executors/EditForm.aspx?ID='+recId,
    title: 'Редактирование карточки',
    allowMaximize: false,
    showClose: true,
    width: 800,
    height: 750,
    dialogReturnValueCallback: function(result){
        if (result == SP.UI.DialogResult.OK) {
            window.location.reload();
        }
        if (result == SP.UI.DialogResult.cancel) {
            console.log('Cancel');
        }
    }

  };    
   SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);


}










