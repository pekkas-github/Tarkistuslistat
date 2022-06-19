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
      return true
    }
    else {
      return false
    }
  }


  addItem (listName, itemName) {

    const table = this.db.getTable(listName)
    const allRecords = table.getAllRecords()
    const newRecord = table.getNewRecord()

    while (allRecords.hasNext) {
      if (allRecords.get('list_item') === itemName) {
        return false
      }
      allRecords.next()
    }
    
    newRecord.set('list_item', itemName)
    table.insertOneRecord(newRecord)
    return true  
  }


  checkItem(listName, id, checked) {

    const table = this.db.getTable(listName)
    const item = table.getOneRecord(id)

    if (checked) {
      item.set('checked', 'checked')
    } else {
      item.set('checked', '')
    }  
    
    table.updateRecords(item)

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

    table.deleteOneRecord(id)
  }


  deleteList(listName) {

    const ss = SpreadsheetApp.openByUrl(app.dbUrl)
    const sheet = ss.getSheetByName(listName)

    if(sheet === null) {
      return false
    }
    else {
      ss.deleteSheet(sheet)
      return true
    }
  }


  getItems(listName) {

    let table = {}
    
    try {
      table = this.db.getTable(listName)
    }
    catch {
      return false
    }

    return table.getAllRecords().dataset
  }


  getLists() {

    const ss = SpreadsheetApp.openByUrl(app.dbUrl)
    const sheets = ss.getSheets()

    let list = []
    sheets.forEach(sheet => {
      list.push(sheet.getName())
    })

    return list.sort()
  }


  renameItem(listName, id, newName) {

    const table = this.db.getTable(listName)
    const item = table.getOneRecord(id)

    item.set('list_item', newName)
    table.updateRecords(item)

  }


  renameList (oldName, newName) {

    const ss = SpreadsheetApp.openByUrl(app.dbUrl)
    const table1 = ss.getSheetByName(oldName)
    const table2 = ss.getSheetByName(newName)

    if (table1 === null || table2 !== null) {
      return false
    }

    table1.setName(newName)
    return true
  }



}




