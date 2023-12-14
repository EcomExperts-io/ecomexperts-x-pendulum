import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useDiscountCodes,
  useSettings,
  useCartLines,
  useApplyCartLinesChange
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

async function handleAddToCart(variantId) {

  const applyCartLinesChange = useApplyCartLinesChange();
 
  
  const result = await applyCartLinesChange({
    type: 'addCartLine',
    merchandiseId: ("gid://shopify/ProductVariant/" + variantId),
    quantity: 1,
    attributes: [{key: "FreeMealPlan", value: "true"}]
  });
 
  if (result.type === 'error') {
   
    console.error(result.message)

  }

}

async function removeProduct(cartLineId) {

  const applyCartLinesChange = useApplyCartLinesChange();
  const result = await applyCartLinesChange({
    type: 'removeCartLine',
    id: cartLineId,
    quantity: 1,
  });
 
  if (result.type === 'error') {
   
    console.error(result.message)

  }

}



function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const discountCodes = useDiscountCodes();
  const customSettings = useSettings();
  const discountArray = customSettings.discount_codes;
  const addonId = customSettings.addon_id;
  let addFreeProduct = false;
  

  if(discountArray){
    for(var i=0 ; i < discountCodes.length ; ++i){
      if(discountArray.indexOf(discountCodes[i].code) != -1){
        addFreeProduct = true;
        break;
      }
    }
  }

  
  let productPresent = false;
  let variantId = "";
  const cartLines = useCartLines();
  let cartLineId = "";
  for(var i=0;i < cartLines.length; ++i){
    
    let varientIdLinkArray = cartLines[i].merchandise.id.split("/");
    variantId = varientIdLinkArray[varientIdLinkArray.length-1];
   
    if(variantId == addonId){
      cartLineId = cartLines[i].id;
      productPresent = true;
    }
  }
  
  if(addFreeProduct && !productPresent){
    handleAddToCart(addonId);
  }else if(!addFreeProduct && productPresent){
    removeProduct(cartLineId);
  }

  return (
    null
  );
}
