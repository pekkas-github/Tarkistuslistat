app.dbID = '1MbNoXjJj22XkY-zHuCYHMlb2N5w6eeEAqOuLFKBE9jc'
app.version = 'dev'

function testInfo() {TestFrame.getInfo()}
function dbInfo() {DbLib2.getInfo()}

function test() {
  const t  = TestFrame.getTestFrame()
  const db = DbLib2.getDataAccess(app.dbID)

  const m  = new Model()
  const ss = SpreadsheetApp.openById(app.dbID)

  const tbl1 = ss.getSheetByName('TestList1')
  const tbl1_repl = ss.getSheetByName('xTestList1_repl')

  t.test('Test Model.cs', () => {

    t.beforeEach(() => {
      const values = tbl1_repl.getRange(1, 1, 5, 3).getValues()
      tbl1.clear()
      tbl1.getRange(1, 1, 5, 3).setValues(values)
    })

    t.run('getItems - Hae yksittäisen listan tiedot', () => {
      
      /* EXECUTE */
      const listRecords = m.getItems('TestList1')

      /* ASSERT */
      t.isEqual(listRecords.length, 2, 'Koko listan pituus')
      t.isEqual(listRecords[1].id, 2, 'Tietue id')
      t.isEqual(listRecords[1].checked, 'checked', 'Valintatieto')
      t.isEqual(listRecords[1].list_item, 'Item12', 'Nimikkeen nimi')
    })

    t.run('getItems - Hae listaa, jota ei ole olemassa (ERROR)', () => {

      /* SETUP */
      t.errorExpected('Server Error: Listaa nimeltä "TestList0" ei tunnistettu.')

      /* EXECUTE */
        const listRecords = m.getItems('TestList0')

      /* ASSERT */

    })

    t.run('getLists - Hae kaikkien taulujen nimet', () => {

      /* EXECUTE */
      const list = m.getLists()

      /* ASSERT */
      t.isEqual(list.length, 3, 'Taulujen lukumäärä')
      t.isEqual(list[1], 'TestList2', 'Toisen listan nimi')
    })

    t.run('addNewList - Uusi taulu uudella nimellä', () => {

      /* EXECUTE */
      const response = m.addList('NewList')

      /* ASSERT */
      const lists = m.getLists()

      t.isEqual(lists.length, 4, 'Taulujen lukumäärä')
      t.isEqual(lists[0], 'NewList', 'Lisätyn listan nimi')
    })

    t.run('addNewList - Taulun lisäys olemassa olevalla nimellä (ERROR)', () => {

      /* SETUP */
      t.errorExpected('Server Error: Lista NewList on jo olemassa.')

      /* EXECUTE */
      const response = m.addList('NewList')

      /* ASSERT */
    })

    t.run('deleteList - Poista olemassa oleva taulu', () => {

      /* EXECUTE */
      m.deleteList('NewList')

      /* ASSERT */
      const lists = m.getLists()

      t.isEqual(lists.length, 3, 'Taulu on poistettu')

    })

    t.run('deleteList - Poistettavaa taulua ei ole olemassa (=> ERROR)', () => {

      /* SETUP */
      t.errorExpected('Server Error: Listaa nimeltä "NewList" ei tunnistettu.')

      /* EXECUTE */
      m.deleteList('NewList')

      /* ASSERT */
    })

    t.run('renameList - Nimettävä lista löytyy ja uusi nimi on uniikki', () => {

      /* EXECUTE */
      m.renameList('TestList1', 'RenamedList')

      /* ASSERT */
      const lists = m.getLists()
      t.isEqual(lists[0], 'RenamedList', 'Listan muutettu nimi')

    })

    t.run('renameList - Nimettävää listaa ei löydy ja uusi nimi on uniikki (=> ERROR)', () => {

      /* SETUP */
      t.errorExpected('Server Error: Listaa  TestList1 ei löydy tai uusi nimi NewName on jo olemassa')
      /* EXECUTE */
      m.renameList('TestList1', 'NewName')

      /* ASSERT */
    
    })


    t.run('renameList - Uusi nimi on jo käytössä (=> ERROR)', () => {

      /* SETUP */
      t.errorExpected('Server Error: Listaa  TestList2 ei löydy tai uusi nimi RenamedList on jo olemassa')

      /* EXECUTE */
      m.renameList('TestList2', 'RenamedList')

      /* ASSERT */

    })

  /* RESET */
    db.renameTable('RenamedList', 'TestList1')


    t.run('addItem - Uusi nimike uudella nimellä', () => {

      /* EXECUTE */
      const response = m.addItem('TestList1', 'Item13')

      /* ASSERT */
      const items = m.getItems('TestList1')
      t.isEqual(response, 3, 'Nimikkeen id')
      t.isEqual(items.length, 3, 'Nimikkeiden lukumäärä')
      t.isEqual(items[2].id, 3, 'Tietue id')
      t.isEqual(items[2].checked, '', 'Valintatieto')
      t.isEqual(items[2].list_item, 'Item13', 'Nimikkeen nimi')

    })

    t.run('addItem - Uusi nimike olemassa olevalla nimellä', () => {
      /* SETUP */
      t.errorExpected('Server Error: Nimike Item12 on jo olemassa')
      /* EXECUTE */
      m.addItem('TestList1', 'Item12')

      /* ASSERT */

    })
  
    t.run('addItem - Annettua listaa ei löydy', () => {
      /* SETUP */
      t.errorExpected('Taulua TestList0 ei löydy')
      /* EXECUTE */
      m.addItem('TestList0', 'Item14')

      /* ASSERT */

    })

    t.run('renameItem - Nimikkeelle uusi nimi', () => {

      /* EXECUTE */
      m.renameItem('TestList1', 2, 'NewName')

      /*ASSERT */
      const items = m.getItems('TestList1')
      t.isEqual(items[1].list_item, 'NewName', 'Muutettu nimi')

    })
    t.run('renameItem - Nimike on jo olemassa', () => {
      /* SETUP */
      t.errorExpected('Nimike MyItem111 on jo olemassa')

      /* EXECUTE */
      m.renameItem('TestList1', 2, 'MyItem111')

      /*ASSERT */

    })
    t.run('renameItem - Listaa ei ole olemassa', () => {
      /* SETUP */
      t.errorExpected('Taulua TestList0 ei löydy')

      /* EXECUTE */
      m.renameItem('TestList0', 2, 'Item2')

      /*ASSERT */

    })

    t.run('checkItem - Merkitse / poista merkintä', () => {

      /* EXECUTE */
      m.checkItem('TestList1', 1, true)
      m.checkItem('TestList1', 2, false)

      /* ASSERT */
      const items = m.getItems('TestList1')
      t.isEqual(items[0].checked, 'checked', 'Valinta asetettu')
      t.isEqual(items[1].checked, '', 'Valinta poistettu')

    })

    t.run('clearAll - Poista kaikki merkinnät', () => {
      
      /* SETUP */
      m.checkItem('TestList1', 1, true)
      m.checkItem('TestList1', 2, true)

      /* EXECUTE */
      m.clearAll('TestList1')

      /* ASSERT */
      const items = m.getItems('TestList1')
      t.isEqual(items[0].checked, '', 'Merkintä poistettu')
      t.isEqual(items[1].checked, '', 'Merkintä poistettu')

    })

    t.run('deleteItem - Nimikkeen poistaminen', () => {

      /* EXECUTE */

      m.deleteItem('TestList1', 2)
      const items = m.getItems('TestList1')

      /* ASSERT */

      t.isEqual(items.length, 1, 'Nimikkeiden määrä')
    
    })
  })
}

function runSingleTest() {
  const t = TestFrame.getTestFrame()
  const db = DbLib2.getDataAccess(app.dbID)
  const m = new Model()

  t.test('Single Test', () => {
  
    t.run('deleteItem - Nimikkeen poistaminen', () => {

      /* EXECUTE */

      m.deleteItem('TestList1', 2)
      const items = m.getItems('TestList1')

      /* ASSERT */

      t.isEqual(items.length, 1, 'Nimikkeiden määrä')
    
    })

  })
}

