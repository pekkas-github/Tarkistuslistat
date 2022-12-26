class Model {
  
  constructor () {

    this.db = DbLib2.getDataAccess(app.dbID)
  }

  addList(listName) {

    try {
      this.db.insertTable(listName, ['id', 'checked', 'list_item'])
    }
    catch {
      throw new Error(`Server Error: Lista ${listName} on jo olemassa.`)
    }

  }


  addItem (listName, itemName) {

    const table = this.db.getTable(listName)
    const allRecords = table.getRecords()
    const newRecord = table.newRecord()

    allRecords.forEach( item => {
      if (item.list_item === itemName) {
        throw new Error(`Server Error: Nimike ${itemName} on jo olemassa`)
      }
    })
    
    newRecord.list_item = itemName
    return table.insertRecord(newRecord)
  }


  checkItem(listName, id, checked) {

    const table = this.db.getTable(listName)
    const item = table.getRecord(id)

    item.checked = (checked) ? 'checked' : ''
    
    table.updateRecord(item)
  }


  clearAll (listName) {

    const table = this.db.getTable(listName)
    const items = table.getRecords()

    items.forEach( item => {
      item.checked = ''
    })

    table.updateRecords(items)
  }


  deleteItem (listName, id) {

    const table = this.db.getTable(listName)
    table.deleteRecord(id)

  }


  deleteList(listName) {

    try {
      this.db.deleteTable(listName)
    }
    catch {
      throw new Error(`Server Error: Listaa nimeltä "${listName}" ei tunnistettu.`)
    }

  }


  getItems(listName) {

    try {
      const table = this.db.getTable(listName)
      return table.getRecords()
    }
    catch {
      throw new Error(`Server Error: Listaa nimeltä "${listName}" ei tunnistettu.`)
    }

  }


  getLists() {

    return this.db.getTableNames()

  }


  renameItem(listName, id, newName) {

    const table = this.db.getTable(listName)
    const items = table.getRecords()
    const item  = table.getRecord(id)

    items.forEach( thisItem => {
      if (thisItem.list_item === newName) {
        throw new Error(`Nimike ${newName} on jo olemassa`)
      }
    })

    item.list_item = newName
    table.updateRecord(item)
  }


  renameList (oldName, newName) {

    try {
      this.db.renameTable(oldName, newName)
    }
    catch {
      throw new Error(`Server Error: Listaa  ${oldName} ei löydy tai uusi nimi ${newName} on jo olemassa`)
    }

  }

}




