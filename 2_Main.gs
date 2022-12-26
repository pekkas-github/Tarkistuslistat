
/* Initialization */

  const controller = new Controller()


/*  API Router */

const route = {}

// pages
route.frontPage = controller.loadFrontPage

//data
route.createList = controller.createList.bind(controller)
route.deleteList = controller.deleteList.bind(controller)
route.getFrontPageLists = controller.getFrontPageLists.bind(controller)
route.getListPageItems = controller.getListPageItems.bind(controller)
route.renameList = controller.renameList.bind(controller)

route.addItem = controller.addItem.bind(controller)
route.checkItem = controller.checkItem.bind(controller)
route.clearAll = controller.clearAll.bind(controller)
route.deleteItem = controller.deleteItem.bind(controller)
route.renameItem = controller.renameItem.bind(controller)



/* Application entry points */

function doGet (e) {
  
  if (route[e.parameter.page]) {
    return route[e.parameter.page](e.parameter)
  } else {
    return route.frontPage(e)
  }
}


function apiCall (functionName, ...parameters) {

    return route[functionName](parameters)
}


/* Utilities */

function include (filename) {

  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}