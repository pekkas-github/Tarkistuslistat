app.dbUrl = 'https://docs.google.com/spreadsheets/d/1MbNoXjJj22XkY-zHuCYHMlb2N5w6eeEAqOuLFKBE9jc/edit#gid=0'
app.version = 'develop'


function test() {

  const m = new Model()
  const ss = SpreadsheetApp.openByUrl(app.dbUrl)

  t.run('getItems - Hae yksittäisen listan tiedot', () => {

    /* EXECUTE */

    let listRecords = m.getItems('TestList1').dataset

    /* ASSERT */

    t.isEqual(listRecords.length, 2, 'Koko listan pituus')
    t.isEqual(listRecords[1][0], 2, 'Tietue id')
    t.isEqual(listRecords[1][1], 'checked', 'Valintatieto')
    t.isEqual(listRecords[1][2], 'Item12', 'Nimikkeen nimi')
  })

  t.run('getItems - Hae listaa, jota ei ole olemassa -> ERROR', () => {

   /* EXECUTE */

    listRecords = m.getItems('TestList0')

  })

  t.run('getLists - Hae kaikkien taulujen nimet', () => {

    /* EXECUTE */

    const list = m.getLists()

    /* ASSERT */

    t.isEqual(list.length, 2, 'Taulujen lukumäärä')
    t.isEqual(list[0],'TestList1', 'Ensimmäisen taulun nimi')
    t.isEqual(list[1],'TestList2', 'Toisen taulun nimi')
  })

  t.run('addNewList - Uusi taulu uudella nimellä', () => {

    /* EXECUTE */

    const response = m.addList('NewList')

    /* ASSERT */

    const lists = m.getLists()

    t.isEqual(response, true, 'Lisäyksen kuittaus')
    t.isEqual(lists.length, 3, 'Taulujen lukumäärä')
  })

  t.run('addNewList - Taulun lisäys olemassa olevalla nimellä', () => {

    /* EXECUTE */

    const response = m.addList('NewList')

    /* ASSERT */

    const lists = m.getLists()

    t.isEqual(response, false, 'Taulu on jo olemassa')
    t.isEqual(lists.length, 3, 'Uutta taulua ei luotu')

  })

  t.run('deleteList - Poista olemassa oleva taulu', () => {

    /* EXECUTE */

    const response = m.deleteList('NewList')

    /* ASSERT */

    const lists = m.getLists()

    t.isEqual(response, true, 'Poiston kuittaus')
    t.isEqual(lists.length, 2, 'Taulu on poistettu')

  })

  t.run('deleteList - Poistettavaa taulua ei ole olemassa', () => {

    /* EXECUTE */

    const response = m.deleteList('NewList')

    /* ASSERT */

    const lists = m.getLists()

    t.isEqual(response, false, 'Taulua ei ole olemassa')
    t.isEqual(lists.length, 2, 'Uusi taulukoita ei poistettu')

  })

  t.run('renameList - Nimettävä lista löytyy ja uusi nimi on uniikki', () => {

    /* EXECUTE */

    const response = m.renameList('TestList1', 'RenamedList')

    /* ASSERT */

    t.isEqual(response, true, 'Listan nimi on muutettu')
    t.isEqual(m.getLists()[0], 'RenamedList', 'Nimi muutettu')

  })

  t.run('renameList - Nimettävää listaa ei löydy ja uusi nimi on uniikki', () => {

    /* EXECUTE */

    const response = m.renameList('TestList1', 'NewName')

    /* ASSERT */

    t.isEqual(response, false, 'Nimettävää listaa ei ole')

  })


  t.run('renameList - Uusi nimi on jo käytössä', () => {

    /* EXECUTE */

    const response = m.renameList('TestList2', 'RenamedList')

    /* ASSERT */

    t.isEqual(response, false, 'Nimi on jo käytössä')

    /* RESET */

    ss.getSheetByName('RenamedList').setName('TestList1')
  })



   t.run('addItem - Uusi nimike uudella nimellä', () => {

    /* EXECUTE */

    const response = m.addItem('TestList1', 'Item13')

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(response, true, 'Lisäyksen kuittaus')
    t.isEqual(items.length, 3, 'Nimikkeiden lukumäärä')
    t.isEqual(items[2][0], 3, 'Tietue id')
    t.isEqual(items[2][1], '', 'Valintatieto')
    t.isEqual(items[2][2], 'Item13', 'Nimikkeen nimi')

  })

  t.run('addItem - Uusi nimike olemassa olevalla nimellä', () => {

    /* EXECUTE */

    const response = m.addItem('TestList1', 'Item13')

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(response, false, 'Lisäyksen kuittaus')
    t.isEqual(items.length, 3, 'Nimikkeiden lukumäärä')

  })

  t.run('renameItem - Nimikkeen nimen muutos', () => {

    /* EXECUTE */

    m.renameItem('TestList1', 3, 'NewName')

    /*ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(items[2][2], 'NewName', 'Muutettu nimi')

  })

  t.run('checkItem - Merkitse / poista merkintä', () => {

    /* EXECUTE */

    m.checkItem('TestList1', 2, false)
    m.checkItem('TestList1', 3, true)

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(items[1][1], '', 'Valinta poistettu')
    t.isEqual(items[2][1], 'checked', 'Valinta asetettu')

  })

  t.run('clearAll - Poista kaikki merkinnät', () => {
    
    /* SETUP */

    m.checkItem('TestList1', 2, true)

    /* EXECUTE */

    m.clearAll('TestList1')

    /* ASSERT */

    const items = m.getItems('TestList1')
    t.isEqual(items[1][1], '', 'Merkintä poistettu')
    t.isEqual(items[2][1], '', 'Merkintä poistettu')

  })

  t.run('deleteItem - Nimikkeen poistaminen', () => {

    /* EXECUTE */

    m.deleteItem('TestList1', 3)
    const items = m.getItems('TestList1')

    /* ASSERT */

    t.isEqual(items.length, 2, 'Nimikkeiden määrä')

    /* RESET*/

    const sheet = ss.getSheetByName('TestList1') 
    const rng = sheet.getRange(1, 1, 5, 3)
    const values = rng.getValues()

    values[1][0] = 2
    values[4][1] = 'checked'

    rng.setValues(values)
  
  })

}

