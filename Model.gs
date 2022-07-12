class Model {
  
  constructor () {

    this.db = DbLib.getDataAccess(app.dbUrl)
  }

  addList(listName) {

    const ss = SpreadsheetApp.openByUrl(app.dbUrl)

    if(ss.getSheetByName(listName) === null) {
      ss.insertSheet().setName(listName)
      const data = [['last_id', 'top_row', ''], [0, 4, '' ], ['id', 'checked', 'list_item']]
      ss.getSheetByName(listName).getRange(1, 1, 3, 3).setValues(data)
      return
    }

    throw (`Server Error: Lista ${listName} on jo olemassa.`)
  }


  addItem (listName, itemName) {

    const table = this.db.getTable(listName)
    const allRecords = table.getAllRecords()
    const newRecord = table.getNewRecord()

    while (allRecords.hasNext) {
      if (allRecords.get('list_item') === itemName) {
        throw (`Server Error: Nimike ${itemName} on jo olemassa`)
      }
      allRecords.next()
    }
    
    newRecord.set('list_item', itemName)
    table.insertOneRecord(newRecord)
    return table.getLastId()
  }


  checkItem(listName, id, checked) {

    const table = this.db.getTable(listName)
    try {
      const item = table.getOneRecord(id)

      if (checked) {
        item.set('checked', 'checked')
      } else {
        item.set('checked', '')
      }  
      
      table.updateRecords(item)
    }
    catch (err) {
      throw (`Server Error: ${err}`)
    }
  }


  clearAll (listName) {

    const table = this.db.getTable(listName)
    const items = table.getAllRecords()

    while (items.hasNext) {

      items.set('checked', '')
      items.next()
    }

    table.updateRecords(items)
  }


  deleteItem (listName, id) {

    const table = this.db.getTable(listName)

    try {
      table.deleteOneRecord(id)
    }
    catch (err) {
      throw (`Server Error: ${err}`)
    }
  }


  deleteList(listName) {

    const ss = SpreadsheetApp.openByUrl(app.dbUrl)
    const sheet = ss.getSheetByName(listName)

    if(sheet === null) {
      throw (`Server Error: Listaa nimeltä "${listName}" ei tunnistettu.`)
    }

    ss.deleteSheet(sheet)
  }


  getItems(listName) {

    try {
      const table = this.db.getTable(listName)
      return table.getAllRecords().dataset
    }
    catch {
      throw (`Server Error: Listaa nimeltä "${listName}" ei tunnistettu.`)
    }

  }


  getLists() {

    const ss = SpreadsheetApp.openByUrl(app.dbUrl)
    const sheets = ss.getSheets()

    let lists = []
    sheets.forEach(sheet => {
      lists.push(sheet.getName())
    })

    return lists
  }


  renameItem(listName, id, newName) {

    const table = this.db.getTable(listName)

    try{
      const item = table.getOneRecord(id)

      item.set('list_item', newName)
      table.updateRecords(item)
    }
    catch (err) {
      throw (`Server Error: ${err}`)
    }
  }


  renameList (oldName, newName) {

    const ss = SpreadsheetApp.openByUrl(app.dbUrl)
    const table1 = ss.getSheetByName(oldName)
    const table2 = ss.getSheetByName(newName)

    if (table1 === null || table2 !== null) {
      throw (`Server Error: Listaa  ${table1} ei löydy tai uusi nimi ${table2} on jo olemassa`)
    }

    table1.setName(newName)
  }

}




