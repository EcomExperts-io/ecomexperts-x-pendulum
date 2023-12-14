import {
  reactExtension,
  Text,
  BlockSpacer,
  useCartLines
} from '@shopify/ui-extensions-react/checkout';

import React, { useState } from 'react';



const thankYouPage = reactExtension(
  'purchase.thank-you.block.render',
  () => <Extension />,
);

export { thankYouPage };

function Extension() {
  let cartLines = useCartLines();
  const [hasPGC, setHasPGC] = useState(false);
  const [hasNutrition, setHasNutrition] = useState(false);

  let cartLinesLength = cartLines.length;
  for(var i=0 ; i < cartLinesLength ; ++i){
    let cartLineTitle = cartLines[i].merchandise.title;
    if(cartLineTitle.includes("Pendulum Glucose Control") ){
      setHasPGC(true);
    }
    let productIDRaw = cartLines[i].merchandise.product.id;
    let productIDRawArray = productIDRaw.split("/");
    let productID = productIDRawArray[productIDRawArray.length - 1];
    if(productID == "6546487541814"){
      setHasNutrition(true);
    }
  }

  return (
    hasPGC && hasNutrition ?
    <>
        <Text emphasis="bold">
          You'll be getting an additional email shortly with a link to schedule your initial nutrition counseling session!
        </Text>
        <BlockSpacer spacing="loose" />
    </> 
    : null
  );
}