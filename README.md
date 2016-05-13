# final-proj

I was not able to devote as much time to this as I would have liked, this is still in pretty rough shape. I hope to keep working out the kinds and polishing things off down the road, but submitting for now.

In its ideal/finished form, this app would:

Part 1:
Allow users to create grocery lists
  - Either by entering search terms that the app checks against the USDA's API
  - Or by entering a custom grocery item into a form field
  - In either case, the item is added to the list, and persists until the user chooses to delete it (with an X button)
  
This part I completed, athough I never had time to fix the pagination issue with the API, so the search function only accesses the first 
50 or so items, and they all start with "A".

An additional challenge is that this list has really specific/weird things, and the categories are all squeezed into a single "name" field, separated by commas,
with a varying number of categories from item to item. That makes it really hard to use this list, and it would be pretty impractical as a real feature.

Part 2:
I wanted to have the app relay some nutritional information about the food items back to the user. This was where I really struggled.
I tested out an example with calcium -- the addNutrients function iterates through the data returned by a second ajax call -- (the first ajax call
just fetches the list of items, the second fetches a detailed list of nutrition information for a single food item, by ID) -- finds the mg of Calcium per serving and stores that in a variable

I wanted to have that information display in a tooltip or something on hover of each item, but was not able to get there. 

