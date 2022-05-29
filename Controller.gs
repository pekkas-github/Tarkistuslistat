class Controller {

  constructor () {

    this.model = new Model()
  }

  loadFrontPage (e) {

    const html = HtmlService.createTemplateFromFile('FrontPage')

    html.url = ScriptApp.getService().getUrl()
    html.version = app.version

    return html.evaluate().setTitle('Tarkistuslistat')
  }

  loadListPage (params) {

    const html = HtmlService.createTemplateFromFile('ListPage')

    html.listName = params.listName
    html.version = app.version

    return html.evaluate().setTitle('Tarkistuslistat')
  }
  

  addItem (params) {

    const listName = params[0]
    const itemName = params[1]

    this.model.addItem(listName, itemName)
    return this.model.getItems(listName)
  }

  checkItem (params) {

    const listName = params[0]
    const id = params[1]
    const checked = params[2]

    this.model.checkItem(listName, id, checked)
  }

  clearAll (listName) {

    this.model.clearAll(listName)
    return this.model.getItems(listName)
  }

  createList (listName) {
    
    this.model.addList(listName)
    return this.model.getLists()
  }

  deleteItem (params) {

    const listName = params[0]
    const id = params[1]

    this.model.deleteItem(listName, id)
    return this.model.getItems(listName)
  }


  deleteList(listName) {

    this.model.deleteList(listName)
    return this.model.getLists()
  }


  getFrontPageLists (e) {
    
    return this.model.getLists()
  }

  getListPageItems(listName) {
  
    return this.model.getItems(listName)
    
  }


  renameItem(params) {
    const listName = params[0]
    const id = params[1]
    const newName = params[2]

    this.model.renameItem(listName, id, newName)
    return this.model.getItems(listName)
  }


  renameList(params) {

    const oldName = params[0]
    const newName = params[1]

    this.model.renameList(oldName, newName)
    return this.model.getLists()
  }

}