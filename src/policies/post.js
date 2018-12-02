 // #1
 const ApplicationPolicy = require("./application");

 module.exports = class TopicPolicy extends ApplicationPolicy {
 
  // #2
   new() {
     //return this._isAdmin();
     return (this._isAdmin() || this.user != null)
   }
 
   create() {
     return (this._isAdmin() || this.user != null)
   }
 
  // #3
   edit() {
     return (this._isAdmin() || this._isOwner())
   }
 
   update() {
     return (this._isAdmin() || this._isOwner())
   }
 
   destroy() {
     return this.update();
   }
 }