
var Item = new ParseObjectType('List');
var listUrl = "http://api.nal.usda.gov/ndb/list?format=json&lt=f&sort=n&api_key=YLIkwhqQfeeQzpc5BEapcCO4vrXtCuXEgsx2jIxN";

$(document).ready(function() {
  //Activates API call using the url that has a list of all products
  callApi(listUrl);

  //calls the API
  function callApi(endpoint) {
      $.ajax({
          url: endpoint,
          method: "GET",
          dataType: "json",
          success: function (response){
            if (endpoint === listUrl){
              onListSuccess(response);
            } else {
              onSearchSuccess(response);
            }
          }
      })
  }

  //After successful API call using the list url
  function onListSuccess(data){
    var allData = data.list.item;
    var name = '';
    var id;
    //console.log(allData);
    foodArray = [];
    //re-format data to value/label structure required by autocomplete widget
    allData.forEach(function(item){
        var newObj = {
          value: item.id,
          label: item.name
        }
        foodArray.push(newObj);
    });
    $(function(){
      //autocomplete widget to provide dropdown menu that updates as user types
      $("#foodItems").autocomplete({
        source: foodArray,
        select: function( event, ui ){
          name = ui.item.label;
          id = ui.item.value;
          var itemObj = {
            text: name,
            value: id
          };
          //Takes the selected item from dropdown menu and creates a new object in db/adds to shopping list
          Item.create({ text: name, value: id}, function(err, result) {
            if (err) {
              console.error(err);
            } else {
              itemObj.objectId = result.objectId;
              itemObj.isCustom = false;
              renderItem(itemObj);
              //clears search bar after selection
              $('#foodItems').val('');
              var searchUrl = "http://api.nal.usda.gov/ndb/reports/?ndbno=" + itemObj.value + "&type=f&format=json&api_key=YLIkwhqQfeeQzpc5BEapcCO4vrXtCuXEgsx2jIxN";

              callApiSearch(searchUrl);

              function callApiSearch(endpoint) {
                  $.ajax({
                      url: endpoint,
                      method: "GET",
                      dataType: "json",
                      success: function (response){
                        var allData = response.report.food.nutrients;
                        addNutrients(allData);
                      }
                  })
              }
            }
          });
        }
      })
    });
  };

  //Function that attaches nutrition information to the objects in allData. Started with just calcium as exmample/test
  function addNutrients($itemEl){
    $itemEl.forEach(function(item){
        if (item.nutrient_id === 301){
          calcium = item.value;
          var calciumUnit = item.unit;
        }
      })
  }

  $('#customForm').submit(function(event) {
    event.preventDefault();
    // clear search bar after selection
    var customItem = $('#customItem').val();
    $('#customItem').val('');

    // create section for items data in db
    var itemObj = {
      text: customItem
    };

    Item.create({text: customItem}, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        itemObj.objectId = result.objectId;
        itemObj.isCustom = true;
        renderItem(itemObj);
        console.log(itemObj)
      }
    });
  });

  showNutrients();

  //Function that ideally would display the nutrition info when item is clicked. But I had trouble accessing the stored nutrition info
  function showNutrients(){
    var $list = $('ul.shopping-list');
    $list.on('click', 'li', function() {
      //if ($this.attr('id')){
        $(this).css( "color", "red" );
        console.log('Display information about nutrients');
    //  }
    })
  };

  callRemove();
  //Delete option for list items
  function callRemove() {
    $('.shopping-list').on('click', '.fa', function(e) {
      var $this = $(this);
      if ($this.hasClass('delete')) {
        removeItem($this.closest('.item'));
      }
    });

    function removeItem($itemEl) {
      var itemId = $itemEl.data('id');

      Item.remove(itemId, function(err) {
        if (err) {
          console.error(err);
        } else {
          $('[data-id="' + itemId + '"]').remove();
        }
      });
    }

    Item.getAll(function(err, items) {
      if (err) {
        console.error(err);
      } else {
        //console.log(items)
        items.forEach(renderItem);
      }
    });
  }

  function renderItem(itemData) {
    var html = compile(itemData);
    $('.shopping-list').append(html);
  }

  function compile(itemData) {
    var source = $("#item-template").html();
    var template = Handlebars.compile(source);
    var html = template(itemData);
    return html;
  }
});
