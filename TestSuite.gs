app.dbUrl = 'https://docs.google.com/spreadsheets/d/1MbNoXjJj22XkY-zHuCYHMlb2N5w6eeEAqOuLFKBE9jc/edit#gid=0'
app.version = 'dev'


function test() {

  const m = new Model()
  const ss = SpreadsheetApp.openByUrl(app.dbUrl)

  const tbl1 = ss.getSheetByName('TestList1')
  const tbl1_repl = ss.getSheetByName('xTestList1_repl')

  t.beforeEach(() => {
    const values = tbl1_repl.getRange(1, 1, 5, 3).getValues()
    tbl1.clear()
    tbl1.getRange(1, 1, 5, 3).setValues(values)
  })

  t.run('getItems - Hae yksittäisen listan tiedot', () => {

    /* EXECUTE */

    let listRecords = m.getItems('TestList1')

    /* ASSERT */

    t.isEqual(listRecords.length, 2, 'Koko listan pituus')
    t.isEqual(listRecords[1][0], 2, 'Tietue id')
    t.isEqual(listRecords[1][1], 'checked', 'Valintatieto')
    t.isEqual(listRecords[1][2], 'Item12', 'Nimikkeen nimi')
  })

  t.run('getItems - Hae listaa, jota ei ole olemassa (ERROR)', () => {

   /* EXECUTE */

    listRecords = m.getItems('TestList0')

    /* ASSERT */

  })

  t.run('getLists - Hae kaikkien taulujen nimet', () => {

    /* EXECUTE */

    const list = m.getLists()

    /* ASSERT */

    t.isEqual(list.length, 3, 'Taulujen lukumäärä')
  })

  t.run('addNewList - Uusi taulu uudella nimellä', () => {

    /* EXECUTE */

    const response = m.addList('NewList')

    /* ASSERT */

    const lists = m.getLists()

    t.isEqual(lists.length, 4, 'Taulujen lukumäärä')
  })

  t.run('addNewList - Taulun lisäys olemassa olevalla nimellä (ERROR)', () => {

    /* EXECUTE */

    const response = m.addList('NewList')

    /* ASSERT */

    const lists = m.getLists()

  })

  t.run('deleteList - Poista olemassa oleva taulu', () => {

    /* EXECUTE */

    const response = m.deleteList('NewList')

    /* ASSERT */

    const lists = m.getLists()

    t.isEqual(lists.length, 3, 'Taulu on poistettu')

  })

  t.run('deleteList - Poistettavaa taulua ei ole olemassa (=> ERROR)', () => {

    /* EXECUTE */

    const response = m.deleteList('NewList')

    /* ASSERT */

    const lists = m.getLists()

    t.isEqual(lists.length, 3, 'Uusia taulukoita ei poistettu')

  })

  t.run('renameList - Nimettävä lista löytyy ja uusi nimi on uniikki', () => {

    /* EXECUTE */

    const response = m.renameList('TestList1', 'RenamedList')

    /* ASSERT */

    t.isEqual(m.getLists().sort()[0], 'RenamedList', 'Nimi muutettu')

  })

  t.run('renameList - Nimettävää listaa ei löydy ja uusi nimi on uniikki (=> ERROR)', () => {

    /* EXECUTE */

    const response = m.renameList('TestList1', 'NewName')

    /* ASSERT */

  
  })


  t.run('renameList - Uusi nimi on jo käytössä (=> ERROR)', () => {

    /* EXECUTE */

    const response = m.renameList('TestList2', 'RenamedList')

    /* ASSERT */

  })

  /* RESET */

  ss.getSheetByName('RenamedList').setName('TestList1')


   t.run('addItem - Uusi nimike uudella nimellä', () => {

    /* EXECUTE */

    const response = m.addItem('TestList1', 'Item13')

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(response, 3, 'Nimikkeen id')
    t.isEqual(items.length, 3, 'Nimikkeiden lukumäärä')
    t.isEqual(items[2][0], 3, 'Tietue id')
    t.isEqual(items[2][1], '', 'Valintatieto')
    t.isEqual(items[2][2], 'Item13', 'Nimikkeen nimi')

  })

  t.run('addItem - Uusi nimike olemassa olevalla nimellä', () => {

    /* EXECUTE */

    const response = m.addItem('TestList1', 'Item12')

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(response, false, 'Lisäyksen kuittaus')
    t.isEqual(items.length, 2, 'Nimikkeiden lukumäärä')

  })

  t.run('renameItem - Nimikkeen nimen muutos', () => {

    /* EXECUTE */

    m.renameItem('TestList1', 2, 'NewName')

    /*ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(items[1][2], 'NewName', 'Muutettu nimi')

  })

  t.run('checkItem - Merkitse / poista merkintä', () => {

    /* EXECUTE */

    m.checkItem('TestList1', 1, true)
    m.checkItem('TestList1', 2, false)

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(items[0][1], 'checked', 'Valinta asetettu')
    t.isEqual(items[1][1], '', 'Valinta poistettu')

  })

  t.run('clearAll - Poista kaikki merkinnät', () => {
    
    /* SETUP */

    m.checkItem('TestList1', 2, true)

    /* EXECUTE */

    m.clearAll('TestList1')

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(items[0][1], '', 'Merkintä poistettu')
    t.isEqual(items[1][1], '', 'Merkintä poistettu')

  })

  t.run('deleteItem - Nimikkeen poistaminen', () => {

    /* EXECUTE */

    m.deleteItem('TestList1', 2)
    const items = m.getItems('TestList1')

    /* ASSERT */

    t.isEqual(items.length, 1, 'Nimikkeiden määrä')

  
  })

}

function runSingleTest() {
  const m = new Model()
  
  t.run('deleteList - Taulua ei löydy', () => {
    m.deleteList('Huihai')
  })
}

