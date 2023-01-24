var Podeda;
(function (Podeda) {
    var Pages;
    (function (Pages) {
        var Main = /** @class */ (function () {
            function Main() {
                this.newItem = null;
                this.tasks = ko.observableArray();
                this.executors = ko.observableArray();
                this.init = this.init.bind(this);
                this.getTasks = this.getTasks.bind(this);
                this.getExecutors = this.getExecutors.bind(this);
                this.getTasksSuccessCallback = this.getTasksSuccessCallback.bind(this);
                this.getExecutorsSuccessCallback = this.getExecutorsSuccessCallback.bind(this);
                this.onFailure = this.onFailure.bind(this);
                this.newTask=this.newTask.bind(this);

                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', this.init);
            }
            Main.prototype.init = function () {

                this.getTasks();
                this.showBtn();

            };
            
           Main.prototype.newTask=function(){
           var options = {
		    url: 'http://portal.pallet.ru/requests/Lists/HelpExchange/NewForm.aspx',
		    title: '  ',
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
Main.prototype.isUserInGroup = function (groupName) {

var userIsInGroup = false;
                    $.ajax({
                        async: false,
                        headers: { "accept": "application/json; odata=verbose" },
                        method: "GET",
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser/groups",
                        success: function (data) {
                            data.d.results.forEach(function (value) {
                                if (value.Title == groupName) {
                                    userIsInGroup = true;
                                }
                            });
                        },
                        error: function (response) {
                            console.log(response.status);
                        },
                    });
                    return userIsInGroup;
}
Main.prototype.showBtn = function (groupName) {
                var isApplicant = this.isUserInGroup("Заказчики Биржа");
                if (isApplicant ) {             
                $('.newTask').show();               
               } else{
               $('.newTask').hide();
               }

}

            Main.prototype.getTasks = function () {
                var self = this;
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
                    var clientContext = SP.ClientContext.get_current();
                    var oList = clientContext.get_web().get_lists().getByTitle('Биржа помощи');
                    var camlQuery = new SP.CamlQuery();
                    var camlToChange='';
                    if(window.location.href.indexOf('allrequests')>-1){
                    
                    camlToChange="<View><Query><Where><Eq><FieldRef Name='OgStatus'/><Value Type='Text'>Новая</Value></Eq></Where><OrderBy><FieldRef Name='Created' Ascending='false' /></OrderBy></Query></View>";
                    } else{
                    camlToChange="<View><Query><Where><Eq><FieldRef Name='OgStatus'/><Value Type='Text'>Новая</Value></Eq></Where><OrderBy><FieldRef Name='Created' Ascending='false' /></OrderBy></Query><RowLimit>5</RowLimit></View>";
                    }
                    camlQuery.set_viewXml(camlToChange);
                    self.bannersListItems = oList.getItems(camlQuery);
                    clientContext.load(self.bannersListItems);
                    clientContext.executeQueryAsync(Function.createDelegate(self, self.getTasksSuccessCallback), Function.createDelegate(self, self.errorCallback));
                });
            };
            Main.prototype.getTasksSuccessCallback = function (sender, args) {
                var listItemEnumerator = this.bannersListItems.getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    this.tasks.push(new Task(oListItem));
                }
                this.getExecutors();
            };
            Main.prototype.errorCallback = function (sender, args) {
                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            };

            
            Main.prototype.getExecutors = function () {
                var self = this;
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
                    var clientContext = SP.ClientContext.get_current();
                    var oList = clientContext.get_web().get_lists().getByTitle('Исполнители');
                    var camlQuery = new SP.CamlQuery();
                    camlQuery.set_viewXml("<View></View>");
                    self.executorsListItems = oList.getItems(camlQuery);
                    clientContext.load(self.executorsListItems);
                    clientContext.executeQueryAsync(Function.createDelegate(self, self.getExecutorsSuccessCallback), Function.createDelegate(self, self.errorExecutorsCallback));
                });
            };
            Main.prototype.getExecutorsSuccessCallback = function (sender, args) {
                var listItemEnumerator = this.executorsListItems.getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    this.executors.push(new Executor(oListItem));
                }
                    console.log(this.executors());
            };
            Main.prototype.errorExecutorsCallback = function (sender, args) {
                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            };







            Main.prototype.onFailure = function (sender, args) {

                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            }

            return Main;
        }());
        Pages.Main = Main;

        var Task = /** @class */ (function () {
            function Task(oListItem) {
                this.id = oListItem.get_id();
                this.title = oListItem.get_item('Title');
                this.HelpExchangeInitiatorUser = oListItem.get_item('HelpExchangeInitiatorUser').get_lookupValue();
                this.theme = oListItem.get_item('HelpExchangeTheme');
                this.link = "http://portal.pallet.ru/requests/Lists/HelpExchange/DispForm.aspx?ID="+this.id;
            }
            return Task;
        }());
        Pages.Task = Task;

        var Executor = /** @class */ (function () {
            function Executor(oListItem) {
                this.id = oListItem.get_id();
                this.HEexecutor = oListItem.get_item('HEexecutor').get_lookupValue();
                this.ExecutorId = oListItem.get_item('HEexecutor').get_lookupId();
                
                this.HEposition = oListItem.get_item('HEposition');
                this.HEdepartment = oListItem.get_item('HEdepartment');
                this.link = "http://portal.pallet.ru/requests/SitePages/room.aspx?user="+this.ExecutorId;
            }
            console.log(this.Executor);
            return Executor;
        }());
        Pages.Executor = Executor;
    })(Pages = Podeda.Pages || (Podeda.Pages = {}));
})(Podeda || (Podeda = {}));
//# sourceMappingURL=main.js.map














